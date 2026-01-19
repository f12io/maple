import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vite';
import { prepareExamples } from './build/plugins/prepare-examples';
import { precalculatePropAbbreviations } from './build/plugins/prop-abbr-precalculator';
import { precalculatePropTypes } from './build/plugins/prop-type-precalculator';

export default defineConfig(({ mode }) => {
  const isRuntime = process.env.BUILD_TYPE === 'runtime';
  const isWatch = process.argv.includes('--watch');
  const isTest = mode === 'test';
  const plugins = [];

  if (!isTest) {
    plugins.push(precalculatePropAbbreviations());
    if (!isRuntime) {
      plugins.push(precalculatePropTypes());
    } else {
      plugins.push(prepareExamples());
    }
  }

  return {
    server: {
      port: 3000,
    },
    build: {
      watch: isWatch
        ? {
            include: ['src/**'],
            exclude: ['src/generated/**'],
          }
        : undefined,
      outDir: isRuntime ? 'dist' : 'dist/module',
      target: 'es2024',
      minify: 'terser',
      emptyOutDir: false,
      terserOptions: {
        compress: {
          defaults: true,
          passes: 2,
          drop_console: !isTest && !isWatch,
        },
        format: { comments: false },
      },
      lib: isRuntime
        ? {
            entry: path.resolve(__dirname, 'src/runtime.ts'),
            name: 'Maple',
            formats: ['iife'],
            fileName: () => 'maple.js',
          }
        : {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Maple Module',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
          },
      rollupOptions: {
        output: {
          inlineDynamicImports: isRuntime,
        },
      },
    },
    resolve: {
      alias: {
        'internal:escape-class':
          isRuntime || isTest
            ? path.resolve(__dirname, 'src/core/helpers/escape-class.ts')
            : path.resolve(
                __dirname,
                'src/core/helpers/escape-class-polyfill.ts',
              ),
        'internal:precalculated-prop-types':
          isRuntime || isTest
            ? path.resolve(
                __dirname,
                'src/core/constants/precalculated-prop-types.ts',
              )
            : path.resolve(
                __dirname,
                'src/generated/precalculated-prop-types.ts',
              ),
      },
    },
    plugins,
    test: {
      browser: {
        provider: playwright(),
        enabled: true,
        instances: [
          {
            name: 'chromium',
            browser: 'chromium',
            headless: true,
          },
        ],
      },
      globals: true,
    },
  };
});
