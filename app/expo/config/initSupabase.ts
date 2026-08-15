import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

import 'react-native-url-polyfill/auto';

// SecureStore rejects values over ~2048 bytes (a hard error starting in
// SDK 35), but Supabase sessions (access + refresh token + user metadata)
// routinely exceed that - so large values are split across multiple keys.
const CHUNK_SIZE = 1800;
const chunkCountKey = (key: string) => `${key}_chunks`;
const chunkKey = (key: string, index: number) => `${key}_${index}`;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    const chunkCount = await SecureStore.getItemAsync(chunkCountKey(key));
    if (!chunkCount) {
      return SecureStore.getItemAsync(key);
    }

    const chunks = await Promise.all(
      Array.from({ length: Number(chunkCount) }, (_, index) =>
        SecureStore.getItemAsync(chunkKey(key, index)),
      ),
    );
    return chunks.join('');
  },
  setItem: async (key: string, value: string) => {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.deleteItemAsync(chunkCountKey(key));
      await SecureStore.setItemAsync(key, value);
      return;
    }

    const chunkCount = Math.ceil(value.length / CHUNK_SIZE);
    await Promise.all(
      Array.from({ length: chunkCount }, (_, index) =>
        SecureStore.setItemAsync(
          chunkKey(key, index),
          value.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE),
        ),
      ),
    );
    await SecureStore.setItemAsync(chunkCountKey(key), String(chunkCount));
    await SecureStore.deleteItemAsync(key);
  },
  removeItem: async (key: string) => {
    const chunkCount = await SecureStore.getItemAsync(chunkCountKey(key));
    if (chunkCount) {
      await Promise.all(
        Array.from({ length: Number(chunkCount) }, (_, index) =>
          SecureStore.deleteItemAsync(chunkKey(key, index)),
        ),
      );
      await SecureStore.deleteItemAsync(chunkCountKey(key));
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const url = Constants.expoConfig?.extra?.SUPABASE_URL as string;
const key = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
