import js from '@eslint/js';
import reactQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // --------------------------------------------------
  // Global ignores
  // --------------------------------------------------
  globalIgnores(['dist']),

  // --------------------------------------------------
  // React App (src)
  // --------------------------------------------------
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,

      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactDom.configs.recommended,
      reactQuery.configs['flat/recommended'],

      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // React reality
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',

      // Prefer types in app code
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },

  // --------------------------------------------------
  // Netlify Functions / Server Code
  // --------------------------------------------------
  {
    files: ['netlify/**/*.{ts,js}'],
    extends: [js.configs.recommended, tseslint.configs.strictTypeChecked, eslintConfigPrettier],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Server code should be stricter
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // Interfaces okay for contracts
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },

  // --------------------------------------------------
  // Tooling / Config files
  // --------------------------------------------------
  {
    files: ['*.config.{ts,js}', 'vite.config.ts', 'eslint.config.ts'],
    extends: [js.configs.recommended, eslintConfigPrettier],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Don’t type-check config files
      '@typescript-eslint/*': 'off',
    },
  },

  // --------------------------------------------------
  // Tests (Vitest / Jest)
  // --------------------------------------------------
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, eslintConfigPrettier],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      // Tests can be messy
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // Async test helpers often float
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
]);
