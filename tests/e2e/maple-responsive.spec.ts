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
  media: string
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
        (rule as CSSMediaRule | CSSContainerRule).conditionText === media
    ) || null
  );
};

const cases = [
  {
    name: 'default breakpoints',
    input: 'p-1 sm:p-2 md:p-3 lg:p-4 xl:p-5 2xl:p-6',
    computeSelect: 'app',
    resolutions: [440, 680, 800, 1200, 1400, 1920],
    expected: [
      {
        media: '',
        selectorText: '.p-1',
        styleRules: {
          padding: 'var(--padding-1, var(--base-1, 0.25rem))',
        },
        computed: '4px',
      },
      {
        media: '(min-width: 640px)',
        selectorText: '.sm\\:p-2',
        styleRules: {
          padding: 'var(--padding-2, var(--base-2, 0.5rem))',
        },
        computed: '8px',
      },
      {
        media: '(min-width: 768px)',
        selectorText: '.md\\:p-3',
        styleRules: {
          padding: 'var(--padding-3, var(--base-3, 0.75rem))',
        },
        computed: '12px',
      },
      {
        media: '(min-width: 1024px)',
        selectorText: '.lg\\:p-4',
        styleRules: {
          padding: 'var(--padding-4, var(--base-4, 1rem))',
        },
        computed: '16px',
      },
      {
        media: '(min-width: 1280px)',
        selectorText: '.xl\\:p-5',
        styleRules: {
          padding: 'var(--padding-5, var(--base-5, 1.25rem))',
        },
        computed: '20px',
      },
      {
        media: '(min-width: 1536px)',
        selectorText: '.\\32 xl\\:p-6',
        styleRules: {
          padding: 'var(--padding-6, var(--base-6, 1.5rem))',
        },
        computed: '24px',
      },
    ],
  },
  {
    name: 'default breakpoints with custom min-width breakpoint',
    input: 'p-1 sm:p-2 md:p-3 lg:p-4 xl:p-5 2xl:p-6 min=720px:p-3.5',
    computeSelect: 'app',
    resolutions: [440, 680, 740, 800, 1200, 1400, 1920],
    expected: [
      {
        media: '',
        selectorText: '.p-1',
        styleRules: {
          padding: 'var(--padding-1, var(--base-1, 0.25rem))',
        },
        computed: '4px',
      },
      {
        media: '(min-width: 640px)',
        selectorText: '.sm\\:p-2',
        styleRules: {
          padding: 'var(--padding-2, var(--base-2, 0.5rem))',
        },
        computed: '8px',
      },
      {
        media: '(min-width: 720px)',
        selectorText: '.min\\=720px\\:p-3\\.5',
        styleRules: {
          padding: 'var(--padding-3\\.5, var(--base-3\\.5, 0.875rem))',
        },
        computed: '14px',
      },
      {
        media: '(min-width: 768px)',
        selectorText: '.md\\:p-3',
        styleRules: {
          padding: 'var(--padding-3, var(--base-3, 0.75rem))',
        },
        computed: '12px',
      },
      {
        media: '(min-width: 1024px)',
        selectorText: '.lg\\:p-4',
        styleRules: {
          padding: 'var(--padding-4, var(--base-4, 1rem))',
        },
        computed: '16px',
      },
      {
        media: '(min-width: 1280px)',
        selectorText: '.xl\\:p-5',
        styleRules: {
          padding: 'var(--padding-5, var(--base-5, 1.25rem))',
        },
        computed: '20px',
      },
    ],
  },
  {
    name: 'default breakpoints with max-width default breakpoint',
    input: 'p-1 sm:p-2 md:p-3 lg:p-4 xl:p-5 2xl:p-6 max-sm:p-3.5',
    computeSelect: 'app',
    resolutions: [440, 680, 800, 1200, 1400, 1920],
    expected: [
      {
        media: '(max-width: 640px)',
        selectorText: '.max-sm\\:p-3\\.5',
        styleRules: {
          padding: 'var(--padding-3\\.5, var(--base-3\\.5, 0.875rem))',
        },
        computed: '14px',
      },
      {
        media: '(min-width: 640px)',
        selectorText: '.sm\\:p-2',
        styleRules: {
          padding: 'var(--padding-2, var(--base-2, 0.5rem))',
        },
        computed: '8px',
      },
      {
        media: '(min-width: 768px)',
        selectorText: '.md\\:p-3',
        styleRules: {
          padding: 'var(--padding-3, var(--base-3, 0.75rem))',
        },
        computed: '12px',
      },
      {
        media: '(min-width: 1024px)',
        selectorText: '.lg\\:p-4',
        styleRules: {
          padding: 'var(--padding-4, var(--base-4, 1rem))',
        },
        computed: '16px',
      },
      {
        media: '(min-width: 1280px)',
        selectorText: '.xl\\:p-5',
        styleRules: {
          padding: 'var(--padding-5, var(--base-5, 1.25rem))',
        },
        computed: '20px',
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
    disconector = startRuntime();
    const div = document.querySelector('#app') as HTMLDivElement;
    div.className = '';
    const child = document.querySelector('.child') as HTMLDivElement;
    child.className = 'child';
    const child2 = document.querySelector('.child2') as HTMLDivElement;
    child2.className = 'child2';
  });
  it.each(cases)(
    '$name',
    async ({ input, expected, computeSelect, resolutions }) => {
      const el = page.getByTestId(computeSelect).element() as HTMLDivElement;
      const sheet = document.styleSheets[1];
      for (let i = 0; i < resolutions.length; i++) {
        el.classList.add(...input.split(' '));
        const resolution = resolutions[i];
        await page.viewport(resolution, 800);
        if (!expected[i]) {
          continue;
        }
        const rule = findCSSRule(sheet, expected[i].media) as any;
        await new Promise((r) => setTimeout(r, 1));

        await Promise.all([
          page.getByTestId('app').hover(),
          page.getByTestId('child').hover(),
          page.getByTestId('child2').hover(),
        ]);
        const computed = getComputedStyle(
          page.getByTestId(computeSelect).element()
        ).paddingTop;
        await Promise.all([
          page.getByTestId('app').unhover(),
          page.getByTestId('child').unhover(),
          page.getByTestId('child2').unhover(),
        ]);
        const styleRule = rule?.cssRules?.[0] as CSSStyleRule;
        const styleRules = Object.keys(expected[i].styleRules).reduce(
          (acc, key) => {
            acc[key] = (styleRule as CSSStyleRule)?.style?.getPropertyValue(
              key
            );
            return acc;
          },
          {} as Record<string, string>
        );
        expect({
          media: rule?.conditionText || '',
          selectorText: styleRule?.selectorText,
          styleRules,
          computed,
        }).toEqual(expected[i]);
      }
    }
  );
});
