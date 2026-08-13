/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import nativewind from 'nativewind/preset';
import type { Config } from 'tailwindcss';

import baseConfig from '@destamp/tailwind-config';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [nativewind, baseConfig],
} satisfies Config;
