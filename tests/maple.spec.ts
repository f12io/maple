import { beforeAll, describe, expect, it } from 'vitest';
import { mapleMatcher } from '../src/engines/maple/matcher';
import { registerDefaultVariants } from '../src/engines/variants';
import { parseClass } from '../src/core/parser';
type Case = {
  name: string;
  input: string;
  expected: Record<string, string>;
};
const cases: Array<Case> = [
  {
    name: 'padding',
    input: 'p-4',
    expected: {
      padding: 'var(--padding-4, var(--base-4, 1rem))',
    },
  },
  {
    name: 'padding-x',
    input: 'px-2',
    expected: {
      'padding-left': 'var(--padding-2, var(--base-2, 0.5rem))',
      'padding-right': 'var(--padding-2, var(--base-2, 0.5rem))',
    },
  },
  {
    name: 'padding-y',
    input: 'py-6',
    expected: {
      'padding-top': 'var(--padding-6, var(--base-6, 1.5rem))',
      'padding-bottom': 'var(--padding-6, var(--base-6, 1.5rem))',
    },
  },
  {
    name: 'margin',
    input: 'm-1',
    expected: {
      margin: 'var(--margin-1, var(--base-1, 0.25rem))',
    },
  },

  {
    name: 'width',
    input: 'w-10',
    expected: {
      width: 'var(--width-10, var(--base-10, 2.5rem))',
    },
  },
  {
    name: 'height',
    input: 'h-10',
    expected: {
      height: 'var(--height-10, var(--base-10, 2.5rem))',
    },
  },
  {
    name: 'size',
    input: 'size-10',
    expected: {
      width: 'var(--size-10, var(--base-10, 2.5rem))',
      height: 'var(--size-10, var(--base-10, 2.5rem))',
    },
  },
  {
    name: 'width svw',
    input: 'w-svw',
    expected: {
      width: '100svw',
    },
  },
  {
    name: 'height dvh',
    input: 'h-dvh',
    expected: {
      height: '100dvh',
    },
  },

  /* ==================== TYPOGRAPHY ==================== */
  {
    name: 'font size',
    input: 'fs-lg',
    expected: {
      'font-size': 'var(--font-size-lg, var(--base-lg))',
    },
  },
  {
    name: 'font size',
    input: 'fs-4',
    expected: {
      'font-size': 'var(--font-size-4, var(--base-4, 1rem))',
    },
  },
  {
    name: 'font weight',
    input: 'fw-bold',
    expected: {
      'font-weight': 'var(--font-weight-bold, bold)',
    },
  },
  {
    name: 'font weight with number',
    input: 'fw-700',
    expected: {
      'font-weight': 'var(--font-weight-700, 700)',
    },
  },
  {
    name: 'line height',
    input: 'lh-tight',
    expected: {
      'line-height': 'var(--line-height-tight, var(--base-tight))',
    },
  },
  {
    name: 'line height with number',
    input: 'lh-4',
    expected: {
      'line-height': 'var(--line-height-4, var(--base-4, 1rem))',
    },
  },
  {
    name: 'line height with number equailty',
    input: 'lh=1.25',
    expected: {
      'line-height': '1.25',
    },
  },

  /* ==================== COLORS ==================== */
  {
    name: 'text color',
    input: 'c-red-500',
    expected: {
      color:
        'oklch(from var(--color-red, red) calc(calc(l + calc(l * 0)) * var(--ligtines-factor, 1)) calc(c * var(--chroma-factor, 1)) calc(h * var(--hue-factor, 1)) / alpha)',
    },
  },
  {
    name: 'background color',
    input: 'bgc-blue-600',
    expected: {
      'background-color':
        'oklch(from var(--color-blue, blue) calc(calc(l + calc(l * -0.2)) * var(--ligtines-factor, 1)) calc(c * var(--chroma-factor, 1)) calc(h * var(--hue-factor, 1)) / alpha)',
    },
  },
  {
    name: 'border color',
    input: 'bc-gray-300',
    expected: {
      'border-color':
        'oklch(from var(--color-gray, gray) calc(calc(l + calc(calc(1 - l) * 0.4)) * var(--ligtines-factor, 1)) calc(c * var(--chroma-factor, 1)) calc(h * var(--hue-factor, 1)) / alpha)',
    },
  },

  /* ==================== BORDERS ==================== */
  {
    name: 'border',
    input: 'b-2',
    expected: {
      border: 'var(--border-2, var(--base-2, 0.5rem))',
    },
  },
  {
    name: 'border style',
    input: 'bs-dashed',
    expected: {
      'border-style': 'var(--border-style-dashed, dashed)',
    },
  },
  {
    name: 'border width',
    input: 'bw-2',
    expected: {
      'border-width': 'var(--border-width-2, var(--base-2, 0.5rem))',
    },
  },
  {
    name: 'border radius',
    input: 'br-lg',
    expected: {
      'border-radius': 'var(--border-radius-lg, var(--base-lg))',
    },
  },
  /* ==================== LAYOUT ==================== */
  {
    name: 'display flex',
    input: 'd-flex',
    expected: {
      display: 'var(--display-flex, flex)',
    },
  },
  {
    name: 'display grid',
    input: 'd-grid',
    expected: {
      display: 'var(--display-grid, grid)',
    },
  },
  {
    name: 'flex direction',
    input: 'fd-column',
    expected: {
      'flex-direction': 'var(--flex-direction-column, column)',
    },
  },
  {
    name: 'align items',
    input: 'ai-center',
    expected: {
      'align-items': 'var(--align-items-center, center)',
    },
  },
  {
    name: 'justify content',
    input: 'jc-space-between',
    expected: {
      'justify-content': 'var(--justify-content-space-between, space-between)',
    },
  },
  /* ==================== POSITION ==================== */
  {
    name: 'position relative',
    input: 'pos-relative',
    expected: {
      position: 'var(--position-relative, relative)',
    },
  },
  {
    name: 'top',
    input: 't-3',
    expected: {
      top: 'var(--top-3, var(--base-3, 0.75rem))',
    },
  },
  /* ==================== EFFECTS ==================== */
  {
    name: 'opacity',
    input: 'o-0.5',
    expected: {
      opacity: 'var(--opacity-0\\.5, 0.5)',
    },
  },
  {
    name: 'shadow',
    input: 'shadow-md',
    expected: {
      'box-shadow': 'var(--box-shadow-md, md)',
    },
  },
  /* ==================== TRANSFORM ==================== */
  {
    name: 'scale',
    input: 'scale-1.05',
    expected: {
      '--scale-x': 'var(--scale-1\\.05, var(--base-1\\.05, 1.05))',
      '--scale-y': 'var(--scale-1\\.05, var(--base-1\\.05, 1.05))',
      scale: 'var(--scale-x,)var(--scale-y,)',
    },
  },
  {
    name: 'scale X',
    input: 'scale-x-1.05',
    expected: {
      '--scale-x': 'var(--scale-1\\.05, var(--base-1\\.05, 1.05))',
      scale: 'var(--scale-x,)var(--scale-y,)',
    },
  },
  {
    name: 'translate',
    input: 'translate-2',
    expected: {
      '--translate-x': 'var(--translate-2, var(--base-2, 0.5rem))',
      '--translate-y': 'var(--translate-2, var(--base-2, 0.5rem))',
      translate: 'var(--translate-x,)var(--translate-y,)',
    },
  },
  {
    name: 'translate Y',
    input: 'translate-y-2',
    expected: {
      '--translate-y': 'var(--translate-2, var(--base-2, 0.5rem))',
      translate: 'var(--translate-x,)var(--translate-y,)',
    },
  },
  {
    name: 'translate Z',
    input: 'translate-z-2',
    expected: {
      '--translate-z': 'var(--translate-2, var(--base-2, 0.5rem))',
      translate: 'var(--translate-x,)var(--translate-y,)var(--translate-z,)',
    },
  },
  {
    name: 'skew',
    input: 'skew-2',
    expected: {
      '--skew-x': 'skewX(var(--skew-2, var(--base-2, 2deg)))',
      '--skew-y': 'skewY(var(--skew-2, var(--base-2, 2deg)))',
      transform: 'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
    },
  },
  {
    name: 'skew',
    input: 'skew-x-2',
    expected: {
      '--skew-x': 'skewX(var(--skew-2, var(--base-2, 2deg)))',
      transform: 'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
    },
  },
  {
    name: 'rotate',
    input: 'rotate-2',
    expected: {
      '--rotate-x': 'rotateX(var(--rotate-2, var(--base-2, 2deg)))',
      '--rotate-y': 'rotateY(var(--rotate-2, var(--base-2, 2deg)))',
      transform: 'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
    },
  },
  {
    name: 'rotate',
    input: 'rotate-x-2',
    expected: {
      '--rotate-x': 'rotateX(var(--rotate-2, var(--base-2, 2deg)))',
      transform: 'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
    },
  },

  {
    name: 'container type inline-size',
    input: '@container',
    expected: {
      container: 'none / inline-size',
    },
  },
  {
    name: 'container with name',
    input: '@container(card)',
    expected: {
      container: 'card / inline-size',
    },
  },
];

describe('Maple', () => {
  beforeAll(() => {
    registerDefaultVariants();
  });
  it.each(cases)('$name', ({ input, expected }) => {
    const parsed = parseClass(input);
    if (!parsed) {
      throw new Error(`Failed to parse class: ${input}`);
    }
    expect(mapleMatcher(parsed?.utility)).toEqual(expected);
  });
});
