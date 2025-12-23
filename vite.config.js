import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { playwright } from '@vitest/browser-playwright';
import { defaultUtilities } from './build/default-utilities';
import { propertiesShortMap } from './build/properties-short-map';
import { propertiesWeightMap } from './build/properties-weight-map';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: 'src/runtime.ts',
      name: 'Maple',
      formats: ['iife'],
      fileName: () => 'maple.runtime.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    target: 'es2018',
    minify: true,
  },
  plugins: [
    {
      name: 'generate-css-props-map',
      apply: 'build',
      buildStart() {
        const sortedProps = defaultUtilities
          .split(',')
          .sort((a, b) =>
            propertiesShortMap[a]
              ? -1
              : Number(propertiesWeightMap[b] ?? 0) -
                Number(propertiesWeightMap[a] ?? 0)
          );
        const content = `// ⚠️ AUTO-GENERATED — DO NOT EDIT
export const CSS_PROP_MAP = ${JSON.stringify(sortedProps, null, 2)} as const;
  `;
        const outFile = path.resolve(__dirname, 'src/generated/css-props.ts');

        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, content);
      },
    },
  ],
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
});
