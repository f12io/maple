import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startRuntime } from '../../src';

// Default Breakpoints
/* {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} */

const findCSSRule = (
  sheet: CSSStyleSheet,
  media: string,
  containerName?: string,
): CSSLayerBlockRule | CSSMediaRule | CSSContainerRule | null => {
  const rules = Array.from(sheet.cssRules) as Array<
    CSSLayerBlockRule | CSSMediaRule | CSSContainerRule
  >;
  if (!media) {
    return rules.find((rule) => rule instanceof CSSLayerBlockRule) || null;
  }
  return (
    rules.find(
      (rule) =>
        (!!containerName
          ? rule instanceof CSSContainerRule &&
            rule.containerName === containerName.replace('none', '')
          : true) &&
        (rule as CSSMediaRule | CSSContainerRule).conditionText === media,
    ) || null
  );
};

const cases = [
  {
    name: 'container queries default breakpoint',
    input: 'p-1 md:p-2 @md:p-4',
    parentSelect: 'app',
    computeSelect: 'child',
    resolutions: [440, 800, 800],
    expected: [
      {
        media: '',
        containerName: '',
        selectorText: '.p-1',
        styleRules: {
          padding: 'var(--padding-1, var(--base-1, 0.25rem))',
        },
        computed: '4px',
      },
      {
        containerName: '',
        media: '(min-width: 768px)',
        selectorText: '.md\\:p-2',
        styleRules: {
          padding: 'var(--padding-2, var(--base-2, 0.5rem))',
        },
        computed: '8px',
      },
      {
        containerName: 'none',
        media: '(min-width: 768px)',
        selectorText: '.\\@md\\:p-4',
        styleRules: {
          padding: 'var(--padding-4, var(--base-4, 1rem))',
        },
        computed: '16px',
      },
    ],
  },
  {
    name: 'container queries custom breakpoint',
    input: 'p-1 md:p-2 @min=650px:p-4',
    parentSelect: 'app',
    computeSelect: 'child',
    resolutions: [440, 800, 800],
    expected: [
      {
        media: '',
        containerName: '',
        selectorText: '.p-1',
        styleRules: {
          padding: 'var(--padding-1, var(--base-1, 0.25rem))',
        },
        computed: '4px',
      },
      {
        containerName: '',
        media: '(min-width: 768px)',
        selectorText: '.md\\:p-2',
        styleRules: {
          padding: 'var(--padding-2, var(--base-2, 0.5rem))',
        },
        computed: '8px',
      },
      {
        containerName: 'none',
        media: '(min-width: 650px)',
        selectorText: '.\\@min\\=650px\\:p-4',
        styleRules: {
          padding: 'var(--padding-4, var(--base-4, 1rem))',
        },
        computed: '16px',
      },
    ],
  },
];

describe('Maple Responsive', () => {
  let disconector: any = null;
  beforeAll(async () => {
    await page.viewport(1920, 800);
    disconector = startRuntime();
    const div = document.createElement('div');
    div.id = 'app';
    div.setAttribute('data-testid', 'app');

    const child = document.createElement('div');
    child.id = 'child';
    child.className = 'child';
    child.setAttribute('data-testid', 'child');

    const child2 = document.createElement('div');
    child2.id = 'child2';
    child2.className = 'child2';
    child2.style.width = '100px';
    child2.style.height = '100px';
    child2.setAttribute('data-testid', 'child2');

    child.appendChild(child2);
    div.appendChild(child);
    document.body.appendChild(div);
  });
  beforeEach(() => {
    disconector();
    const div = document.querySelector('#app') as HTMLDivElement;
    div.className = '';
    const child = document.querySelector('.child') as HTMLDivElement;
    child.className = 'child';
    const child2 = document.querySelector('.child2') as HTMLDivElement;
    child2.className = 'child2';
    disconector = startRuntime();
  });
  it.each(cases)(
    '$name',
    async ({ input, expected, computeSelect, parentSelect, resolutions }) => {
      const parent = page.getByTestId(parentSelect).element() as HTMLDivElement;

      const el = page.getByTestId(computeSelect).element() as HTMLDivElement;
      const sheet = document.styleSheets[1];
      for (let i = 0; i < resolutions.length; i++) {
        el.classList.add(...input.split(' '));
        const resolution = resolutions[i];
        await page.viewport(resolution, 800);
        if (!expected[i]) {
          continue;
        }
        const containerName = expected[i].containerName;
        if (containerName) {
          parent.classList.add(
            containerName === 'none'
              ? `@container`
              : `@container(${containerName})`,
          );
        }
        const rule = findCSSRule(
          sheet,
          expected[i].media,
          containerName || '',
        ) as any;
        await new Promise((r) => setTimeout(r, 1));

        await Promise.all([
          page.getByTestId('app').hover(),
          page.getByTestId('child').hover(),
          page.getByTestId('child2').hover(),
        ]);
        const computed = getComputedStyle(
          page.getByTestId(computeSelect).element(),
        ).paddingTop;
        await Promise.all([
          page.getByTestId('app').unhover(),
          page.getByTestId('child').unhover(),
          page.getByTestId('child2').unhover(),
        ]);
        const styleRule = (rule?.cssRules?.[1] ||
          rule?.cssRules?.[0]) as CSSStyleRule;
        const styleRules = Object.keys(expected[i].styleRules).reduce(
          (acc, key) => {
            acc[key] = (styleRule as CSSStyleRule)?.style?.getPropertyValue(
              key,
            );
            return acc;
          },
          {} as Record<string, string>,
        );
        expect({
          media: rule?.conditionText || '',
          selectorText: styleRule?.selectorText,
          styleRules,
          computed,
          containerName: rule?.containerName === '' ? 'none' : '',
        }).toEqual(expected[i]);
      }
    },
  );
});
