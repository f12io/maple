import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Color', () => {
  it('text color with custom variable', () => {
    expect(convert('c-primary')).toBe(
      '.c-primary { color: oklch(from var(--c-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--c-primary-lightness-factor, var(--primary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--c-primary-chroma-factor, var(--primary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--c-primary-hue-rotate, var(--primary-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('background color with custom variable', () => {
    expect(convert('bgc-primary')).toBe(
      '.bgc-primary { background-color: oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('text color', () => {
    expect(convert('c-red')).toBe(
      '.c-red { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('text color with alpha', () => {
    expect(convert('c-red/50')).toBe(
      '.c-red\\/50 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / 50%); }',
    );
  });

  it('text color without shortcut', () => {
    expect(convert('color-red')).toBe(
      '.color-red { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('text color', () => {
    expect(convert('c-red-500')).toBe(
      '.c-red-500 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('text color with important', () => {
    expect(convert('!c-red-500')).toBe(
      '.\\!c-red-500 { color: oklch(from var(--c-red, var(--color-red, var(--red, red))) calc(l * var(--c-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--c-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--c-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha) !important; }',
    );
  });

  it('background color', () => {
    expect(convert('bgc-blue-600')).toBe(
      '.bgc-blue-600 { background-color: oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc((l + l * -0.2) * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('border color', () => {
    expect(convert('brc-gray-300')).toBe(
      '.brc-gray-300 { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (1 - l) * 0.4) * var(--brc-gray-lightness-factor, var(--gray-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--brc-gray-chroma-factor, var(--gray-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--brc-gray-hue-rotate, var(--gray-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('border color multiple values', () => {
    expect(convert('brc-gray-300_blue-200')).toBe(
      '.brc-gray-300_blue-200 { border-color: oklch(from var(--brc-gray, var(--color-gray, var(--gray, gray))) calc((l + (1 - l) * 0.4) * var(--brc-gray-lightness-factor, var(--gray-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--brc-gray-chroma-factor, var(--gray-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--brc-gray-hue-rotate, var(--gray-hue-rotate, var(--hue-rotate, 0)))) / alpha) oklch(from var(--brc-blue, var(--color-blue, var(--blue, blue))) calc((l + (1 - l) * 0.6) * var(--brc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--brc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--brc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha); }',
    );
  });

  it('color hex', () => {
    expect(convert('c-#ff0000')).toBe('.c-\\#ff0000 { color: #ff0000; }');
  });

  it('color rgba', () => {
    expect(convert('c-rgba(255,0,0,1)')).toBe(
      '.c-rgba\\(255\\,0\\,0\\,1\\) { color: rgba(255, 0, 0, 1); }',
    );
  });

  it('color custom hex value', () => {
    expect(convert('c=#ff0000')).toBe('.c\\=\\#ff0000 { color: #ff0000; }');
  });
});
