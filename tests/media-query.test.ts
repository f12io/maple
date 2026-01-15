import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Container Query', () => {
  it('container with predefined breakpoint', () => {
    expect(convert('md:o-0')).toBe(
      '@container (min-width: 768px) { .md\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with name and predefined breakpoint', () => {
    expect(convert('md(section):o-0')).toBe(
      '@container section (min-width: 768px) { .md\\(section\\)\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not', () => {
    expect(convert('not-md:o-0')).toBe(
      '@container not (min-width: 768px) { .not-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with name and not', () => {
    expect(convert('not-md(section):o-0')).toBe(
      '@container section not (min-width: 768px) { .not-md\\(section\\)\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with max width and predefined breakpoint', () => {
    expect(convert('mxw-md:o-0')).toBe(
      '@container not (min-width: 768px) { .mxw-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not max width and predefined breakpoint', () => {
    expect(convert('not-mxw-md:o-0')).toBe(
      '@container (min-width: 768px) { .not-mxw-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with max height and predefined breakpoint', () => {
    expect(convert('mxh-md:o-0')).toBe(
      '@container not (min-height: 768px) { .mxh-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not max height and predefined breakpoint', () => {
    expect(convert('not-mxh-md:o-0')).toBe(
      '@container (min-height: 768px) { .not-mxh-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with custom min width', () => {
    expect(convert('mnw=600px:o-0')).toBe(
      '@container (min-width: 600px) { .mnw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not custom min width', () => {
    expect(convert('not-mnw=600px:o-0')).toBe(
      '@container not (min-width: 600px) { .not-mnw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with custom min height', () => {
    expect(convert('mnh=600px:o-0')).toBe(
      '@container (min-height: 600px) { .mnh\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not custom min height', () => {
    expect(convert('not-mnh=600px:o-0')).toBe(
      '@container not (min-height: 600px) { .not-mnh\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with custom max width', () => {
    expect(convert('mxw=600px:o-0')).toBe(
      '@container (max-width: 600px) { .mxw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not custom max width', () => {
    expect(convert('not-mxw=600px:o-0')).toBe(
      '@container not (max-width: 600px) { .not-mxw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with landscape', () => {
    expect(convert('landscape:o-0')).toBe(
      '@container (orientation: landscape) { .landscape\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not landscape', () => {
    expect(convert('not-landscape:o-0')).toBe(
      '@container not (orientation: landscape) { .not-landscape\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with portrait', () => {
    expect(convert('portrait:o-0')).toBe(
      '@container (orientation: portrait) { .portrait\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not portrait', () => {
    expect(convert('not-portrait:o-0')).toBe(
      '@container not (orientation: portrait) { .not-portrait\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with scroll-state stuck', () => {
    expect(convert('stuck=top:o-0')).toBe(
      '@container scroll-state(stuck: top) { .stuck\\=top\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not scroll-state stuck', () => {
    expect(convert('not-stuck=top:o-0')).toBe(
      '@container not scroll-state(stuck: top) { .not-stuck\\=top\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with scroll-state scrollable', () => {
    expect(convert('scrollable=top:o-0')).toBe(
      '@container scroll-state(scrollable: top) { .scrollable\\=top\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not scroll-state scrollable', () => {
    expect(convert('not-scrollable=top:o-0')).toBe(
      '@container not scroll-state(scrollable: top) { .not-scrollable\\=top\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with scroll-state snapped', () => {
    expect(convert('snapped=y:o-0')).toBe(
      '@container scroll-state(snapped: y) { .snapped\\=y\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with not scroll-state snapped', () => {
    expect(convert('not-snapped=y:o-0')).toBe(
      '@container not scroll-state(snapped: y) { .not-snapped\\=y\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with name and scroll-state snapped', () => {
    expect(convert('snapped(snap-container)=y:o-0')).toBe(
      '@container snap-container scroll-state(snapped: y) { .snapped\\(snap-container\\)\\=y\\:o-0 { opacity: 0; } }',
    );
  });

  it('container with name and scroll-state snapped', () => {
    expect(convert('not-snapped(snap-container)=y:o-0')).toBe(
      '@container snap-container not scroll-state(snapped: y) { .not-snapped\\(snap-container\\)\\=y\\:o-0 { opacity: 0; } }',
    );
  });

  it('container style simple query in brackets', () => {
    expect(convert('style=[opacity:0]:o-0')).toBe(
      '@container style(opacity:0) { .style\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('container not style simple query in brackets', () => {
    expect(convert('not-style=[opacity:0]:o-0')).toBe(
      '@container not style(opacity:0) { .not-style\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('container style with name and simple query in brackets', () => {
    expect(convert('style(section)=[opacity:0]:o-0')).toBe(
      '@container section style(opacity:0) { .style\\(section\\)\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('container not style with name and simple query in brackets', () => {
    expect(convert('not-style(section)=[opacity:0]:o-0')).toBe(
      '@container section not style(opacity:0) { .not-style\\(section\\)\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });
});

describe('Media Query', () => {
  it('media with  predefined breakpoint', () => {
    expect(convert('@md:o-0')).toBe(
      '@media (min-width: 768px) { .\\@md\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not', () => {
    expect(convert('@not-md:o-0')).toBe(
      '@media not (min-width: 768px) { .\\@not-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with max width and predefined breakpoint', () => {
    expect(convert('@mxw-md:o-0')).toBe(
      '@media not (min-width: 768px) { .\\@mxw-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not max width and predefined breakpoint', () => {
    expect(convert('@not-mxw-md:o-0')).toBe(
      '@media (min-width: 768px) { .\\@not-mxw-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with max height and predefined breakpoint', () => {
    expect(convert('@mxh-md:o-0')).toBe(
      '@media not (min-height: 768px) { .\\@mxh-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not max height and predefined breakpoint', () => {
    expect(convert('@not-mxh-md:o-0')).toBe(
      '@media (min-height: 768px) { .\\@not-mxh-md\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with custom min width', () => {
    expect(convert('@mnw=600px:o-0')).toBe(
      '@media (min-width: 600px) { .\\@mnw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not custom min width', () => {
    expect(convert('@not-mnw=600px:o-0')).toBe(
      '@media not (min-width: 600px) { .\\@not-mnw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with custom min height', () => {
    expect(convert('@mnh=600px:o-0')).toBe(
      '@media (min-height: 600px) { .\\@mnh\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not custom min height', () => {
    expect(convert('@not-mnh=600px:o-0')).toBe(
      '@media not (min-height: 600px) { .\\@not-mnh\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with custom max width', () => {
    expect(convert('@mxw=600px:o-0')).toBe(
      '@media (max-width: 600px) { .\\@mxw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not custom max width', () => {
    expect(convert('@not-mxw=600px:o-0')).toBe(
      '@media not (max-width: 600px) { .\\@not-mxw\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with custom max height', () => {
    expect(convert('@mxh=600px:o-0')).toBe(
      '@media (max-height: 600px) { .\\@mxh\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not custom max height', () => {
    expect(convert('@not-mxh=600px:o-0')).toBe(
      '@media not (max-height: 600px) { .\\@not-mxh\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with landscape', () => {
    expect(convert('@landscape:o-0')).toBe(
      '@media (orientation: landscape) { .\\@landscape\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not landscape', () => {
    expect(convert('@not-landscape:o-0')).toBe(
      '@media not (orientation: landscape) { .\\@not-landscape\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with portrait', () => {
    expect(convert('@portrait:o-0')).toBe(
      '@media (orientation: portrait) { .\\@portrait\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not portrait', () => {
    expect(convert('@not-portrait:o-0')).toBe(
      '@media not (orientation: portrait) { .\\@not-portrait\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with dark', () => {
    expect(convert('@dark:o-0')).toBe(
      '@media (prefers-color-scheme: dark) { .\\@dark\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not dark', () => {
    expect(convert('@not-dark:o-0')).toBe(
      '@media not (prefers-color-scheme: dark) { .\\@not-dark\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with light', () => {
    expect(convert('@light:o-0')).toBe(
      '@media (prefers-color-scheme: light) { .\\@light\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not light', () => {
    expect(convert('@not-light:o-0')).toBe(
      '@media not (prefers-color-scheme: light) { .\\@not-light\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with motion-reduce', () => {
    expect(convert('@motion-reduce:o-0')).toBe(
      '@media (prefers-reduced-motion: reduce) { .\\@motion-reduce\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not motion-reduce', () => {
    expect(convert('@not-motion-reduce:o-0')).toBe(
      '@media not (prefers-reduced-motion: reduce) { .\\@not-motion-reduce\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with motions-safe', () => {
    expect(convert('@motion-safe:o-0')).toBe(
      '@media (prefers-reduced-motion: no-preference) { .\\@motion-safe\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not motions-safe', () => {
    expect(convert('@not-motion-safe:o-0')).toBe(
      '@media not (prefers-reduced-motion: no-preference) { .\\@not-motion-safe\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with custom prefers', () => {
    expect(convert('@contrast=more:o-0')).toBe(
      '@media (prefers-contrast: more) { .\\@contrast\\=more\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not custom prefers', () => {
    expect(convert('@not-contrast=more:o-0')).toBe(
      '@media not (prefers-contrast: more) { .\\@not-contrast\\=more\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with fallback to any other query', () => {
    expect(convert('@print:o-0')).toBe(
      '@media print { .\\@print\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not fallback to any other query', () => {
    expect(convert('@not-print:o-0')).toBe(
      '@media not print { .\\@not-print\\:o-0 { opacity: 0; } }',
    );
  });
});

describe('Supports', () => {
  it('supports simple query in brackets', () => {
    expect(convert('@supports=[opacity:0]:o-0')).toBe(
      '@supports (opacity:0) { .\\@supports\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('supports not simple query in brackets', () => {
    expect(convert('@not-supports=[opacity:0]:o-0')).toBe(
      '@supports not (opacity:0) { .\\@not-supports\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('supports complex query in brackets', () => {
    expect(convert('@supports=[(display:grid)and(gap:1px)]:o-0')).toBe(
      '@supports ((display:grid)and(gap:1px)) { .\\@supports\\=\\[\\(display\\:grid\\)and\\(gap\\:1px\\)\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('supports not complex query in brackets', () => {
    expect(convert('@not-supports=[(display:grid)and(gap:1px)]:o-0')).toBe(
      '@supports not ((display:grid)and(gap:1px)) { .\\@not-supports\\=\\[\\(display\\:grid\\)and\\(gap\\:1px\\)\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('supports with direct utility check', () => {
    expect(convert('@supports:opacity=0')).toBe(
      '@supports (opacity:0) { .\\@supports\\:opacity\\=0 { opacity: 0; } }',
    );
  });

  it('supports with not direct utility check', () => {
    expect(convert('@not-supports:opacity=0')).toBe(
      '@supports not (opacity:0) { .\\@not-supports\\:opacity\\=0 { opacity: 0; } }',
    );
  });

  it('supports with direct utility check of multiple values in brackets', () => {
    expect(convert('@supports:scale=[1_-1]')).toBe(
      '@supports (scale:1 -1) { .\\@supports\\:scale\\=\\[1_-1\\] { --tf-scale: scale(1 -1);transform: var(--tf-tl,) var(--tf-tlx,) var(--tf-tly,) var(--tf-tlz,) var(--tf-tl3,) var(--tf-scale,) var(--tf-scalex,) var(--tf-scaley,) var(--tf-scalez,) var(--tf-scale3,) var(--tf-rot,) var(--tf-rotx,) var(--tf-roty,) var(--tf-rotz,) var(--tf-rot3,) var(--tf-skew,) var(--tf-skewx,) var(--tf-skewy,) var(--tf-mtx,) var(--tf-mtx3,); } }',
    );
  });

  it('supports with not direct utility check of multiple values in brackets', () => {
    expect(convert('@not-supports:scale=[1_-1]')).toBe(
      '@supports not (scale:1 -1) { .\\@not-supports\\:scale\\=\\[1_-1\\] { --tf-scale: scale(1 -1);transform: var(--tf-tl,) var(--tf-tlx,) var(--tf-tly,) var(--tf-tlz,) var(--tf-tl3,) var(--tf-scale,) var(--tf-scalex,) var(--tf-scaley,) var(--tf-scalez,) var(--tf-scale3,) var(--tf-rot,) var(--tf-rotx,) var(--tf-roty,) var(--tf-rotz,) var(--tf-rot3,) var(--tf-skew,) var(--tf-skewx,) var(--tf-skewy,) var(--tf-mtx,) var(--tf-mtx3,); } }',
    );
  });
});

describe('Not with "Not Equal" Sign', () => {
  it('container not style with name and simple query in brackets', () => {
    expect(convert('style(section)!=[opacity:0]:o-0')).toBe(
      '@container section not style(opacity:0) { .style\\(section\\)\\!\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });

  it('media with not custom min width', () => {
    expect(convert('@mnw!=600px:o-0')).toBe(
      '@media not (min-width: 600px) { .\\@mnw\\!\\=600px\\:o-0 { opacity: 0; } }',
    );
  });

  it('supports not simple query in brackets', () => {
    expect(convert('@supports!=[opacity:0]:o-0')).toBe(
      '@supports not (opacity:0) { .\\@supports\\!\\=\\[opacity\\:0\\]\\:o-0 { opacity: 0; } }',
    );
  });
});

describe('Nested Queries', () => {
  it('media with not custom min width and dark', () => {
    expect(convert('@mnw!=600px:@dark:o-0')).toBe(
      '@media not (min-width: 600px) { @media (prefers-color-scheme: dark) { .\\@mnw\\!\\=600px\\:\\@dark\\:o-0 { opacity: 0; } } }',
    );
  });

  it('media with print and md', () => {
    expect(convert('@print:md:o-0')).toBe(
      '@media print { @container (min-width: 768px) { .\\@print\\:md\\:o-0 { opacity: 0; } } }',
    );
  });

  it('media with md and print', () => {
    expect(convert('md:@print:o-0')).toBe(
      '@media print { @container (min-width: 768px) { .md\\:\\@print\\:o-0 { opacity: 0; } } }',
    );
  });

  it('media with md and @xl', () => {
    expect(convert('md:@xl:o-0')).toBe(
      '@container (min-width: 768px) { @media (min-width: 1280px) { .md\\:\\@xl\\:o-0 { opacity: 0; } } }',
    );
  });
});

describe('Stress Tests', () => {
  it('1', () => {
    expect(
      convert(
        '@print:@supports=[(display:grid)and(gap:1px)]:@not-mxh=50rem:@mnw=600px:md:snapped(snap-container)=y:o-0',
      ),
    ).toBe(
      '@supports ((display:grid)and(gap:1px)) { @media print { @media not (max-height: 50rem) { @media (min-width: 600px) { @container (min-width: 768px) { @container snap-container scroll-state(snapped: y) { .\\@print\\:\\@supports\\=\\[\\(display\\:grid\\)and\\(gap\\:1px\\)\\]\\:\\@not-mxh\\=50rem\\:\\@mnw\\=600px\\:md\\:snapped\\(snap-container\\)\\=y\\:o-0 { opacity: 0; } } } } } } }',
    );
  });

  it('2', () => {
    expect(
      convert(
        "@print:@supports=[(display:grid)and(gap:1px)]:@not-mxh=50rem:@mnw=600px:md:style(section)=[--theme-color]:snapped(snap-container)=y:^:rtl:odd&:not(:has(.active))/.card[data-type='test:123&abc']:content='Time=12:00'",
      ),
    ).toBe(
      "@supports ((display:grid)and(gap:1px)) { @media print { @media not (max-height: 50rem) { @media (min-width: 600px) { @container (min-width: 768px) { @container section style(--theme-color) { @container snap-container scroll-state(snapped: y) { [dir=\"rtl\"]:nth-child(odd) .\\@print\\:\\@supports\\=\\[\\(display\\:grid\\)and\\(gap\\:1px\\)\\]\\:\\@not-mxh\\=50rem\\:\\@mnw\\=600px\\:md\\:style\\(section\\)\\=\\[--theme-color\\]\\:snapped\\(snap-container\\)\\=y\\:\\^\\:rtl\\:odd\\&\\:not\\(\\:has\\(\\.active\\)\\)\\/\\.card\\[data-type\\=\\'test\\:123\\&abc\\'\\]\\:content\\=\\'Time\\=12\\:00\\':not(:has(.active)) .card[data-type='test:123&abc'] { content: 'Time=12:00'; } } } } } } } }",
    );
  });
});
