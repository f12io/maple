import { supportedCssProperties } from '../data/supported-css-properties.data';
import { prepareContent, writeFile } from '../helpers/file.helper';
import { abbreviationMap } from './abbreviation-map';

export function precalculatePropAbbreviations() {
  return {
    name: 'generate-precalculated-css-prop-abbreviations',
    apply: 'build',
    buildStart() {
      writeFile(
        prepareContent(
          `export const PRECALCULATED_PROP_ABBREVIATIONS: Record<string, string> = ${generateAbbrMap()};`,
        ),
        'precalculated-prop-abbreviations',
      );
    },
  };
}

function generateAbbrMap() {
  const assignedShorts: Record<string, string> = {};
  const props = supportedCssProperties.split(',');
  const rWordParts = /([A-Z]?[a-z]+|[XY])/g;

  for (const prop of props) {
    let alias = prop;

    // Check Full Property Override
    if (abbreviationMap[prop]) {
      alias = abbreviationMap[prop];
    } else {
      // Split and Create Shortcut
      // e.g. "backgroundColor" -> ["bg", "c"]
      const parts = prop.match(rWordParts) ?? [];

      if (parts.length > 0) {
        let shortCount = 0;
        const shortcutParts = parts.map((part) => {
          const short = abbreviationMap[part.toLowerCase()];

          if (short) {
            shortCount++;
            return short;
          }

          return part;
        });

        if (shortCount === parts.length) {
          alias = shortcutParts.join('');
        }
      }
    }

    // Collision Check
    if (
      alias &&
      alias !== prop &&
      (!assignedShorts[alias] || assignedShorts[alias] === prop)
    ) {
      assignedShorts[alias] = prop;
    }
  }

  return JSON.stringify(assignedShorts, null, 2).replace(/"([^"]+)":/g, '$1:');
}
