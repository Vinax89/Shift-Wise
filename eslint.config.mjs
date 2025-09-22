// eslint.config.mjs — Flat config for Next 15 + TS (App Router)
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  // Ignores
  {
    ignores: [
      '.next/**',
      '.vercel/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'public/**',
      '**/*.min.*',
    ],
  },

  // Base JS
  js.configs.recommended,

  // TypeScript (includes type-aware rules via project service)
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // App code (web/SSR)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // No need to list projects; faster and robust with TS 5+
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        // RSC globals
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // Next best practice bundle
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off', // Next/Image prefers rel rewrite

      // TS hygiene
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],

      // Mild on console in app code; tighten in CI if you like
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Server-only / Node files (Next config, scripts, Firebase Functions)
  {
    files: [
      '**/*.config.{js,cjs,mjs,ts}',
      'scripts/**/*.{js,ts}',
      'functions/**/*.{js,ts}',
    ],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Tests (Vitest/Playwright if you add them)
  {
    files: ['**/*.{test,spec}.ts', '**/*.{test,spec}.tsx', 'e2e/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, vi: true, describe: true, it: true, expect: true },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
