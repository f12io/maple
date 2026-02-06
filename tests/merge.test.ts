import { describe, expect, it } from 'vitest';
import { processClassList } from '../src/core/generator';

function testMerge(className: string, expected: string) {
  const el = document.createElement('div');
  el.className = className;
  processClassList(el);
  expect(el.className).toBe(expected);
}

describe('Merge', () => {
  describe('Same property conflicts', () => {
    it('p-4 vs p-6', () => {
      testMerge('p-4 p-6', 'p-6');
    });

    it('m-4 vs m-8', () => {
      testMerge('m-4 m-8', 'm-8');
    });

    it('bgc-red vs bgc-blue', () => {
      testMerge('bgc-red bgc-blue', 'bgc-blue');
    });

    it('w-4 vs w-8', () => {
      testMerge('w-4 w-8', 'w-8');
    });

    it('should keep both if not conflicting', () => {
      testMerge('p-4 m-4', 'p-4 m-4');
    });
  });

  describe('Shorthand/longhand', () => {
    it('p-4 vs pt-6 (no conflict)', () => {
      testMerge('p-4 pt-6', 'p-4 pt-6');
    });

    it('m-4 vs mx-6 (no conflict)', () => {
      testMerge('m-4 mx-6', 'm-4 mx-6');
    });

    it('mx-4 vs m-6 (conflict)', () => {
      testMerge('mx-4 m-6', 'm-6');
    });

    it('br-1 vs brt-2 (no conflict)', () => {
      testMerge('br-1 brt-2', 'br-1 brt-2');
    });

    it('brt-1 vs br-2 (conflict)', () => {
      testMerge('brt-1 br-2', 'br-2');
    });

    it('br-px_solid vs brc-red (no conflict)', () => {
      testMerge('br-px_solid brc-red', 'br-px_solid brc-red');
    });

    it('brc-red vs br-px_solid (conflict)', () => {
      testMerge('brc-red br-px_solid', 'br-px_solid');
    });
  });

  describe('Abbreviation and original property conflicts', () => {
    it('p-4 vs padding-6', () => {
      testMerge('p-4 padding-6', 'padding-6');
    });

    it('padding-4 vs padding-6', () => {
      testMerge('padding-4 p-6', 'p-6');
    });

    it('padding-4 vs padding-6', () => {
      testMerge('padding-4 padding-6', 'padding-6');
    });
  });

  describe('Media query context', () => {
    it('p-4 vs @md:p-4 (no conflict)', () => {
      testMerge('p-4 @md:p-4', 'p-4 @md:p-4');
    });

    it('@md:p-4 vs @md:p-6 (conflict)', () => {
      testMerge('@md:p-4 @md:p-6', '@md:p-6');
    });

    it('@md:p-4 vs @lg:p-4 (no conflict)', () => {
      testMerge('@md:p-4 @lg:p-4', '@md:p-4 @lg:p-4');
    });

    it('@dark:@md:p-4 vs @md:@dark:p-4 (conflict)', () => {
      testMerge('@dark:@md:p-6 @md:@dark:p-4', '@md:@dark:p-4');
    });

    it('@print:@md:p-6 vs @md:@print:p-4 (conflict)', () => {
      testMerge('@print:@md:p-6 @md:@print:p-4', '@md:@print:p-4');
    });

    /**
     * Maple moves the top priority media-query to the top of the nesting tree, and
     * leaves the rest of the media-query as is. In this case, @print is the top priority
     * media-query, so it is moved to the top of the nesting tree. Because the order of
     * @dark and @md are different, maple does not merge them.
     */
    it('@print:@md:@dark:p-6 vs @md:@dark:@print:p-4 (no conflict)', () => {
      testMerge(
        '@print:@md:@dark:p-6 @dark:@md:@print:p-4',
        '@print:@md:@dark:p-6 @dark:@md:@print:p-4',
      );
    });
  });

  describe('Selector context', () => {
    it('p-4 vs &:hover:p-4', () => {
      testMerge('p-4 &:hover:p-4', 'p-4 &:hover:p-4');
    });

    it('&:hover:p-4 vs &:hover:p-6', () => {
      testMerge('&:hover:p-4 &:hover:p-6', '&:hover:p-6');
    });

    it('^.active:p-4 vs ^.active:p-6', () => {
      testMerge('^.active:p-4 ^.active:p-6', '^.active:p-6');
    });
  });

  describe('Composable properties', () => {
    it('tl-4 vs rot-45 (compose)', () => {
      testMerge('tl-4 rot-45', 'tl-4 rot-45');
    });

    it('tl-4 vs tl-8 (conflict)', () => {
      testMerge('tl-4 tl-8', 'tl-8');
    });

    it('blur-4 vs brightness-100 (compose)', () => {
      testMerge('blur-4 brightness-100', 'blur-4 brightness-100');
    });

    it('blur-4 vs blur-8 (conflict)', () => {
      testMerge('blur-4 blur-8', 'blur-8');
    });
  });

  describe('Shortcuts', () => {
    it('fx vs gr (both display)', () => {
      testMerge('fx gr', 'gr');
    });

    it('abs vs rel (both position)', () => {
      testMerge('abs rel', 'rel');
    });

    it('visible vs hidden (both visibility)', () => {
      testMerge('visible hidden', 'hidden');
    });
  });

  describe('Exact duplicates', () => {
    it('should deduplicate p-6 p-6', () => {
      testMerge('p-6 p-6', 'p-6');
    });

    it('should deduplicate multiple occurrences p-4 p-4 p-6', () => {
      testMerge('p-4 p-4 p-6', 'p-6');
    });

    it('should deduplicate fx fx', () => {
      testMerge('fx fx', 'fx');
    });

    it('should keep latest p-6 and remove earlier p-6 and p-4', () => {
      testMerge('p-4 p-6 p-4 p-6', 'p-6');
    });
  });

  describe('Arbitrary Values', () => {
    it('merges arbitrary values with same property', () => {
      testMerge('h-[10px] h-[20px]', 'h-[20px]');
    });

    it('merges arbitrary colors', () => {
      testMerge('c-[#f00] c-[#00f]', 'c-[#00f]');
    });

    it('merges variable value and custom value', () => {
      testMerge('p-4 p=10px', 'p=10px');
    });

    it('merges variable value and custom value with original property', () => {
      testMerge('p-4 padding=10px', 'padding=10px');
    });
  });

  describe('Modifiers & Pseudo-classes', () => {
    it('merges stacked modifiers', () => {
      testMerge('&:hover:focus:p-2 &:hover:focus:p-4', '&:hover:focus:p-4');
    });

    it('distinguishes different modifier order (parser dependent)', () => {
      testMerge(
        '&:hover:focus:p-2 &:focus:hover:p-4',
        '&:hover:focus:p-2 &:focus:hover:p-4',
      );
    });

    it('merges arbitrary variants', () => {
      testMerge(
        '[&:nth-child(3)]:py-0 [&:nth-child(3)]:py-4',
        '[&:nth-child(3)]:py-4',
      );
    });
  });

  describe('Important Modifier', () => {
    it('resolves conflicts with important modifier (later wins)', () => {
      testMerge('p-3! p-4!', 'p-4!');
    });

    it('resolves normal vs important (later wins)', () => {
      testMerge('p-3! p-4', 'p-4');
      testMerge('p-3 p-4!', 'p-4!');
    });
  });

  describe('Refinements & Overlaps', () => {
    it('allows refinements (p-3 px-5)', () => {
      testMerge('p-3 px-5', 'p-3 px-5');
    });

    it('allows reverse refinements (px-5 p-3)', () => {
      testMerge('px-5 p-3', 'p-3');
    });
  });

  describe('CSS Variables', () => {
    it('--tone-factor (conflict)', () => {
      testMerge('--tone-factor=1 --tone-factor=2', '--tone-factor=2');
    });

    it('--border --border-color (no conflict)', () => {
      testMerge(
        '--border=1px_solid --border-color=red',
        '--border=1px_solid --border-color=red',
      );
    });

    it('--border-color --border (no conflict)', () => {
      testMerge(
        '--border-color=red --border=1px_solid',
        '--border-color=red --border=1px_solid',
      );
    });
  });

  describe('Edge Cases (O(depth) check)', () => {
    it('rad-px br-px (no conflict between border and border-radius)', () => {
      testMerge('rad-px br-px', 'rad-px br-px');
      testMerge('br-px rad-px', 'br-px rad-px');
      testMerge('md:rad-px md:br-px', 'md:rad-px md:br-px');
      testMerge('md:br-px md:rad-px', 'md:br-px md:rad-px');
    });

    it('mx-2 mr-4 (no conflict)', () => {
      testMerge('mx-2 mr-4', 'mx-2 mr-4');
      testMerge('mr-4 mx-2', 'mr-4 mx-2');
    });

    it('fxdir=row fx-1 (no conflict between flex and flex-direction)', () => {
      testMerge('fxdir=row fx-1', 'fxdir=row fx-1');
      testMerge('fx-1 fxdir=row', 'fx-1 fxdir=row');
    });

    it('br-px brimg-none (no conflict)', () => {
      testMerge('brimg-none br-px', 'brimg-none br-px');
      testMerge('br-px brimg-none', 'br-px brimg-none');
    });

    it('tfo=center scale-1.5 (no conflict)', () => {
      testMerge('tfo=center scale-1.5', 'tfo=center scale-1.5');
      testMerge('scale-1.5 tfo=center', 'scale-1.5 tfo=center');
    });

    it('tfo=center tf-lg (no conflict)', () => {
      testMerge('tfo=center tf-lg', 'tfo=center tf-lg');
      testMerge('tf-lg tfo=center', 'tf-lg tfo=center');
    });

    it('of=hidden ofwr=anywhere (no conflict)', () => {
      testMerge('ofwr=anywhere of=hidden', 'ofwr=anywhere of=hidden');
      testMerge('of=hidden ofwr=anywhere', 'of=hidden ofwr=anywhere');
    });

    it('ol-none oloff-2 (no conflict)', () => {
      testMerge('oloff-2 ol-none', 'oloff-2 ol-none');
      testMerge('ol-none oloff-2', 'ol-none oloff-2');
    });

    it('cols-1 col-2 (no conflict between grid-template-columns and grid-column)', () => {
      testMerge('cols-1 col-2', 'cols-1 col-2');
      testMerge('cols-2 col-1', 'cols-2 col-1');
    });

    it('gr-none col-2 (no conflict between grid and grid-column)', () => {
      testMerge('gr-none col-2', 'gr-none col-2');
    });

    it('cols-1 gr-none (conflict between grid and grid-template-columns)', () => {
      testMerge('cols-1 gr-none', 'gr-none');
    });

    it('text-decoration (shorthand) vs thickness (no conflict)', () => {
      testMerge(
        'tdeco-none textDecorationThickness-px',
        'tdeco-none textDecorationThickness-px',
      );
    });

    it('text-decoration (shorthand) vs thickness (conflict)', () => {
      testMerge('textDecorationThickness-px tdeco-none', 'tdeco-none');
    });

    it('mask (shorthand) vs mask-image (no conflict)', () => {
      testMerge('mask-none maskImage-url', 'mask-none maskImage-url');
    });

    it('mask (shorthand) vs mask-image (conflict)', () => {
      testMerge('maskImage-url mask-none', 'mask-none');
    });
  });
});
