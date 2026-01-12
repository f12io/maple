import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Transition', () => {
  it('transition with variable', () => {
    expect(convert('ts-colors')).toBe(
      `.ts-colors { transition: var(--ts-colors, var(--time-colors, var(--colors, colors))); }`,
    );
  });

  it('transition with multiple variables', () => {
    expect(convert('ts-colors,shadow')).toBe(
      `.ts-colors\\,shadow { transition: var(--ts-colors, var(--time-colors, var(--colors, colors))), var(--ts-shadow, var(--time-shadow, var(--shadow, shadow))); }`,
    );
  });

  it('transition with duration', () => {
    expect(convert('ts-300')).toBe(
      `.ts-300 { transition: var(--ts-300, var(--time-300, 300ms)); }`,
    );
  });

  it('transition with duration and delay', () => {
    expect(convert('ts-300_200')).toBe(
      `.ts-300_200 { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)); }`,
    );
  });

  it('transition with duration and custom delay', () => {
    expect(convert('ts-300_200ms')).toBe(
      `.ts-300_200ms { transition: var(--ts-300, var(--time-300, 300ms)) 200ms; }`,
    );
  });

  it('transition with duration and property', () => {
    expect(convert('ts-300_color')).toBe(
      `.ts-300_color { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-c, var(--time-c, var(--prop-c, var(--c, color)))); }`,
    );
  });

  it('transition with duration and abbr color property', () => {
    expect(convert('ts-300_c')).toBe(
      `.ts-300_c { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-c, var(--time-c, var(--prop-c, var(--c, color)))); }`,
    );
  });

  it('transition with duration and abbr translate property', () => {
    expect(convert('ts-300_tl')).toBe(
      `.ts-300_tl { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-tl, var(--time-tl, var(--prop-tl, var(--tl, translate)))); }`,
    );
  });

  it('transition with duration, delay and property', () => {
    expect(convert('ts-300_200_color')).toBe(
      `.ts-300_200_color { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)) var(--ts-c, var(--time-c, var(--prop-c, var(--c, color)))); }`,
    );
  });

  it('transition with duration, delay, property and timing function', () => {
    expect(convert('ts-300_200_bgc_ease')).toBe(
      `.ts-300_200_bgc_ease { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)) var(--ts-bgc, var(--time-bgc, var(--prop-bgc, var(--bgc, background-color)))) var(--ts-ease, var(--time-ease, var(--ease, ease))); }`,
    );
  });

  it('transition with duration, delay, property with dash and timing function', () => {
    expect(convert('ts-300_200_background-color_ease')).toBe(
      `.ts-300_200_background-color_ease { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)) var(--ts-bgc, var(--time-bgc, var(--prop-bgc, var(--bgc, background-color)))) var(--ts-ease, var(--time-ease, var(--ease, ease))); }`,
    );
  });

  it('transition with duration, delay, property with camelCase and timing function', () => {
    expect(convert('ts-300_200_backgroundColor_ease')).toBe(
      `.ts-300_200_backgroundColor_ease { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)) var(--ts-bgc, var(--time-bgc, var(--prop-bgc, var(--bgc, background-color)))) var(--ts-ease, var(--time-ease, var(--ease, ease))); }`,
    );
  });

  it('transition with multiple properties', () => {
    expect(convert('ts-300_200_bgc_ease,200_color')).toBe(
      `.ts-300_200_bgc_ease\\,200_color { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)) var(--ts-bgc, var(--time-bgc, var(--prop-bgc, var(--bgc, background-color)))) var(--ts-ease, var(--time-ease, var(--ease, ease))), var(--ts-200, var(--time-200, 200ms)) var(--ts-c, var(--time-c, var(--prop-c, var(--c, color)))); }`,
    );
  });

  it('transition with multiple properties and important', () => {
    expect(convert('!ts-300_200_bgc_ease,200_color')).toBe(
      `.\\!ts-300_200_bgc_ease\\,200_color { transition: var(--ts-300, var(--time-300, 300ms)) var(--ts-200, var(--time-200, 200ms)) var(--ts-bgc, var(--time-bgc, var(--prop-bgc, var(--bgc, background-color)))) var(--ts-ease, var(--time-ease, var(--ease, ease))), var(--ts-200, var(--time-200, 200ms)) var(--ts-c, var(--time-c, var(--prop-c, var(--c, color)))) !important; }`,
    );
  });

  it('transition single custom value', () => {
    expect(convert('ts=300ms_color_ease')).toBe(
      `.ts\\=300ms_color_ease { transition: 300ms color ease; }`,
    );
  });

  it('transition custom value', () => {
    expect(convert('ts=300ms_0.2s_background-color_ease,200ms_color')).toBe(
      `.ts\\=300ms_0\\.2s_background-color_ease\\,200ms_color { transition: 300ms 0.2s background-color ease,200ms color; }`,
    );
  });

  it('will-change single shortcut', () => {
    expect(convert('wc-bgc')).toBe(
      `.wc-bgc { will-change: var(--wc-bgc, var(--prop-bgc, var(--bgc, background-color))); }`,
    );
  });

  it('will-change single multiple shortcuts', () => {
    expect(convert('wc-bgc,c,margin-right,paddingRight')).toBe(
      `.wc-bgc\\,c\\,margin-right\\,paddingRight { will-change: var(--wc-bgc, var(--prop-bgc, var(--bgc, background-color))), var(--wc-c, var(--prop-c, var(--c, color))), var(--wc-mr, var(--prop-mr, var(--mr, margin-right))), var(--wc-pr, var(--prop-pr, var(--pr, padding-right))); }`,
    );
  });

  it('will-change with variables', () => {
    expect(convert('wc-colors,shadow')).toBe(
      `.wc-colors\\,shadow { will-change: var(--wc-colors, var(--colors, colors)), var(--wc-shadow, var(--shadow, shadow)); }`,
    );
  });

  it('will-change with custom value', () => {
    expect(convert('wc=background-color,color')).toBe(
      `.wc\\=background-color\\,color { will-change: background-color,color; }`,
    );
  });

  it('transition-property single shortcut', () => {
    expect(convert('tsprop-bgc')).toBe(
      `.tsprop-bgc { transition-property: var(--tsprop-bgc, var(--prop-bgc, var(--bgc, background-color))); }`,
    );
  });

  it('transition-property single multiple shortcuts', () => {
    expect(convert('tsprop-bgc,c,margin-right,paddingRight')).toBe(
      `.tsprop-bgc\\,c\\,margin-right\\,paddingRight { transition-property: var(--tsprop-bgc, var(--prop-bgc, var(--bgc, background-color))), var(--tsprop-c, var(--prop-c, var(--c, color))), var(--tsprop-mr, var(--prop-mr, var(--mr, margin-right))), var(--tsprop-pr, var(--prop-pr, var(--pr, padding-right))); }`,
    );
  });

  it('transition-property with variables', () => {
    expect(convert('tsprop-colors,shadow')).toBe(
      `.tsprop-colors\\,shadow { transition-property: var(--tsprop-colors, var(--colors, colors)), var(--tsprop-shadow, var(--shadow, shadow)); }`,
    );
  });

  it('transition-duration', () => {
    expect(convert('tsdur-300')).toBe(
      `.tsdur-300 { transition-duration: var(--tsdur-300, var(--time-300, 300ms)); }`,
    );
  });

  it('transition-delay', () => {
    expect(convert('tsdel-300')).toBe(
      `.tsdel-300 { transition-delay: var(--tsdel-300, var(--time-300, 300ms)); }`,
    );
  });
});
