import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { playwright } from '@vitest/browser-playwright';
import { defaultUtilities } from './build/default-utilities';
import { propertiesShortMap } from './build/properties-short-map';
import { propertiesWeightMap } from './build/properties-weight-map';

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
                  Number(propertiesWeightMap[a] ?? 0),
            );
          const content = `// ⚠️ AUTO-GENERATED — DO NOT EDIT
export const CSS_PROP_MAP = ${JSON.stringify(sortedProps, null, 2)} as const;
  `;
          const outFile = path.resolve(__dirname, 'src/generated/css-props.ts');

          fs.mkdirSync(path.dirname(outFile), { recursive: true });
          fs.writeFileSync(outFile, content);
        },
      },
      {
        name: 'generate-runtime-properties',
        apply: 'build',
        async buildStart() {
          const { chromium } = await import('playwright');
          const { propertiesWordShortMap } =
            await import('./src/engines/maple/properties-word-short-map.ts');

          const sortedProps = defaultUtilities
            .split(',')
            .sort((a, b) =>
              propertiesShortMap[a]
                ? -1
                : Number(propertiesWeightMap[b] ?? 0) -
                  Number(propertiesWeightMap[a] ?? 0),
            );

          const browser = await chromium.launch();
          const page = await browser.newPage();

          const result = await page.evaluate(
            ({ sortedProps, propertiesShortMap, propertiesWordShortMap }) => {
              const element = document.createElement('div');

              function normalizeWords(words) {
                return words.map((w) => {
                  const key = w.toLowerCase();
                  if (propertiesWordShortMap[key]) {
                    return {
                      text: propertiesWordShortMap[key],
                      fixed: true,
                      original: key,
                    };
                  }
                  return { text: w, fixed: false, original: key };
                });
              }

              function findRelationAndKey(words) {
                const key = words
                  .map((w) => (typeof w === 'object' ? w.original : w))
                  .join('-');

                element.style[key] = '#000000';
                element.style[key] = '1rem';

                const rel =
                  element.style[key] === '1rem'
                    ? 'd'
                    : !!element.style[key]
                      ? 'c'
                      : 'o';
                element.style[key] = '';
                return { key, rel };
              }

              const res = {
                shortMap: {},
                utilityMap: {},
              };

              for (const prop of sortedProps) {
                if (res.shortMap[prop]) continue;

                const rawWords = prop.match(/([A-Z]?[a-z]+|[XY])/g) || [];
                const words = normalizeWords(rawWords);

                if (propertiesShortMap[prop]) {
                  res.shortMap[propertiesShortMap[prop]] = prop;
                  res.utilityMap[prop] = findRelationAndKey(words);
                  continue;
                }

                const maxLen = words.map((w) => w.text.length);
                const take = words.map((w) => (w.fixed ? w.text.length : 1));

                const initials = words
                  .map((w, i) => (w.fixed ? w.text : w.text[0].toLowerCase()))
                  .join('');

                if (!res.shortMap[initials]) {
                  res.shortMap[initials] = prop;
                  res.utilityMap[prop] = findRelationAndKey(words);
                  continue;
                }

                let expandIndex = words.length - 1;
                let found = null;

                while (expandIndex >= 0) {
                  const candidate = words
                    .map((w, i) => w.text.slice(0, take[i]))
                    .join('')
                    .toLowerCase();

                  if (!res.shortMap[candidate]) {
                    found = candidate.toLowerCase();
                    break;
                  }

                  if (take[expandIndex] < maxLen[expandIndex]) {
                    take[expandIndex]++;
                  } else {
                    expandIndex--;
                  }
                }

                if (found) {
                  res.shortMap[found] = prop;
                  res.utilityMap[prop] = findRelationAndKey(words);
                }
              }
              return res;
            },
            {
              sortedProps,
              propertiesShortMap,
              propertiesWordShortMap,
            },
          );

          await browser.close();

          const outFile = path.resolve(
            __dirname,
            'src/generated/properties-runtime.json',
          );
          fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
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
  };
});
