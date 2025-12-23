import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { startRuntime } from '../../src';

const cases = [
  {
    name: 'hover',
    input: 'hover:p-4',
    expected: {
      selectorText: '.hover\\:p-4:hover',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'focus',
    input: 'focus:p-4',
    expected: {
      selectorText: '.focus\\:p-4:focus',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'active',
    input: 'active:p-4',
    expected: {
      selectorText: '.active\\:p-4:active',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'visited',
    input: 'visited:p-4',
    expected: {
      selectorText: '.visited\\:p-4:visited',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'disabled',
    input: 'disabled:p-4',
    expected: {
      selectorText: '.disabled\\:p-4:disabled',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'checked',
    input: 'checked:p-4',
    expected: {
      selectorText: '.checked\\:p-4:checked',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'first-child',
    input: 'first:p-4',
    expected: {
      selectorText: '.first\\:p-4:first-child',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'last',
    input: 'last:p-4',
    expected: {
      selectorText: '.last\\:p-4:last-child',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'odd',
    input: 'odd:p-4',
    expected: {
      selectorText: '.odd\\:p-4:nth-child(2n+1)',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'even',
    input: 'even:p-4',
    expected: {
      selectorText: '.even\\:p-4:nth-child(2n)',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
];
describe('Maple', () => {
  beforeAll(async () => {
    startRuntime();
    const div = document.createElement('div');
    div.id = 'app';
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
  it.each(cases)('$name', async ({ input, expected }) => {
    const div = document.body.querySelector('#app') as HTMLDivElement;
    div.classList.add(input);
    const sheet = document.styleSheets[1];
    const layer = sheet.cssRules[0] as CSSLayerBlockRule;
    await new Promise((r) => setTimeout(r, 1));
    const styleRules = Object.keys(expected.styleRules).reduce((acc, key) => {
      acc[key] = (layer.cssRules[0] as CSSStyleRule).style.getPropertyValue(
        key
      );
      return acc;
    }, {} as Record<string, string>);
    expect({
      selectorText: (layer.cssRules[0] as CSSStyleRule).selectorText,
      styleRules,
    }).toEqual(expected);
  });
});
