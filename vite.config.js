import { defineConfig } from 'vite';
import path from 'path';
import { playwright } from '@vitest/browser-playwright';
import { generateCssPropsMap } from './build/plugins/generate-css-props-map';
import { generateRuntimeProperties } from './build/plugins/generate-runtime-properties';

export default defineConfig(({ mode }) => {
  const isRuntime = process.env.BUILD_TYPE === 'runtime';

  return {
    server: {
      port: 3000,
    },
    build: {
      outDir: isRuntime ? 'dist' : 'dist/module',
      lib: isRuntime
        ? {
            entry: path.resolve(__dirname, 'src/runtime.ts'),
            name: 'Maple',
            formats: ['iife'],
            fileName: () => 'maple.js',
          }
        : {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Maple',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
          },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
      target: 'es2018',
      minify: true,
      emptyOutDir: false,
    },
    plugins: [generateCssPropsMap(), generateRuntimeProperties()],
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
