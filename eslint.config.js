import eslintJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'src/generated']),
  {
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: { direct: true },
        },
      ],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowTernary: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { caughtErrors: 'all', caughtErrorsIgnorePattern: '^ignore' },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
    },
  },
  // Brower Environment (Source)
  {
    files: ['src/**/*.{ts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Node Environment (Build, Scripts, Tests, Configs)
  {
    files: [
      'build/**/*.{ts}',
      'scripts/**/*.{ts}',
      'tests/**/*.{ts}',
      '*.config.js',
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-restricted-exports': 'off',
    },
  },
]);
