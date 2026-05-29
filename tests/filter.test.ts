import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

const vars =
  'filter: var(--filter-blur,) var(--filter-brightness,) var(--filter-contrast,) var(--filter-dshadow,) var(--filter-grayscale,) var(--filter-hue,) var(--filter-invert,) var(--filter-saturate,) var(--filter-sepia,)';

describe('Filter', () => {
  it('with variables', () => {
    expect(convert('filter-blur-soft_shadow-soft')).toBe(
      `.filter-blur-soft_shadow-soft { filter: var(--filter-blur-soft, var(--blur-soft, blur-soft)) var(--filter-shadow-soft, var(--shadow-soft, shadow-soft)); }`,
    );
  });
});

describe('Blur', () => {
  it('blur with integer', () => {
    expect(convert('blur-4')).toBe(
      `.blur-4 { --filter-blur: blur(var(--blur-4, var(--space-4, calc(4rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars}; }`,
    );
  });

  it('blur with integer and important', () => {
    expect(convert('!blur-4')).toBe(
      `.\\!blur-4 { --filter-blur: blur(var(--blur-4, var(--space-4, calc(4rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars} !important; }`,
    );
  });

  it('blur with float', () => {
    expect(convert('blur-1.5')).toBe(
      `.blur-1\\.5 { --filter-blur: blur(var(--blur-1\\.5, var(--space-1\\.5, calc(1.5rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars}; }`,
    );
  });

  it('blur with float without integer', () => {
    expect(convert('blur-.5')).toBe(
      `.blur-\\.5 { --filter-blur: blur(var(--blur-\\.5, var(--space-\\.5, calc(0.5rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars}; }`,
    );
  });

  it('blur with zero', () => {
    expect(convert('blur-0')).toBe(
      `.blur-0 { --filter-blur: blur(0);${vars}; }`,
    );
  });

  it('blur with px', () => {
    expect(convert('blur-px')).toBe(
      `.blur-px { --filter-blur: blur(1px);${vars}; }`,
    );
  });

  it('blur with variable', () => {
    expect(convert('blur-lg')).toBe(
      `.blur-lg { --filter-blur: blur(var(--blur-lg, var(--space-lg, var(--lg, lg))));${vars}; }`,
    );
  });

  it('blur with custom value in predefined syntax', () => {
    expect(convert('blur-2px')).toBe(
      `.blur-2px { --filter-blur: blur(2px);${vars}; }`,
    );
    expect(convert('blur-[2px]')).toBe(
      `.blur-\\[2px\\] { --filter-blur: blur(2px);${vars}; }`,
    );
  });

  it('blur with custom value', () => {
    expect(convert('blur=2px')).toBe(
      `.blur\\=2px { --filter-blur: blur(2px);${vars}; }`,
    );
  });

  it('blur with custom value and important', () => {
    expect(convert('!blur=2px')).toBe(
      `.\\!blur\\=2px { --filter-blur: blur(2px);${vars} !important; }`,
    );
  });
});

describe('Brightness', () => {
  it('brightness with integer', () => {
    expect(convert('brightness-2')).toBe(
      `.brightness-2 { --filter-brightness: brightness(var(--brightness-2, 2));${vars}; }`,
    );
  });

  it('brightness with integer and important', () => {
    expect(convert('!brightness-2')).toBe(
      `.\\!brightness-2 { --filter-brightness: brightness(var(--brightness-2, 2));${vars} !important; }`,
    );
  });

  it('brightness with float', () => {
    expect(convert('brightness-1.5')).toBe(
      `.brightness-1\\.5 { --filter-brightness: brightness(var(--brightness-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('brightness with float without integer', () => {
    expect(convert('brightness-.5')).toBe(
      `.brightness-\\.5 { --filter-brightness: brightness(var(--brightness-\\.5, 0.5));${vars}; }`,
    );
  });

  it('brightness with 0', () => {
    expect(convert('brightness-0')).toBe(
      `.brightness-0 { --filter-brightness: brightness(0);${vars}; }`,
    );
  });

  it('brightness with variable', () => {
    expect(convert('brightness-lg')).toBe(
      `.brightness-lg { --filter-brightness: brightness(var(--brightness-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('brightness with custom value in predefined syntax', () => {
    expect(convert('brightness-50%')).toBe(
      `.brightness-50\\% { --filter-brightness: brightness(50%);${vars}; }`,
    );
    expect(convert('brightness-[50%]')).toBe(
      `.brightness-\\[50\\%\\] { --filter-brightness: brightness(50%);${vars}; }`,
    );
  });

  it('brightness with custom value', () => {
    expect(convert('brightness=2')).toBe(
      `.brightness\\=2 { --filter-brightness: brightness(2);${vars}; }`,
    );
  });

  it('brightness with multiple custom value and important', () => {
    expect(convert('!brightness=1')).toBe(
      `.\\!brightness\\=1 { --filter-brightness: brightness(1);${vars} !important; }`,
    );
  });
});

describe('Contrast', () => {
  it('contrast with integer', () => {
    expect(convert('contrast-2')).toBe(
      `.contrast-2 { --filter-contrast: contrast(var(--contrast-2, 2));${vars}; }`,
    );
  });

  it('contrast with integer and important', () => {
    expect(convert('!contrast-2')).toBe(
      `.\\!contrast-2 { --filter-contrast: contrast(var(--contrast-2, 2));${vars} !important; }`,
    );
  });

  it('contrast with float', () => {
    expect(convert('contrast-1.5')).toBe(
      `.contrast-1\\.5 { --filter-contrast: contrast(var(--contrast-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('contrast with float without integer', () => {
    expect(convert('contrast-.5')).toBe(
      `.contrast-\\.5 { --filter-contrast: contrast(var(--contrast-\\.5, 0.5));${vars}; }`,
    );
  });

  it('contrast with 0', () => {
    expect(convert('contrast-0')).toBe(
      `.contrast-0 { --filter-contrast: contrast(0);${vars}; }`,
    );
  });

  it('contrast with variable', () => {
    expect(convert('contrast-lg')).toBe(
      `.contrast-lg { --filter-contrast: contrast(var(--contrast-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('contrast with custom value in predefined syntax', () => {
    expect(convert('contrast-50%')).toBe(
      `.contrast-50\\% { --filter-contrast: contrast(50%);${vars}; }`,
    );
    expect(convert('contrast-[50%]')).toBe(
      `.contrast-\\[50\\%\\] { --filter-contrast: contrast(50%);${vars}; }`,
    );
  });

  it('contrast with custom value', () => {
    expect(convert('contrast=2')).toBe(
      `.contrast\\=2 { --filter-contrast: contrast(2);${vars}; }`,
    );
  });

  it('contrast with multiple custom value and important', () => {
    expect(convert('!contrast=1')).toBe(
      `.\\!contrast\\=1 { --filter-contrast: contrast(1);${vars} !important; }`,
    );
  });
});

describe('Grayscale', () => {
  it('grayscale with integer', () => {
    expect(convert('grayscale-2')).toBe(
      `.grayscale-2 { --filter-grayscale: grayscale(var(--grayscale-2, 2));${vars}; }`,
    );
  });

  it('grayscale with integer and important', () => {
    expect(convert('!grayscale-2')).toBe(
      `.\\!grayscale-2 { --filter-grayscale: grayscale(var(--grayscale-2, 2));${vars} !important; }`,
    );
  });

  it('grayscale with float', () => {
    expect(convert('grayscale-1.5')).toBe(
      `.grayscale-1\\.5 { --filter-grayscale: grayscale(var(--grayscale-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('grayscale with float without integer', () => {
    expect(convert('grayscale-.5')).toBe(
      `.grayscale-\\.5 { --filter-grayscale: grayscale(var(--grayscale-\\.5, 0.5));${vars}; }`,
    );
  });

  it('grayscale with 0', () => {
    expect(convert('grayscale-0')).toBe(
      `.grayscale-0 { --filter-grayscale: grayscale(0);${vars}; }`,
    );
  });

  it('grayscale with variable', () => {
    expect(convert('grayscale-lg')).toBe(
      `.grayscale-lg { --filter-grayscale: grayscale(var(--grayscale-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('grayscale with custom value in predefined syntax', () => {
    expect(convert('grayscale-50%')).toBe(
      `.grayscale-50\\% { --filter-grayscale: grayscale(50%);${vars}; }`,
    );
    expect(convert('grayscale-[50%]')).toBe(
      `.grayscale-\\[50\\%\\] { --filter-grayscale: grayscale(50%);${vars}; }`,
    );
  });

  it('grayscale with custom value', () => {
    expect(convert('grayscale=2')).toBe(
      `.grayscale\\=2 { --filter-grayscale: grayscale(2);${vars}; }`,
    );
  });

  it('grayscale with multiple custom value and important', () => {
    expect(convert('!grayscale=1')).toBe(
      `.\\!grayscale\\=1 { --filter-grayscale: grayscale(1);${vars} !important; }`,
    );
  });
});

describe('Invert', () => {
  it('invert with integer', () => {
    expect(convert('invert-2')).toBe(
      `.invert-2 { --filter-invert: invert(var(--invert-2, 2));${vars}; }`,
    );
  });

  it('invert with integer and important', () => {
    expect(convert('!invert-2')).toBe(
      `.\\!invert-2 { --filter-invert: invert(var(--invert-2, 2));${vars} !important; }`,
    );
  });

  it('invert with float', () => {
    expect(convert('invert-1.5')).toBe(
      `.invert-1\\.5 { --filter-invert: invert(var(--invert-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('invert with float without integer', () => {
    expect(convert('invert-.5')).toBe(
      `.invert-\\.5 { --filter-invert: invert(var(--invert-\\.5, 0.5));${vars}; }`,
    );
  });

  it('invert with 0', () => {
    expect(convert('invert-0')).toBe(
      `.invert-0 { --filter-invert: invert(0);${vars}; }`,
    );
  });

  it('invert with variable', () => {
    expect(convert('invert-lg')).toBe(
      `.invert-lg { --filter-invert: invert(var(--invert-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('invert with custom value in predefined syntax', () => {
    expect(convert('invert-50%')).toBe(
      `.invert-50\\% { --filter-invert: invert(50%);${vars}; }`,
    );
    expect(convert('invert-[50%]')).toBe(
      `.invert-\\[50\\%\\] { --filter-invert: invert(50%);${vars}; }`,
    );
  });

  it('invert with custom value', () => {
    expect(convert('invert=2')).toBe(
      `.invert\\=2 { --filter-invert: invert(2);${vars}; }`,
    );
  });

  it('invert with multiple custom value and important', () => {
    expect(convert('!invert=1')).toBe(
      `.\\!invert\\=1 { --filter-invert: invert(1);${vars} !important; }`,
    );
  });
});

describe('Saturate', () => {
  it('saturate with integer', () => {
    expect(convert('saturate-2')).toBe(
      `.saturate-2 { --filter-saturate: saturate(var(--saturate-2, 2));${vars}; }`,
    );
  });

  it('saturate with integer and important', () => {
    expect(convert('!saturate-2')).toBe(
      `.\\!saturate-2 { --filter-saturate: saturate(var(--saturate-2, 2));${vars} !important; }`,
    );
  });

  it('saturate with float', () => {
    expect(convert('saturate-1.5')).toBe(
      `.saturate-1\\.5 { --filter-saturate: saturate(var(--saturate-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('saturate with float without integer', () => {
    expect(convert('saturate-.5')).toBe(
      `.saturate-\\.5 { --filter-saturate: saturate(var(--saturate-\\.5, 0.5));${vars}; }`,
    );
  });

  it('saturate with 0', () => {
    expect(convert('saturate-0')).toBe(
      `.saturate-0 { --filter-saturate: saturate(0);${vars}; }`,
    );
  });

  it('saturate with variable', () => {
    expect(convert('saturate-lg')).toBe(
      `.saturate-lg { --filter-saturate: saturate(var(--saturate-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('saturate with custom value in predefined syntax', () => {
    expect(convert('saturate-50%')).toBe(
      `.saturate-50\\% { --filter-saturate: saturate(50%);${vars}; }`,
    );
    expect(convert('saturate-[50%]')).toBe(
      `.saturate-\\[50\\%\\] { --filter-saturate: saturate(50%);${vars}; }`,
    );
  });

  it('saturate with custom value', () => {
    expect(convert('saturate=2')).toBe(
      `.saturate\\=2 { --filter-saturate: saturate(2);${vars}; }`,
    );
  });

  it('saturate with multiple custom value and important', () => {
    expect(convert('!saturate=1')).toBe(
      `.\\!saturate\\=1 { --filter-saturate: saturate(1);${vars} !important; }`,
    );
  });
});

describe('Sepia', () => {
  it('sepia with integer', () => {
    expect(convert('sepia-2')).toBe(
      `.sepia-2 { --filter-sepia: sepia(var(--sepia-2, 2));${vars}; }`,
    );
  });

  it('sepia with integer and important', () => {
    expect(convert('!sepia-2')).toBe(
      `.\\!sepia-2 { --filter-sepia: sepia(var(--sepia-2, 2));${vars} !important; }`,
    );
  });

  it('sepia with float', () => {
    expect(convert('sepia-1.5')).toBe(
      `.sepia-1\\.5 { --filter-sepia: sepia(var(--sepia-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('sepia with float without integer', () => {
    expect(convert('sepia-.5')).toBe(
      `.sepia-\\.5 { --filter-sepia: sepia(var(--sepia-\\.5, 0.5));${vars}; }`,
    );
  });

  it('sepia with 0', () => {
    expect(convert('sepia-0')).toBe(
      `.sepia-0 { --filter-sepia: sepia(0);${vars}; }`,
    );
  });

  it('sepia with variable', () => {
    expect(convert('sepia-lg')).toBe(
      `.sepia-lg { --filter-sepia: sepia(var(--sepia-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('sepia with custom value in predefined syntax', () => {
    expect(convert('sepia-50%')).toBe(
      `.sepia-50\\% { --filter-sepia: sepia(50%);${vars}; }`,
    );
    expect(convert('sepia-[50%]')).toBe(
      `.sepia-\\[50\\%\\] { --filter-sepia: sepia(50%);${vars}; }`,
    );
  });

  it('sepia with custom value', () => {
    expect(convert('sepia=2')).toBe(
      `.sepia\\=2 { --filter-sepia: sepia(2);${vars}; }`,
    );
  });

  it('sepia with multiple custom value and important', () => {
    expect(convert('!sepia=1')).toBe(
      `.\\!sepia\\=1 { --filter-sepia: sepia(1);${vars} !important; }`,
    );
  });
});

describe('Hue Rotate', () => {
  it('hue rotate with integer', () => {
    expect(convert('hue-15')).toBe(
      `.hue-15 { --filter-hue: hue-rotate(var(--hue-15, var(--angle-15, 15deg)));${vars}; }`,
    );
  });

  it('hue rotate with integer and important', () => {
    expect(convert('!hue-15')).toBe(
      `.\\!hue-15 { --filter-hue: hue-rotate(var(--hue-15, var(--angle-15, 15deg)));${vars} !important; }`,
    );
  });

  it('hue rotate with float', () => {
    expect(convert('hue-1.5')).toBe(
      `.hue-1\\.5 { --filter-hue: hue-rotate(var(--hue-1\\.5, var(--angle-1\\.5, 1.5deg)));${vars}; }`,
    );
  });

  it('hue rotate with float without integer', () => {
    expect(convert('hue-.5')).toBe(
      `.hue-\\.5 { --filter-hue: hue-rotate(var(--hue-\\.5, var(--angle-\\.5, 0.5deg)));${vars}; }`,
    );
  });

  it('hue rotate with negative integer', () => {
    expect(convert('-hue-10')).toBe(
      `.-hue-10 { --filter-hue: hue-rotate(calc(var(--hue-10, var(--angle-10, 10deg)) * -1));${vars}; }`,
    );
  });

  it('hue rotate with negative float', () => {
    expect(convert('-hue-1.5')).toBe(
      `.-hue-1\\.5 { --filter-hue: hue-rotate(calc(var(--hue-1\\.5, var(--angle-1\\.5, 1.5deg)) * -1));${vars}; }`,
    );
  });

  it('hue rotate with negative float without integer', () => {
    expect(convert('-hue-.5')).toBe(
      `.-hue-\\.5 { --filter-hue: hue-rotate(calc(var(--hue-\\.5, var(--angle-\\.5, 0.5deg)) * -1));${vars}; }`,
    );
  });

  it('hue rotate with 0', () => {
    expect(convert('hue-0')).toBe(
      `.hue-0 { --filter-hue: hue-rotate(0);${vars}; }`,
    );
  });

  it('hue rotate with variable', () => {
    expect(convert('hue-lg')).toBe(
      `.hue-lg { --filter-hue: hue-rotate(var(--hue-lg, var(--angle-lg, var(--lg, lg))));${vars}; }`,
    );
  });

  it('hue rotate with custom value in predefined syntax', () => {
    expect(convert('hue--0.25turn')).toBe(
      `.hue--0\\.25turn { --filter-hue: hue-rotate(-0.25turn);${vars}; }`,
    );
    expect(convert('hue-[3.142rad]')).toBe(
      `.hue-\\[3\\.142rad\\] { --filter-hue: hue-rotate(3.142rad);${vars}; }`,
    );
  });

  it('hue rotate with custom value', () => {
    expect(convert('hue=2')).toBe(
      `.hue\\=2 { --filter-hue: hue-rotate(2);${vars}; }`,
    );
  });

  it('hue rotate with custom value and important', () => {
    expect(convert('!hue=10')).toBe(
      `.\\!hue\\=10 { --filter-hue: hue-rotate(10);${vars} !important; }`,
    );
  });
});

describe('Drop Shadow', () => {
  it('drop-shadow with variable', () => {
    expect(convert('dshadow-2xs')).toBe(
      `.dshadow-2xs { --filter-dshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))));${vars}; }`,
    );
  });

  it('drop-shadow with multiple variables', () => {
    expect(convert('dshadow-2xs,light2xs')).toBe(
      `.dshadow-2xs\\,light2xs { --filter-dshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs)))) drop-shadow(var(--dshadow-light2xs, var(--shadow-light2xs, var(--light2xs, light2xs))));${vars}; }`,
    );
  });

  it('drop-shadow with multiple known variables', () => {
    expect(convert('dshadow-px_px')).toBe(
      `.dshadow-px_px { --filter-dshadow: drop-shadow(1px 1px);${vars}; }`,
    );
    expect(convert('dshadow-0px_1px')).toBe(
      `.dshadow-0px_1px { --filter-dshadow: drop-shadow(0px 1px);${vars}; }`,
    );
    expect(convert('dshadow-0px_-1px')).toBe(
      `.dshadow-0px_-1px { --filter-dshadow: drop-shadow(0px -1px);${vars}; }`,
    );
    expect(convert('dshadow-0px_-1')).toBe(
      `.dshadow-0px_-1 { --filter-dshadow: drop-shadow(0px var(--dshadow--1, var(--space--1, calc(-1rem * var(--dshadow-spacer, var(--shadow-spacer, var(--spacer, 0.25)))))));${vars}; }`,
    );
    expect(convert('dshadow-0px_1px_red')).toBe(
      `.dshadow-0px_1px_red { --filter-dshadow: drop-shadow(0px 1px oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-l-scale, var(--red-l-scale, var(--dshadow-l-scale, var(--l-scale, 1))))) calc(c * var(--dshadow-red-c-scale, var(--red-c-scale, var(--dshadow-c-scale, var(--c-scale, 1))))) calc(h + var(--dshadow-red-h-rotate, var(--red-h-rotate, var(--dshadow-h-rotate, var(--h-rotate, 0))))) / alpha));${vars}; }`,
    );
    expect(convert('dshadow-0px_1px_0px_red')).toBe(
      `.dshadow-0px_1px_0px_red { --filter-dshadow: drop-shadow(0px 1px 0px oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-l-scale, var(--red-l-scale, var(--dshadow-l-scale, var(--l-scale, 1))))) calc(c * var(--dshadow-red-c-scale, var(--red-c-scale, var(--dshadow-c-scale, var(--c-scale, 1))))) calc(h + var(--dshadow-red-h-rotate, var(--red-h-rotate, var(--dshadow-h-rotate, var(--h-rotate, 0))))) / alpha));${vars}; }`,
    );
    expect(convert('dshadow-0_1_0_red')).toBe(
      `.dshadow-0_1_0_red { --filter-dshadow: drop-shadow(0 var(--dshadow-1, var(--space-1, calc(1rem * var(--dshadow-spacer, var(--shadow-spacer, var(--spacer, 0.25)))))) 0 oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-l-scale, var(--red-l-scale, var(--dshadow-l-scale, var(--l-scale, 1))))) calc(c * var(--dshadow-red-c-scale, var(--red-c-scale, var(--dshadow-c-scale, var(--c-scale, 1))))) calc(h + var(--dshadow-red-h-rotate, var(--red-h-rotate, var(--dshadow-h-rotate, var(--h-rotate, 0))))) / alpha));${vars}; }`,
    );
  });

  it('drop-shadow known and unknown variables', () => {
    expect(convert('dshadow-2xs_red')).toBe(
      `.dshadow-2xs_red { --filter-dshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-l-scale, var(--red-l-scale, var(--dshadow-l-scale, var(--l-scale, 1))))) calc(c * var(--dshadow-red-c-scale, var(--red-c-scale, var(--dshadow-c-scale, var(--c-scale, 1))))) calc(h + var(--dshadow-red-h-rotate, var(--red-h-rotate, var(--dshadow-h-rotate, var(--h-rotate, 0))))) / alpha));${vars}; }`,
    );

    expect(convert('dshadow-2xs_px_red')).toBe(
      `.dshadow-2xs_px_red { --filter-dshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) 1px oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-l-scale, var(--red-l-scale, var(--dshadow-l-scale, var(--l-scale, 1))))) calc(c * var(--dshadow-red-c-scale, var(--red-c-scale, var(--dshadow-c-scale, var(--c-scale, 1))))) calc(h + var(--dshadow-red-h-rotate, var(--red-h-rotate, var(--dshadow-h-rotate, var(--h-rotate, 0))))) / alpha));${vars}; }`,
    );
  });

  it('drop-shadow with custom value', () => {
    expect(convert('dshadow=0px_1px_0px_rgb(0_0_0/0.15)')).toBe(
      `.dshadow\\=0px_1px_0px_rgb\\(0_0_0\\/0\\.15\\) { --filter-dshadow: drop-shadow(0px 1px 0px rgb(0 0 0/0.15));${vars}; }`,
    );
  });
});
