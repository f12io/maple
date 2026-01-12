import {
  DEFAULT_ANGLE_UNIT,
  DEFAULT_SPACE_UNIT,
  DEFAULT_TIME_UNIT,
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
} from '../../../src/core/constants';
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
          DEFAULT_SPACE_UNIT,
          DEFAULT_TIME_UNIT,
          DEFAULT_ANGLE_UNIT,
        }) => {
          let element: HTMLDivElement | null = null;
          const REGEX_LOWERCASE_UPPERCASE = /([a-z])([A-Z])/g;

          function resolveType(propKey: string): number {
            const propKeyKebab = propKey
              .replace(REGEX_LOWERCASE_UPPERCASE, '$1-$2')
              .toLowerCase();
            element ??= document.createElement('div');
            let type = PROP_TYPE_OTHER;

            element.style.setProperty(propKeyKebab, '#000000');

            if (element.style.getPropertyValue(propKeyKebab)) {
              type = PROP_TYPE_COLOR;
            }

            const spaceValue = '1' + DEFAULT_SPACE_UNIT;
            element.style.setProperty(propKeyKebab, spaceValue);

            if (element.style.getPropertyValue(propKeyKebab) === spaceValue) {
              type = PROP_TYPE_SPACE;
            } else {
              const timeValue = '1' + DEFAULT_TIME_UNIT;
              element.style.setProperty(propKeyKebab, timeValue);

              if (element.style.getPropertyValue(propKeyKebab) === timeValue) {
                type = PROP_TYPE_SPACE;
              } else {
                const angleValue = '1' + DEFAULT_ANGLE_UNIT;
                element.style.setProperty(propKeyKebab, angleValue);

                if (
                  element.style.getPropertyValue(propKeyKebab) === angleValue
                ) {
                  type = PROP_TYPE_SPACE;
                }
              }
            }

            element.style.setProperty(propKeyKebab, null);

            return type;
          }

          return supportedCssProperties
            .split(',')
            .reduce<Record<string, number>>(
              (acc, prop) => ({
                ...acc,
                [prop]: resolveType(prop),
              }),
              {},
            );
        },
        {
          supportedCssProperties,
          PROP_TYPE_OTHER,
          PROP_TYPE_COLOR,
          PROP_TYPE_SPACE,
          DEFAULT_SPACE_UNIT,
          DEFAULT_TIME_UNIT,
          DEFAULT_ANGLE_UNIT,
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
