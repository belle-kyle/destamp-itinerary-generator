/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    'turbo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksConditionals: false,
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-floating-promises': ['warn'],
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    indent: [1, 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-wrapper-object-types': 'error',
    // Replaces the removed `@typescript-eslint/ban-types` rule (v8+).
    // Old config allowed `{}` (`types: { '{}': false }`) — keep that.
    '@typescript-eslint/no-empty-object-type': [
      'error',
      {
        allowObjectTypes: 'always',
        allowInterfaces: 'always',
      },
    ],
    // RN/Metro codebases legitimately use require() for assets/native modules.
    '@typescript-eslint/no-require-imports': 'off',
    'react/no-unescaped-entities': 0,
  },
  ignorePatterns: [
    '**/.eslintrc.cjs',
    '**/*.config.js',
    '**/*.config.cjs',
    'packages/config/**',
    'dist',
    'pnpm-lock.yaml',
  ],
  reportUnusedDisableDirectives: true,
};

module.exports = config;
