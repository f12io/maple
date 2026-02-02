import {
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
} from '../../../src/core/constants/config';
import { PRECALCULATED_PROP_TYPES } from '../../../src/core/constants/precalculated-prop-types';
import {
  DEFAULT_ANGLE_VALUE,
  DEFAULT_COLOR_VALUE,
  DEFAULT_SPACE_VALUE,
  DEFAULT_TIME_VALUE,
} from '../../../src/core/constants/units';
import { supportedCssProperties } from '../data/supported-css-properties.data';
import { prepareContent, writeFile } from '../helpers/file.helper';

export function precalculatePropTypes() {
  return {
    name: 'generate-precalculated-prop-types',
    apply: 'build',
    async buildStart() {
      const { chromium } = await import('playwright');
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const map = await page.evaluate(
        ({
          supportedCssProperties,
          PROP_TYPE_COLOR,
          PROP_TYPE_SPACE,
          PROP_TYPE_OTHER,
          DEFAULT_SPACE_VALUE,
          DEFAULT_TIME_VALUE,
          DEFAULT_ANGLE_VALUE,
          DEFAULT_COLOR_VALUE,
          PRECALCULATED_PROP_TYPES,
        }) => {
          let element: HTMLDivElement | null = null;
          const REGEX_LOWERCASE_UPPERCASE = /([a-z])([A-Z])/g;

          function resolveType(propKey: string): number {
            const propKeyKebab = propKey
              .replace(REGEX_LOWERCASE_UPPERCASE, '$1-$2')
              .toLowerCase();
            element ??= document.createElement('div');
            let type = PROP_TYPE_OTHER;

            if (typeof CSS === 'undefined') {
              return type;
            }

            if (
              CSS.supports(propKeyKebab, DEFAULT_SPACE_VALUE) ||
              CSS.supports(propKeyKebab, DEFAULT_ANGLE_VALUE) ||
              CSS.supports(propKeyKebab, DEFAULT_TIME_VALUE)
            ) {
              type = PROP_TYPE_SPACE;
            } else if (CSS.supports(propKeyKebab, DEFAULT_COLOR_VALUE)) {
              type = PROP_TYPE_COLOR;
            }

            return type;
          }

          return supportedCssProperties
            .split(',')
            .reduce<Record<string, number>>(
              (acc, prop) => ({
                ...acc,
                [prop]: PRECALCULATED_PROP_TYPES[prop] ?? resolveType(prop),
              }),
              {},
            );
        },
        {
          supportedCssProperties,
          PROP_TYPE_OTHER,
          PROP_TYPE_COLOR,
          PROP_TYPE_SPACE,
          DEFAULT_SPACE_VALUE,
          DEFAULT_TIME_VALUE,
          DEFAULT_ANGLE_VALUE,
          DEFAULT_COLOR_VALUE,
          PRECALCULATED_PROP_TYPES,
        },
      );

      await browser.close();

      const mapString = JSON.stringify(map, null, 2).replaceAll('"', '');

      writeFile(
        prepareContent(
          `export const PRECALCULATED_PROP_TYPES: Record<string, number> = ${mapString};`,
        ),
        'precalculated-prop-types',
      );
    },
  };
}
