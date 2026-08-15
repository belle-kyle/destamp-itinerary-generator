/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPublicKey, KeyObject } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { Algorithm, JwtPayload, verify } from 'jsonwebtoken';

import { MockContext } from '../types/types';

// Supabase signs access tokens asymmetrically (ES256 by default) rather than
// with the legacy shared "JWT Secret" - verification needs the current
// public signing key from Supabase's own JWKS endpoint, not a shared secret.
let cachedPublicKey: { key: KeyObject; alg: Algorithm } | null = null;

const getSupabasePublicKey = async () => {
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  const response = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  );
  const { keys } = (await response.json()) as {
    keys: { alg: Algorithm; [key: string]: unknown }[];
  };
  const jwk = keys[0];

  if (!jwk) {
    throw new Error('No signing keys found at Supabase JWKS endpoint.');
  }

  cachedPublicKey = {
    key: createPublicKey({ key: jwk as any, format: 'jwk' }),
    alg: jwk.alg,
  };
  return cachedPublicKey;
};

interface Context {
  prisma: PrismaClient;
  req: any;
  userId: string;
}

const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

const prisma = new PrismaClient();

const context: Context = {
  prisma,
  req: {},
  userId: '',
};

const createContext = async (request: any) => {
  try {
    const authHeader = request.req.headers['authorization'] as string;

    if (authHeader && authHeader !== null) {
      const token = authHeader.split(' ')[1] as string;

      const { key, alg } = await getSupabasePublicKey();
      const tokenPayload = verify(token, key, {
        algorithms: [alg],
      }) as JwtPayload;

      const userId = tokenPayload.sub;

      return {
        ...request,
        prisma,
        userId,
      };
    }
  } catch (err) {
    console.error('Failed to verify token', err);
  }

  return {
    ...request,
    prisma,
  };
};

export { context, createMockContext, createContext, prisma };
export type { Context };
