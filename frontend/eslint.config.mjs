import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      semi: ['error'],
      quotes: ['error', 'single'],
      'prefer-arrow-callback': ['error'],
      'prefer-template': ['error'],
    },
  }),
];

export default eslintConfig;
