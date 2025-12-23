import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { startRuntime } from '../../src/index';

const cases = [
  /* ==================== SPACING ==================== */
  {
    name: 'padding',
    input: 'p-4',
    expected: {
      selectorText: '.p-4',
      styleRules: {
        padding: 'var(--padding-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'padding-x',
    input: 'px-2',
    expected: {
      selectorText: '.px-2',
      styleRules: {
        'padding-left': 'var(--padding-2, var(--base-2, 0.5rem))',
        'padding-right': 'var(--padding-2, var(--base-2, 0.5rem))',
      },
    },
  },
  {
    name: 'padding-y',
    input: 'py-6',
    expected: {
      selectorText: '.py-6',
      styleRules: {
        'padding-top': 'var(--padding-6, var(--base-6, 1.5rem))',
        'padding-bottom': 'var(--padding-6, var(--base-6, 1.5rem))',
      },
    },
  },
  {
    name: 'margin',
    input: 'm-1',
    expected: {
      selectorText: '.m-1',
      styleRules: {
        margin: 'var(--margin-1, var(--base-1, 0.25rem))',
      },
    },
  },

  /* ==================== SIZE ==================== */
  {
    name: 'width',
    input: 'w-10',
    expected: {
      selectorText: '.w-10',
      styleRules: {
        width: 'var(--width-10, var(--base-10, 2.5rem))',
      },
    },
  },
  {
    name: 'height',
    input: 'h-10',
    expected: {
      selectorText: '.h-10',
      styleRules: {
        height: 'var(--height-10, var(--base-10, 2.5rem))',
      },
    },
  },
  {
    name: 'size',
    input: 'size-10',
    expected: {
      selectorText: '.size-10',
      styleRules: {
        width: 'var(--size-10, var(--base-10, 2.5rem))',
        height: 'var(--size-10, var(--base-10, 2.5rem))',
      },
    },
  },
  {
    name: 'width svw',
    input: 'w-svw',
    expected: {
      selectorText: '.w-svw',
      styleRules: {
        width: '100svw',
      },
    },
  },
  {
    name: 'height dvh',
    input: 'h-dvh',
    expected: {
      selectorText: '.h-dvh',
      styleRules: {
        height: '100dvh',
      },
    },
  },

  /* ==================== TYPOGRAPHY ==================== */
  {
    name: 'font size',
    input: 'fs-lg',
    expected: {
      selectorText: '.fs-lg',
      styleRules: {
        'font-size': 'var(--font-size-lg, var(--base-lg))',
      },
    },
  },
  {
    name: 'font size number',
    input: 'fs-4',
    expected: {
      selectorText: '.fs-4',
      styleRules: {
        'font-size': 'var(--font-size-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'font weight',
    input: 'fw-bold',
    expected: {
      selectorText: '.fw-bold',
      styleRules: {
        'font-weight': 'var(--font-weight-bold, bold)',
      },
    },
  },
  {
    name: 'font weight number',
    input: 'fw-700',
    expected: {
      selectorText: '.fw-700',
      styleRules: {
        'font-weight': 'var(--font-weight-700, 700)',
      },
    },
  },
  {
    name: 'line height',
    input: 'lh-tight',
    expected: {
      selectorText: '.lh-tight',
      styleRules: {
        'line-height': 'var(--line-height-tight, var(--base-tight))',
      },
    },
  },
  {
    name: 'line height number',
    input: 'lh-4',
    expected: {
      selectorText: '.lh-4',
      styleRules: {
        'line-height': 'var(--line-height-4, var(--base-4, 1rem))',
      },
    },
  },
  {
    name: 'line height equality',
    input: 'lh=1.25',
    expected: {
      selectorText: '.lh\\=1\\.25',
      styleRules: {
        'line-height': '1.25',
      },
    },
  },

  /* ==================== COLORS ==================== */
  {
    name: 'text color',
    input: 'c-red-500',
    expected: {
      selectorText: '.c-red-500',
      styleRules: {
        color:
          'oklch(from var(--color-red, red) calc(calc(l + calc(l * 0)) * var(--ligtines-factor, 1)) calc(c * var(--chroma-factor, 1)) calc(h * var(--hue-factor, 1)) / alpha)',
      },
    },
  },
  {
    name: 'background color',
    input: 'bgc-blue-600',
    expected: {
      selectorText: '.bgc-blue-600',
      styleRules: {
        'background-color':
          'oklch(from var(--color-blue, blue) calc(calc(l + calc(l * -0.2)) * var(--ligtines-factor, 1)) calc(c * var(--chroma-factor, 1)) calc(h * var(--hue-factor, 1)) / alpha)',
      },
    },
  },
  {
    name: 'border color',
    input: 'bc-gray-300',
    expected: {
      selectorText: '.bc-gray-300',
      styleRules: {
        'border-color':
          'oklch(from var(--color-gray, gray) calc(calc(l + calc(calc(1 - l) * 0.4)) * var(--ligtines-factor, 1)) calc(c * var(--chroma-factor, 1)) calc(h * var(--hue-factor, 1)) / alpha)',
      },
    },
  },

  /* ==================== BORDERS ==================== */
  {
    name: 'border',
    input: 'b-2',
    expected: {
      selectorText: '.b-2',
      styleRules: {
        border: 'var(--border-2, var(--base-2, 0.5rem))',
      },
    },
  },
  {
    name: 'border style',
    input: 'bs-dashed',
    expected: {
      selectorText: '.bs-dashed',
      styleRules: {
        'border-style': 'var(--border-style-dashed, dashed)',
      },
    },
  },
  {
    name: 'border width',
    input: 'bw-2',
    expected: {
      selectorText: '.bw-2',
      styleRules: {
        'border-width': 'var(--border-width-2, var(--base-2, 0.5rem))',
      },
    },
  },
  {
    name: 'border radius',
    input: 'br-lg',
    expected: {
      selectorText: '.br-lg',
      styleRules: {
        'border-radius': 'var(--border-radius-lg, var(--base-lg))',
      },
    },
  },

  /* ==================== LAYOUT ==================== */
  {
    name: 'display flex',
    input: 'd-flex',
    expected: {
      selectorText: '.d-flex',
      styleRules: {
        display: 'var(--display-flex, flex)',
      },
    },
  },
  {
    name: 'display grid',
    input: 'd-grid',
    expected: {
      selectorText: '.d-grid',
      styleRules: {
        display: 'var(--display-grid, grid)',
      },
    },
  },
  {
    name: 'flex direction',
    input: 'fd-column',
    expected: {
      selectorText: '.fd-column',
      styleRules: {
        'flex-direction': 'var(--flex-direction-column, column)',
      },
    },
  },
  {
    name: 'align items',
    input: 'ai-center',
    expected: {
      selectorText: '.ai-center',
      styleRules: {
        'align-items': 'var(--align-items-center, center)',
      },
    },
  },
  {
    name: 'justify content',
    input: 'jc-space-between',
    expected: {
      selectorText: '.jc-space-between',
      styleRules: {
        'justify-content':
          'var(--justify-content-space-between, space-between)',
      },
    },
  },

  /* ==================== POSITION ==================== */
  {
    name: 'position relative',
    input: 'pos-relative',
    expected: {
      selectorText: '.pos-relative',
      styleRules: {
        position: 'var(--position-relative, relative)',
      },
    },
  },
  {
    name: 'top',
    input: 't-3',
    expected: {
      selectorText: '.t-3',
      styleRules: {
        top: 'var(--top-3, var(--base-3, 0.75rem))',
      },
    },
  },

  /* ==================== EFFECTS ==================== */
  {
    name: 'opacity',
    input: 'o-0.5',
    expected: {
      selectorText: '.o-0\\.5',
      styleRules: {
        opacity: 'var(--opacity-0\\.5, 0.5)',
      },
    },
  },
  {
    name: 'shadow',
    input: 'shadow-md',
    expected: {
      selectorText: '.shadow-md',
      styleRules: {
        'box-shadow': 'var(--box-shadow-md, md)',
      },
    },
  },

  /* ==================== TRANSFORM ==================== */
  {
    name: 'scale',
    input: 'scale-1.05',
    expected: {
      selectorText: '.scale-1\\.05',
      styleRules: {
        '--scale-x': 'var(--scale-1\\.05, var(--base-1\\.05, 1.05))',
        '--scale-y': 'var(--scale-1\\.05, var(--base-1\\.05, 1.05))',
        scale: 'var(--scale-x,)var(--scale-y,)',
      },
    },
  },
  {
    name: 'scale X',
    input: 'scale-x-1.05',
    expected: {
      selectorText: '.scale-x-1\\.05',
      styleRules: {
        '--scale-x': 'var(--scale-1\\.05, var(--base-1\\.05, 1.05))',
        scale: 'var(--scale-x,)var(--scale-y,)',
      },
    },
  },
  {
    name: 'translate',
    input: 'translate-2',
    expected: {
      selectorText: '.translate-2',
      styleRules: {
        '--translate-x': 'var(--translate-2, var(--base-2, 0.5rem))',
        '--translate-y': 'var(--translate-2, var(--base-2, 0.5rem))',
        translate: 'var(--translate-x,)var(--translate-y,)',
      },
    },
  },
  {
    name: 'translate Y',
    input: 'translate-y-2',
    expected: {
      selectorText: '.translate-y-2',
      styleRules: {
        '--translate-y': 'var(--translate-2, var(--base-2, 0.5rem))',
        translate: 'var(--translate-x,)var(--translate-y,)',
      },
    },
  },
  {
    name: 'translate Z',
    input: 'translate-z-2',
    expected: {
      selectorText: '.translate-z-2',
      styleRules: {
        '--translate-z': 'var(--translate-2, var(--base-2, 0.5rem))',
        translate: 'var(--translate-x,)var(--translate-y,)var(--translate-z,)',
      },
    },
  },
  {
    name: 'skew',
    input: 'skew-2',
    expected: {
      selectorText: '.skew-2',
      styleRules: {
        '--skew-x': 'skewX(var(--skew-2, var(--base-2, 2deg)))',
        '--skew-y': 'skewY(var(--skew-2, var(--base-2, 2deg)))',
        transform:
          'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
      },
    },
  },
  {
    name: 'skew X',
    input: 'skew-x-2',
    expected: {
      selectorText: '.skew-x-2',
      styleRules: {
        '--skew-x': 'skewX(var(--skew-2, var(--base-2, 2deg)))',
        transform:
          'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
      },
    },
  },
  {
    name: 'rotate',
    input: 'rotate-2',
    expected: {
      selectorText: '.rotate-2',
      styleRules: {
        '--rotate-x': 'rotateX(var(--rotate-2, var(--base-2, 2deg)))',
        '--rotate-y': 'rotateY(var(--rotate-2, var(--base-2, 2deg)))',
        transform:
          'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
      },
    },
  },
  {
    name: 'rotate X',
    input: 'rotate-x-2',
    expected: {
      selectorText: '.rotate-x-2',
      styleRules: {
        '--rotate-x': 'rotateX(var(--rotate-2, var(--base-2, 2deg)))',
        transform:
          'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
      },
    },
  },

  /* ==================== CONTAINER ==================== */
  {
    name: 'container inline-size',
    input: '@container',
    expected: {
      selectorText: '.\\@container',
      styleRules: {
        container: 'none / inline-size',
      },
    },
  },
  {
    name: 'container named',
    input: '@container(card)',
    expected: {
      selectorText: '.\\@container\\(card\\)',
      styleRules: {
        container: 'card / inline-size',
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
