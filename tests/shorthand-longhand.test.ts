import { afterEach, describe, expect, it } from 'vitest';
import { processClassList } from '../src/core/generator';

/**
 * A longhand outranks the shorthand that sets it, so a state or query
 * variant on a longhand lands even when the base shorthand is on the
 * same element. The layer address nests shorthand depth outside value
 * kind to make that hold; with the kind outside, a keyword longhand sat
 * in an earlier layer than its length- or colour-valued shorthand and
 * could not be overridden at all.
 *
 * One pair per affected family. The families differ only in which value
 * kinds they mix, so the mechanism is the same throughout.
 */
const elements: Array<Element> = [];

function styled(cls: string, property: string) {
  const el = document.createElement('div');
  el.className = `${cls} on`;
  document.body.append(el);
  processClassList(el);
  elements.push(el);

  return getComputedStyle(el).getPropertyValue(property);
}

afterEach(() => {
  for (const el of elements) el.remove();
  elements.length = 0;
});

describe('Shorthand and longhand layering', () => {
  describe('a variant on the longhand beats the base shorthand', () => {
    it('background / background-image', () => {
      expect(
        styled(
          'background=gray &.on:bgimg=[linear-gradient(red,blue)]',
          'background-image',
        ),
      ).toBe('linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))');
    });

    it('text-decoration / text-decoration-line', () => {
      expect(
        styled(
          'tdeco=none &.on:text-decoration-line=underline',
          'text-decoration-line',
        ),
      ).toBe('underline');
    });

    it('flex / flex-grow', () => {
      expect(styled('fx=1 &.on:fxg=2', 'flex-grow')).toBe('2');
    });

    it('animation / animation-name', () => {
      expect(
        styled('anim=[1s_linear_foo] &.on:animname=bar', 'animation-name'),
      ).toBe('bar');
    });

    it('border / border-top-style', () => {
      expect(
        styled(
          'br=[1px_solid_red] &.on:border-top-style=dashed',
          'border-top-style',
        ),
      ).toBe('dashed');
    });

    it('outline / outline-style', () => {
      expect(
        styled('outline=[1px_solid_red] &.on:outline-style=dotted', 'outline-style'),
      ).toBe('dotted');
    });

    it('mask / mask-image', () => {
      expect(
        styled('mask=none &.on:mask-image=[linear-gradient(red,blue)]', 'mask-image'),
      ).toBe('linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))');
    });

    it('columns / column-count', () => {
      expect(styled('columns=[2_100px] &.on:column-count=4', 'column-count')).toBe(
        '4',
      );
    });

    it('works through a query variant too', () => {
      expect(
        styled(
          'tdeco=none @mnw=1px:text-decoration-line=underline',
          'text-decoration-line',
        ),
      ).toBe('underline');
    });
  });

  describe('the ordering is unconditional', () => {
    /**
     * The flip side of the rule: a variant on the shorthand cannot
     * override a base longhand, because depth decides before context
     * does. Authors reset the longhand in the variant instead.
     */
    it('a variant on the shorthand does not beat the base longhand', () => {
      expect(
        styled(
          'bgimg=[linear-gradient(red,blue)] &.on:background=gray',
          'background-image',
        ),
      ).toBe('linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))');
    });

    /**
     * Layer order reverses for important declarations, so marking both
     * sides important hands the shorthand the win. Marking only the
     * variant important is the escape hatch, since importance outranks
     * layer order outright.
     */
    it('both sides important gives the shorthand the win', () => {
      expect(
        styled(
          '!tdeco=none !&.on:text-decoration-line=underline',
          'text-decoration-line',
        ),
      ).toBe('none');
    });

    it('an important variant alone still wins', () => {
      expect(
        styled(
          'tdeco=none !&.on:text-decoration-line=underline',
          'text-decoration-line',
        ),
      ).toBe('underline');
    });
  });

  describe('unrelated relationships are untouched', () => {
    it('keeps a longhand of the same kind winning', () => {
      expect(styled('background=gray &.on:bgc=blue', 'background-color')).toBe(
        'rgb(0, 0, 255)',
      );
    });

    it('keeps ordinary shorthand and longhand resolution', () => {
      expect(styled('p=10px &.on:pl=20px', 'padding-left')).toBe('20px');
    });

    it('keeps physical overriding logical', () => {
      expect(styled('mx-4 ml-8', 'margin-left')).toBe('32px');
    });

    it('keeps same-property variants deciding by specificity', () => {
      expect(styled('bgc=red &.on:bgc=blue', 'background-color')).toBe(
        'rgb(0, 0, 255)',
      );
    });
  });
});
