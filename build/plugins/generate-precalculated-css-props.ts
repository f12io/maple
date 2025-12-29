import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supportedCssProperties } from '../supported-css-properties';
import { propertiesWeightMap } from '../properties-weight-map';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generatePrecalculatedCssProps() {
  return {
    name: 'generate-precalculated-css-props',
    apply: 'build',
    async buildStart() {
      const { chromium } = await import('playwright');
      // Import relative to this file
      const { propertiesShortMap } =
        await import('../../src/engines/maple/properties-short-map');

      const sortedProps = supportedCssProperties
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
        ({ sortedProps, propertiesShortMap }) => {
          const element = document.createElement('div');

          type WordPart = {
            text: string;
            fixed: boolean;
            original: string;
          };

          function normalizeWords(words: string[]): WordPart[] {
            return words.map((w) => {
              const key = w.toLowerCase();
              if (propertiesShortMap[key]) {
                return {
                  text: propertiesShortMap[key],
                  fixed: true,
                  original: key,
                };
              }
              return { text: w, fixed: false, original: key };
            });
          }

          function findRelationAndKey(words: (string | WordPart)[]) {
            const key = words
              .map((w) => (typeof w === 'object' ? w.original : w))
              .join('-');

            element.style.setProperty(key, '#000000');
            element.style.setProperty(key, '1rem');

            const val = element.style.getPropertyValue(key);
            const rel = val === '1rem' ? 'd' : !!val ? 'c' : 'o';
            element.style.removeProperty(key);
            return { key, rel };
          }

          const res: {
            shortMap: Record<string, string>;
            utilityMap: Record<string, { key: string; rel: string }>;
          } = {
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
        },
      );

      await browser.close();

      const outFile = path.resolve(
        __dirname,
        '../../src/generated/precalculated-css-props.ts',
      );
      const content = `// ⚠️ AUTO-GENERATED — DO NOT EDIT
export const precalculatedCssProps = ${JSON.stringify(result, null, 2).replace(
        /"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g,
        '$1:',
      )} as const;
`;
      fs.writeFileSync(outFile, content);
    },
  };
}
