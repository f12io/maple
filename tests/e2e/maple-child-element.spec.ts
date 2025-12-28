import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { startRuntime } from '../../src';

const cases = [
  {
    name: 'child element',
    input: '/.child:p-6',
    computeSelect: 'child',
    expected: {
      selectorText: '.\\/\\.child\\:p-6 .child',
      styleRules: {
        padding: 'var(--padding-6, var(--base-6, 1.5rem))',
      },
      computed: '24px',
    },
  },
  {
    name: 'child of child element',
    input: '/.child>.child2:p-6',
    computeSelect: 'child2',
    expected: {
      selectorText: '.\\/\\.child\\>\\.child2\\:p-6 .child > .child2',
      styleRules: {
        padding: 'var(--padding-6, var(--base-6, 1.5rem))',
      },
      computed: '24px',
    },
  },
  {
    name: 'child element with state',
    input: '/.child:hover:p-6',
    computeSelect: 'child',
    expected: {
      selectorText: '.\\/\\.child\\:hover\\:p-6 .child:hover',
      styleRules: {
        padding: 'var(--padding-6, var(--base-6, 1.5rem))',
      },
      computed: '24px',
    },
  },
  {
    name: 'child element child with state',
    input: '/.child>>.child2:hover:p-6',
    computeSelect: 'child2',
    expected: {
      selectorText:
        '.\\/\\.child\\>\\>\\.child2\\:hover\\:p-6 .child .child2:hover',
      styleRules: {
        padding: 'var(--padding-6, var(--base-6, 1.5rem))',
      },
      computed: '24px',
    },
  },
  {
    name: 'state with child element',
    input: 'hover:/.child:p-6',
    computeSelect: 'child',
    expected: {
      selectorText: '.hover\\:\\/\\.child\\:p-6:hover .child',
      styleRules: {
        padding: 'var(--padding-6, var(--base-6, 1.5rem))',
      },
      computed: '24px',
    },
  },
  {
    name: 'state with child element of child element',
    input: 'hover:/.child>>.child2:p-6',
    computeSelect: 'child2',
    expected: {
      selectorText:
        '.hover\\:\\/\\.child\\>\\>\\.child2\\:p-6:hover .child .child2',
      styleRules: {
        padding: 'var(--padding-6, var(--base-6, 1.5rem))',
      },
      computed: '24px',
    },
  },
];
describe('Maple Child Selector', () => {
  beforeAll(async () => {
    startRuntime();
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
    const div = document.body.querySelector('#app');
    div?.classList.remove(...(div.classList || []));
    const sheet = document.styleSheets[1];
    for (let i = 0; i < sheet.cssRules.length; i++) {
      for (
        let j = 0;
        (
          sheet.cssRules[i] as
            | CSSLayerBlockRule
            | CSSMediaRule
            | CSSContainerRule
        ).cssRules.length;
        j++
      ) {
        (
          sheet.cssRules[i] as
            | CSSLayerBlockRule
            | CSSMediaRule
            | CSSContainerRule
        ).deleteRule(0);
      }
    }
  });
  it.each(cases)('$name', async ({ input, expected, computeSelect }) => {
    const div = document.body.querySelector('#app') as HTMLDivElement;
    div.classList.add(input);
    const sheet = document.styleSheets[1];
    const layer = sheet.cssRules[0] as CSSLayerBlockRule;
    await new Promise((r) => setTimeout(r, 1));
    const styleRules = Object.keys(expected.styleRules).reduce(
      (acc, key) => {
        acc[key] = (layer.cssRules[0] as CSSStyleRule).style.getPropertyValue(
          key,
        );
        return acc;
      },
      {} as Record<string, string>,
    );
    let computed: any = getComputedStyle(
      page.getByTestId(computeSelect).element(),
    ).paddingTop;
    await Promise.all([
      page.getByTestId('app').hover(),
      page.getByTestId('child').hover(),
      page.getByTestId('child2').hover(),
    ]);
    computed = getComputedStyle(
      page.getByTestId(computeSelect).element(),
    ).paddingTop;
    await Promise.all([
      page.getByTestId('app').unhover(),
      page.getByTestId('child').unhover(),
      page.getByTestId('child2').unhover(),
    ]);

    expect({
      selectorText: (layer.cssRules[0] as CSSStyleRule).selectorText,
      styleRules,
      ...(computed ? { computed } : {}),
    }).toEqual(expected);
  });
});
