import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

const vars =
  'backdrop-filter: var(--filter-bdblur,) var(--filter-bdbrightness,) var(--filter-bdcontrast,) var(--filter-bdshadow,) var(--filter-bdgrayscale,) var(--filter-bdhue,) var(--filter-bdinvert,) var(--filter-bdsaturate,) var(--filter-bdsepia,)';

describe('Backdrop Filter', () => {
  it('with variables', () => {
    expect(convert('bdf-blur-soft_shadow-soft')).toBe(
      `.bdf-blur-soft_shadow-soft { backdrop-filter: var(--bdf-blur-soft, var(--blur-soft, blur-soft)) var(--bdf-shadow-soft, var(--shadow-soft, shadow-soft)); }`,
    );
  });
});

describe('Blur', () => {
  it('blur with integer', () => {
    expect(convert('bdblur-4')).toBe(
      `.bdblur-4 { --filter-bdblur: blur(var(--blur-4, var(--space-4, calc(4rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars}; }`,
    );
  });

  it('blur with integer and important', () => {
    expect(convert('!bdblur-4')).toBe(
      `.\\!bdblur-4 { --filter-bdblur: blur(var(--blur-4, var(--space-4, calc(4rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars} !important; }`,
    );
  });

  it('blur with float', () => {
    expect(convert('bdblur-1.5')).toBe(
      `.bdblur-1\\.5 { --filter-bdblur: blur(var(--blur-1\\.5, var(--space-1\\.5, calc(1.5rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars}; }`,
    );
  });

  it('blur with float without integer', () => {
    expect(convert('bdblur-.5')).toBe(
      `.bdblur-\\.5 { --filter-bdblur: blur(var(--blur-\\.5, var(--space-\\.5, calc(0.5rem * var(--blur-spacer, var(--spacer, 0.25))))));${vars}; }`,
    );
  });

  it('blur with zero', () => {
    expect(convert('bdblur-0')).toBe(
      `.bdblur-0 { --filter-bdblur: blur(0);${vars}; }`,
    );
  });

  it('blur with px', () => {
    expect(convert('bdblur-px')).toBe(
      `.bdblur-px { --filter-bdblur: blur(1px);${vars}; }`,
    );
  });

  it('blur with variable', () => {
    expect(convert('bdblur-lg')).toBe(
      `.bdblur-lg { --filter-bdblur: blur(var(--blur-lg, var(--space-lg, var(--lg, lg))));${vars}; }`,
    );
  });

  it('blur with custom value in predefined syntax', () => {
    expect(convert('bdblur-2px')).toBe(
      `.bdblur-2px { --filter-bdblur: blur(2px);${vars}; }`,
    );
    expect(convert('bdblur-[2px]')).toBe(
      `.bdblur-\\[2px\\] { --filter-bdblur: blur(2px);${vars}; }`,
    );
  });

  it('blur with custom value', () => {
    expect(convert('bdblur=2px')).toBe(
      `.bdblur\\=2px { --filter-bdblur: blur(2px);${vars}; }`,
    );
  });

  it('blur with custom value and important', () => {
    expect(convert('!bdblur=2px')).toBe(
      `.\\!bdblur\\=2px { --filter-bdblur: blur(2px);${vars} !important; }`,
    );
  });
});

describe('Brightness', () => {
  it('brightness with integer', () => {
    expect(convert('bdbrightness-2')).toBe(
      `.bdbrightness-2 { --filter-bdbrightness: brightness(var(--brightness-2, 2));${vars}; }`,
    );
  });

  it('brightness with integer and important', () => {
    expect(convert('!bdbrightness-2')).toBe(
      `.\\!bdbrightness-2 { --filter-bdbrightness: brightness(var(--brightness-2, 2));${vars} !important; }`,
    );
  });

  it('brightness with float', () => {
    expect(convert('bdbrightness-1.5')).toBe(
      `.bdbrightness-1\\.5 { --filter-bdbrightness: brightness(var(--brightness-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('brightness with float without integer', () => {
    expect(convert('bdbrightness-.5')).toBe(
      `.bdbrightness-\\.5 { --filter-bdbrightness: brightness(var(--brightness-\\.5, 0.5));${vars}; }`,
    );
  });

  it('brightness with 0', () => {
    expect(convert('bdbrightness-0')).toBe(
      `.bdbrightness-0 { --filter-bdbrightness: brightness(0);${vars}; }`,
    );
  });

  it('brightness with variable', () => {
    expect(convert('bdbrightness-lg')).toBe(
      `.bdbrightness-lg { --filter-bdbrightness: brightness(var(--brightness-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('brightness with custom value in predefined syntax', () => {
    expect(convert('bdbrightness-50%')).toBe(
      `.bdbrightness-50\\% { --filter-bdbrightness: brightness(50%);${vars}; }`,
    );
    expect(convert('bdbrightness-[50%]')).toBe(
      `.bdbrightness-\\[50\\%\\] { --filter-bdbrightness: brightness(50%);${vars}; }`,
    );
  });

  it('brightness with custom value', () => {
    expect(convert('bdbrightness=2')).toBe(
      `.bdbrightness\\=2 { --filter-bdbrightness: brightness(2);${vars}; }`,
    );
  });

  it('brightness with multiple custom value and important', () => {
    expect(convert('!bdbrightness=1')).toBe(
      `.\\!bdbrightness\\=1 { --filter-bdbrightness: brightness(1);${vars} !important; }`,
    );
  });
});

describe('Contrast', () => {
  it('contrast with integer', () => {
    expect(convert('bdcontrast-2')).toBe(
      `.bdcontrast-2 { --filter-bdcontrast: contrast(var(--contrast-2, 2));${vars}; }`,
    );
  });

  it('contrast with integer and important', () => {
    expect(convert('!bdcontrast-2')).toBe(
      `.\\!bdcontrast-2 { --filter-bdcontrast: contrast(var(--contrast-2, 2));${vars} !important; }`,
    );
  });

  it('contrast with float', () => {
    expect(convert('bdcontrast-1.5')).toBe(
      `.bdcontrast-1\\.5 { --filter-bdcontrast: contrast(var(--contrast-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('contrast with float without integer', () => {
    expect(convert('bdcontrast-.5')).toBe(
      `.bdcontrast-\\.5 { --filter-bdcontrast: contrast(var(--contrast-\\.5, 0.5));${vars}; }`,
    );
  });

  it('contrast with 0', () => {
    expect(convert('bdcontrast-0')).toBe(
      `.bdcontrast-0 { --filter-bdcontrast: contrast(0);${vars}; }`,
    );
  });

  it('contrast with variable', () => {
    expect(convert('bdcontrast-lg')).toBe(
      `.bdcontrast-lg { --filter-bdcontrast: contrast(var(--contrast-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('contrast with custom value in predefined syntax', () => {
    expect(convert('bdcontrast-50%')).toBe(
      `.bdcontrast-50\\% { --filter-bdcontrast: contrast(50%);${vars}; }`,
    );
    expect(convert('bdcontrast-[50%]')).toBe(
      `.bdcontrast-\\[50\\%\\] { --filter-bdcontrast: contrast(50%);${vars}; }`,
    );
  });

  it('contrast with custom value', () => {
    expect(convert('bdcontrast=2')).toBe(
      `.bdcontrast\\=2 { --filter-bdcontrast: contrast(2);${vars}; }`,
    );
  });

  it('contrast with multiple custom value and important', () => {
    expect(convert('!bdcontrast=1')).toBe(
      `.\\!bdcontrast\\=1 { --filter-bdcontrast: contrast(1);${vars} !important; }`,
    );
  });
});

describe('Grayscale', () => {
  it('grayscale with integer', () => {
    expect(convert('bdgrayscale-2')).toBe(
      `.bdgrayscale-2 { --filter-bdgrayscale: grayscale(var(--grayscale-2, 2));${vars}; }`,
    );
  });

  it('grayscale with integer and important', () => {
    expect(convert('!bdgrayscale-2')).toBe(
      `.\\!bdgrayscale-2 { --filter-bdgrayscale: grayscale(var(--grayscale-2, 2));${vars} !important; }`,
    );
  });

  it('grayscale with float', () => {
    expect(convert('bdgrayscale-1.5')).toBe(
      `.bdgrayscale-1\\.5 { --filter-bdgrayscale: grayscale(var(--grayscale-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('grayscale with float without integer', () => {
    expect(convert('bdgrayscale-.5')).toBe(
      `.bdgrayscale-\\.5 { --filter-bdgrayscale: grayscale(var(--grayscale-\\.5, 0.5));${vars}; }`,
    );
  });

  it('grayscale with 0', () => {
    expect(convert('bdgrayscale-0')).toBe(
      `.bdgrayscale-0 { --filter-bdgrayscale: grayscale(0);${vars}; }`,
    );
  });

  it('grayscale with variable', () => {
    expect(convert('bdgrayscale-lg')).toBe(
      `.bdgrayscale-lg { --filter-bdgrayscale: grayscale(var(--grayscale-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('grayscale with custom value in predefined syntax', () => {
    expect(convert('bdgrayscale-50%')).toBe(
      `.bdgrayscale-50\\% { --filter-bdgrayscale: grayscale(50%);${vars}; }`,
    );
    expect(convert('bdgrayscale-[50%]')).toBe(
      `.bdgrayscale-\\[50\\%\\] { --filter-bdgrayscale: grayscale(50%);${vars}; }`,
    );
  });

  it('grayscale with custom value', () => {
    expect(convert('bdgrayscale=2')).toBe(
      `.bdgrayscale\\=2 { --filter-bdgrayscale: grayscale(2);${vars}; }`,
    );
  });

  it('grayscale with multiple custom value and important', () => {
    expect(convert('!bdgrayscale=1')).toBe(
      `.\\!bdgrayscale\\=1 { --filter-bdgrayscale: grayscale(1);${vars} !important; }`,
    );
  });
});

describe('Invert', () => {
  it('invert with integer', () => {
    expect(convert('bdinvert-2')).toBe(
      `.bdinvert-2 { --filter-bdinvert: invert(var(--invert-2, 2));${vars}; }`,
    );
  });

  it('invert with integer and important', () => {
    expect(convert('!bdinvert-2')).toBe(
      `.\\!bdinvert-2 { --filter-bdinvert: invert(var(--invert-2, 2));${vars} !important; }`,
    );
  });

  it('invert with float', () => {
    expect(convert('bdinvert-1.5')).toBe(
      `.bdinvert-1\\.5 { --filter-bdinvert: invert(var(--invert-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('invert with float without integer', () => {
    expect(convert('bdinvert-.5')).toBe(
      `.bdinvert-\\.5 { --filter-bdinvert: invert(var(--invert-\\.5, 0.5));${vars}; }`,
    );
  });

  it('invert with 0', () => {
    expect(convert('bdinvert-0')).toBe(
      `.bdinvert-0 { --filter-bdinvert: invert(0);${vars}; }`,
    );
  });

  it('invert with variable', () => {
    expect(convert('bdinvert-lg')).toBe(
      `.bdinvert-lg { --filter-bdinvert: invert(var(--invert-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('invert with custom value in predefined syntax', () => {
    expect(convert('bdinvert-50%')).toBe(
      `.bdinvert-50\\% { --filter-bdinvert: invert(50%);${vars}; }`,
    );
    expect(convert('bdinvert-[50%]')).toBe(
      `.bdinvert-\\[50\\%\\] { --filter-bdinvert: invert(50%);${vars}; }`,
    );
  });

  it('invert with custom value', () => {
    expect(convert('bdinvert=2')).toBe(
      `.bdinvert\\=2 { --filter-bdinvert: invert(2);${vars}; }`,
    );
  });

  it('invert with multiple custom value and important', () => {
    expect(convert('!bdinvert=1')).toBe(
      `.\\!bdinvert\\=1 { --filter-bdinvert: invert(1);${vars} !important; }`,
    );
  });
});

describe('Saturate', () => {
  it('saturate with integer', () => {
    expect(convert('bdsaturate-2')).toBe(
      `.bdsaturate-2 { --filter-bdsaturate: saturate(var(--saturate-2, 2));${vars}; }`,
    );
  });

  it('saturate with integer and important', () => {
    expect(convert('!bdsaturate-2')).toBe(
      `.\\!bdsaturate-2 { --filter-bdsaturate: saturate(var(--saturate-2, 2));${vars} !important; }`,
    );
  });

  it('saturate with float', () => {
    expect(convert('bdsaturate-1.5')).toBe(
      `.bdsaturate-1\\.5 { --filter-bdsaturate: saturate(var(--saturate-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('saturate with float without integer', () => {
    expect(convert('bdsaturate-.5')).toBe(
      `.bdsaturate-\\.5 { --filter-bdsaturate: saturate(var(--saturate-\\.5, 0.5));${vars}; }`,
    );
  });

  it('saturate with 0', () => {
    expect(convert('bdsaturate-0')).toBe(
      `.bdsaturate-0 { --filter-bdsaturate: saturate(0);${vars}; }`,
    );
  });

  it('saturate with variable', () => {
    expect(convert('bdsaturate-lg')).toBe(
      `.bdsaturate-lg { --filter-bdsaturate: saturate(var(--saturate-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('saturate with custom value in predefined syntax', () => {
    expect(convert('bdsaturate-50%')).toBe(
      `.bdsaturate-50\\% { --filter-bdsaturate: saturate(50%);${vars}; }`,
    );
    expect(convert('bdsaturate-[50%]')).toBe(
      `.bdsaturate-\\[50\\%\\] { --filter-bdsaturate: saturate(50%);${vars}; }`,
    );
  });

  it('saturate with custom value', () => {
    expect(convert('bdsaturate=2')).toBe(
      `.bdsaturate\\=2 { --filter-bdsaturate: saturate(2);${vars}; }`,
    );
  });

  it('saturate with multiple custom value and important', () => {
    expect(convert('!bdsaturate=1')).toBe(
      `.\\!bdsaturate\\=1 { --filter-bdsaturate: saturate(1);${vars} !important; }`,
    );
  });
});

describe('Sepia', () => {
  it('sepia with integer', () => {
    expect(convert('bdsepia-2')).toBe(
      `.bdsepia-2 { --filter-bdsepia: sepia(var(--sepia-2, 2));${vars}; }`,
    );
  });

  it('sepia with integer and important', () => {
    expect(convert('!bdsepia-2')).toBe(
      `.\\!bdsepia-2 { --filter-bdsepia: sepia(var(--sepia-2, 2));${vars} !important; }`,
    );
  });

  it('sepia with float', () => {
    expect(convert('bdsepia-1.5')).toBe(
      `.bdsepia-1\\.5 { --filter-bdsepia: sepia(var(--sepia-1\\.5, 1.5));${vars}; }`,
    );
  });

  it('sepia with float without integer', () => {
    expect(convert('bdsepia-.5')).toBe(
      `.bdsepia-\\.5 { --filter-bdsepia: sepia(var(--sepia-\\.5, 0.5));${vars}; }`,
    );
  });

  it('sepia with 0', () => {
    expect(convert('bdsepia-0')).toBe(
      `.bdsepia-0 { --filter-bdsepia: sepia(0);${vars}; }`,
    );
  });

  it('sepia with variable', () => {
    expect(convert('bdsepia-lg')).toBe(
      `.bdsepia-lg { --filter-bdsepia: sepia(var(--sepia-lg, var(--lg, lg)));${vars}; }`,
    );
  });

  it('sepia with custom value in predefined syntax', () => {
    expect(convert('bdsepia-50%')).toBe(
      `.bdsepia-50\\% { --filter-bdsepia: sepia(50%);${vars}; }`,
    );
    expect(convert('bdsepia-[50%]')).toBe(
      `.bdsepia-\\[50\\%\\] { --filter-bdsepia: sepia(50%);${vars}; }`,
    );
  });

  it('sepia with custom value', () => {
    expect(convert('bdsepia=2')).toBe(
      `.bdsepia\\=2 { --filter-bdsepia: sepia(2);${vars}; }`,
    );
  });

  it('sepia with multiple custom value and important', () => {
    expect(convert('!bdsepia=1')).toBe(
      `.\\!bdsepia\\=1 { --filter-bdsepia: sepia(1);${vars} !important; }`,
    );
  });
});

describe('Hue Rotate', () => {
  it('hue rotate with integer', () => {
    expect(convert('bdhue-15')).toBe(
      `.bdhue-15 { --filter-bdhue: hue-rotate(var(--hue-15, var(--angle-15, 15deg)));${vars}; }`,
    );
  });

  it('hue rotate with integer and important', () => {
    expect(convert('!bdhue-15')).toBe(
      `.\\!bdhue-15 { --filter-bdhue: hue-rotate(var(--hue-15, var(--angle-15, 15deg)));${vars} !important; }`,
    );
  });

  it('hue rotate with float', () => {
    expect(convert('bdhue-1.5')).toBe(
      `.bdhue-1\\.5 { --filter-bdhue: hue-rotate(var(--hue-1\\.5, var(--angle-1\\.5, 1.5deg)));${vars}; }`,
    );
  });

  it('hue rotate with float without integer', () => {
    expect(convert('bdhue-.5')).toBe(
      `.bdhue-\\.5 { --filter-bdhue: hue-rotate(var(--hue-\\.5, var(--angle-\\.5, 0.5deg)));${vars}; }`,
    );
  });

  it('hue rotate with negative integer', () => {
    expect(convert('-bdhue-10')).toBe(
      `.-bdhue-10 { --filter-bdhue: hue-rotate(calc(var(--hue-10, var(--angle-10, 10deg)) * -1));${vars}; }`,
    );
  });

  it('hue rotate with negative float', () => {
    expect(convert('-bdhue-1.5')).toBe(
      `.-bdhue-1\\.5 { --filter-bdhue: hue-rotate(calc(var(--hue-1\\.5, var(--angle-1\\.5, 1.5deg)) * -1));${vars}; }`,
    );
  });

  it('hue rotate with negative float without integer', () => {
    expect(convert('-bdhue-.5')).toBe(
      `.-bdhue-\\.5 { --filter-bdhue: hue-rotate(calc(var(--hue-\\.5, var(--angle-\\.5, 0.5deg)) * -1));${vars}; }`,
    );
  });

  it('hue rotate with 0', () => {
    expect(convert('bdhue-0')).toBe(
      `.bdhue-0 { --filter-bdhue: hue-rotate(0);${vars}; }`,
    );
  });

  it('hue rotate with variable', () => {
    expect(convert('bdhue-lg')).toBe(
      `.bdhue-lg { --filter-bdhue: hue-rotate(var(--hue-lg, var(--angle-lg, var(--lg, lg))));${vars}; }`,
    );
  });

  it('hue rotate with custom value in predefined syntax', () => {
    expect(convert('bdhue--0.25turn')).toBe(
      `.bdhue--0\\.25turn { --filter-bdhue: hue-rotate(-0.25turn);${vars}; }`,
    );
    expect(convert('bdhue-[3.142rad]')).toBe(
      `.bdhue-\\[3\\.142rad\\] { --filter-bdhue: hue-rotate(3.142rad);${vars}; }`,
    );
  });

  it('hue rotate with custom value', () => {
    expect(convert('bdhue=2')).toBe(
      `.bdhue\\=2 { --filter-bdhue: hue-rotate(2);${vars}; }`,
    );
  });

  it('hue rotate with custom value and important', () => {
    expect(convert('!bdhue=10')).toBe(
      `.\\!bdhue\\=10 { --filter-bdhue: hue-rotate(10);${vars} !important; }`,
    );
  });
});

describe('Drop Shadow', () => {
  it('drop-shadow with variable', () => {
    expect(convert('bdshadow-2xs')).toBe(
      `.bdshadow-2xs { --filter-bdshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))));${vars}; }`,
    );
  });

  it('drop-shadow with multiple variables', () => {
    expect(convert('bdshadow-2xs,light2xs')).toBe(
      `.bdshadow-2xs\\,light2xs { --filter-bdshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs)))) drop-shadow(var(--dshadow-light2xs, var(--shadow-light2xs, var(--light2xs, light2xs))));${vars}; }`,
    );
  });

  it('drop-shadow with multiple known variables', () => {
    expect(convert('bdshadow-px_px')).toBe(
      `.bdshadow-px_px { --filter-bdshadow: drop-shadow(1px 1px);${vars}; }`,
    );
    expect(convert('bdshadow-0px_1px')).toBe(
      `.bdshadow-0px_1px { --filter-bdshadow: drop-shadow(0px 1px);${vars}; }`,
    );
    expect(convert('bdshadow-0px_-1px')).toBe(
      `.bdshadow-0px_-1px { --filter-bdshadow: drop-shadow(0px -1px);${vars}; }`,
    );
    expect(convert('bdshadow-0px_-1')).toBe(
      `.bdshadow-0px_-1 { --filter-bdshadow: drop-shadow(0px var(--dshadow--1, var(--space--1, calc(-1rem * var(--dshadow-spacer, var(--shadow-spacer, var(--spacer, 0.25)))))));${vars}; }`,
    );
    expect(convert('bdshadow-0px_1px_red')).toBe(
      `.bdshadow-0px_1px_red { --filter-bdshadow: drop-shadow(0px 1px oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-lightness-factor, var(--red-lightness-factor, var(--dshadow-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--dshadow-red-chroma-factor, var(--red-chroma-factor, var(--dshadow-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--dshadow-red-hue-rotate, var(--red-hue-rotate, var(--dshadow-hue-rotate, var(--hue-rotate, 0))))) / alpha));${vars}; }`,
    );
    expect(convert('bdshadow-0px_1px_0px_red')).toBe(
      `.bdshadow-0px_1px_0px_red { --filter-bdshadow: drop-shadow(0px 1px 0px oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-lightness-factor, var(--red-lightness-factor, var(--dshadow-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--dshadow-red-chroma-factor, var(--red-chroma-factor, var(--dshadow-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--dshadow-red-hue-rotate, var(--red-hue-rotate, var(--dshadow-hue-rotate, var(--hue-rotate, 0))))) / alpha));${vars}; }`,
    );
    expect(convert('bdshadow-0_1_0_red')).toBe(
      `.bdshadow-0_1_0_red { --filter-bdshadow: drop-shadow(0 var(--dshadow-1, var(--space-1, calc(1rem * var(--dshadow-spacer, var(--shadow-spacer, var(--spacer, 0.25)))))) 0 oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-lightness-factor, var(--red-lightness-factor, var(--dshadow-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--dshadow-red-chroma-factor, var(--red-chroma-factor, var(--dshadow-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--dshadow-red-hue-rotate, var(--red-hue-rotate, var(--dshadow-hue-rotate, var(--hue-rotate, 0))))) / alpha));${vars}; }`,
    );
  });

  it('drop-shadow known and unknown variables', () => {
    expect(convert('bdshadow-2xs_red')).toBe(
      `.bdshadow-2xs_red { --filter-bdshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-lightness-factor, var(--red-lightness-factor, var(--dshadow-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--dshadow-red-chroma-factor, var(--red-chroma-factor, var(--dshadow-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--dshadow-red-hue-rotate, var(--red-hue-rotate, var(--dshadow-hue-rotate, var(--hue-rotate, 0))))) / alpha));${vars}; }`,
    );

    expect(convert('bdshadow-2xs_px_red')).toBe(
      `.bdshadow-2xs_px_red { --filter-bdshadow: drop-shadow(var(--dshadow-2xs, var(--shadow-2xs, var(--2xs, 2xs))) 1px oklch(from var(--dshadow-red, var(--shadow-red, var(--color-red, var(--red, red)))) calc(l * var(--dshadow-red-lightness-factor, var(--red-lightness-factor, var(--dshadow-lightness-factor, var(--lightness-factor, 1))))) calc(c * var(--dshadow-red-chroma-factor, var(--red-chroma-factor, var(--dshadow-chroma-factor, var(--chroma-factor, 1))))) calc(h + var(--dshadow-red-hue-rotate, var(--red-hue-rotate, var(--dshadow-hue-rotate, var(--hue-rotate, 0))))) / alpha));${vars}; }`,
    );
  });

  it('drop-shadow with custom value', () => {
    expect(convert('bdshadow=0px_1px_0px_rgb(0_0_0/0.15)')).toBe(
      `.bdshadow\\=0px_1px_0px_rgb\\(0_0_0\\/0\\.15\\) { --filter-bdshadow: drop-shadow(0px 1px 0px rgb(0 0 0/0.15));${vars}; }`,
    );
  });
});
