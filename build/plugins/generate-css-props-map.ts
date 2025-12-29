import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defaultUtilities } from '../default-utilities';
import { propertiesShortMap } from '../properties-short-map';
import { propertiesWeightMap } from '../properties-weight-map';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateCssPropsMap() {
  return {
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
export const SORTED_CSS_PROPS = ${JSON.stringify(sortedProps, null, 2)} as const;
  `;
      const outFile = path.resolve(
        __dirname,
        '../../src/generated/sorted-css-props.ts',
      );

      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, content);
    },
  };
}
