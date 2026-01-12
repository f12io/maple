import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Parent', () => {
  it('parent selector', () => {
    expect(convert('^.card:p-2')).toBe(
      '.card .\\^\\.card\\:p-2 { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('parent selector with hover', () => {
    expect(convert('^.card:hover:bgc=red')).toBe(
      '.card:hover .\\^\\.card\\:hover\\:bgc\\=red { background-color: red; }',
    );
  });

  it('nested parent selector with hover', () => {
    expect(convert('^.dark_.card:hover:bgc=black')).toBe(
      '.dark .card:hover .\\^\\.dark_\\.card\\:hover\\:bgc\\=black { background-color: black; }',
    );
  });
});

describe('Self', () => {
  it('self selector', () => {
    expect(convert('&:hover:p-2')).toBe(
      '.\\&\\:hover\\:p-2:hover { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('self selector with important', () => {
    expect(convert('!&:hover:c=red')).toBe(
      '.\\!\\&\\:hover\\:c\\=red:hover { color: red !important; }',
    );
  });

  it('self selector with attribute', () => {
    expect(convert('&[data-active="true"]:bgc=red')).toBe(
      '.\\&\\[data-active\\=\\"true\\"\\]\\:bgc\\=red[data-active="true"] { background-color: red; }',
    );
  });

  it('nested parent selector with self hover', () => {
    expect(convert('^.dark_.card&:hover:bgc=black')).toBe(
      '.dark .card .\\^\\.dark_\\.card\\&\\:hover\\:bgc\\=black:hover { background-color: black; }',
    );
  });
});

describe('Child', () => {
  it('child selector with slash', () => {
    expect(convert('/span:c=red')).toBe(
      '.\\/span\\:c\\=red span { color: red; }',
    );
  });

  it('child selector with ampersand and underscore', () => {
    expect(convert('&_span:c=red')).toBe(
      '.\\&_span\\:c\\=red span { color: red; }',
    );
  });

  it('direct child selector with slash', () => {
    expect(convert('/>span:c=red')).toBe(
      '.\\/\\>span\\:c\\=red >span { color: red; }',
    );
  });

  it('direct child selector with ampersand', () => {
    expect(convert('&>span:c=red')).toBe(
      '.\\&\\>span\\:c\\=red>span { color: red; }',
    );
  });

  it('sibling child selector with slash', () => {
    expect(convert('/+span:c=red')).toBe(
      '.\\/\\+span\\:c\\=red +span { color: red; }',
    );
  });

  it('sibling child selector with ampersand', () => {
    expect(convert('&+span:c=red')).toBe(
      '.\\&\\+span\\:c\\=red+span { color: red; }',
    );
  });

  it('nested child selector', () => {
    expect(convert('/span_a:c=red')).toBe(
      '.\\/span_a\\:c\\=red span a { color: red; }',
    );
  });

  it('nested child selector with hover', () => {
    expect(convert('/span_a:hover:c=red')).toBe(
      '.\\/span_a\\:hover\\:c\\=red span a:hover { color: red; }',
    );
  });

  it('nested child selector with attribute', () => {
    expect(convert('/span_a[data-active="true"]:bgc=red')).toBe(
      '.\\/span_a\\[data-active\\=\\"true\\"\\]\\:bgc\\=red span a[data-active="true"] { background-color: red; }',
    );
  });

  it('nested parent selector with self hover (slash) and child selector', () => {
    expect(convert('^.dark_.card&:hover/span:bgc=black')).toBe(
      '.dark .card .\\^\\.dark_\\.card\\&\\:hover\\/span\\:bgc\\=black:hover span { background-color: black; }',
    );
  });

  it('nested parent selector with self hover (underscore) and child selector', () => {
    expect(convert('^.dark_.card&:hover_span:bgc=black')).toBe(
      '.dark .card .\\^\\.dark_\\.card\\&\\:hover_span\\:bgc\\=black:hover span { background-color: black; }',
    );
  });
});

describe('Parser Stress Tests', () => {
  it('colon in utility value with brackets', () => {
    expect(convert('content-[Time:12:00]')).toBe(
      '.content-\\[Time\\:12\\:00\\] { content: var(--content-Time\\:12\\:00, var(--Time\\:12\\:00, Time:12:00)); }',
    );
  });

  it('colon in utility value with brackets and single quotes', () => {
    expect(convert("content-['Time:12:00']")).toBe(
      ".content-\\[\\'Time\\:12\\:00\\'\\] { content: var(--content-\\'Time\\:12\\:00\\', var(--\\'Time\\:12\\:00\\', 'Time:12:00')); }",
    );
  });

  it('colon in utility value with single quotes', () => {
    expect(convert("content-'Time:12:00'")).toBe(
      ".content-\\'Time\\:12\\:00\\' { content: var(--content-\\'Time\\:12\\:00\\', var(--\\'Time\\:12\\:00\\', 'Time:12:00')); }",
    );
  });

  it('colon in utility value with double quotes', () => {
    expect(convert('content-"Time:12:00"')).toBe(
      '.content-\\"Time\\:12\\:00\\" { content: var(--content-\\"Time\\:12\\:00\\", var(--\\"Time\\:12\\:00\\", "Time:12:00")); }',
    );
  });

  it('colon in custom utility value with single quotes', () => {
    expect(convert("content='Time:12:00'")).toBe(
      ".content\\=\\'Time\\:12\\:00\\' { content: 'Time:12:00'; }",
    );
  });

  it('colon in custom utility value with double quotes', () => {
    expect(convert('content="Time:12:00"')).toBe(
      '.content\\=\\"Time\\:12\\:00\\" { content: "Time:12:00"; }',
    );
  });

  it('colon in utility value and single quotes in selector ', () => {
    expect(convert("/.card[data-type='test']:content-'Time:12:00'")).toBe(
      ".\\/\\.card\\[data-type\\=\\'test\\'\\]\\:content-\\'Time\\:12\\:00\\' .card[data-type='test'] { content: var(--content-\\'Time\\:12\\:00\\', var(--\\'Time\\:12\\:00\\', 'Time:12:00')); }",
    );
  });

  it('colon in custom utility value and single quotes in selector ', () => {
    expect(convert("/.card[data-type='test']:content='Time:12:00'")).toBe(
      ".\\/\\.card\\[data-type\\=\\'test\\'\\]\\:content\\=\\'Time\\:12\\:00\\' .card[data-type='test'] { content: 'Time:12:00'; }",
    );
  });

  it('colon and equal sign in custom utility value + single quotes and colon in selector', () => {
    expect(
      convert("/.card[data-type='test:123&abc']:content='Time=12:00'"),
    ).toBe(
      ".\\/\\.card\\[data-type\\=\\'test\\:123\\&abc\\'\\]\\:content\\=\\'Time\\=12\\:00\\' .card[data-type='test:123&abc'] { content: 'Time=12:00'; }",
    );
  });

  it('slash child not selector with attribute', () => {
    expect(convert("/svg:not([class*='p-']):p-4")).toBe(
      ".\\/svg\\:not\\(\\[class\\*\\=\\'p-\\'\\]\\)\\:p-4 svg:not([class*='p-']) { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }",
    );
  });

  it('ampersand child not selector with attribute', () => {
    expect(convert("&_svg:not([class*='p-']):p-4")).toBe(
      ".\\&_svg\\:not\\(\\[class\\*\\=\\'p-\\'\\]\\)\\:p-4 svg:not([class*='p-']) { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }",
    );
  });
});

describe('Replacements', () => {
  it('parent replacement selector', () => {
    expect(convert('^:rtl:p-2')).toBe(
      '[dir="rtl"] .\\^\\:rtl\\:p-2 { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('self replacement selector', () => {
    expect(convert('&:odd:p-2')).toBe(
      '.\\&\\:odd\\:p-2:nth-child(odd) { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('child replacement selector', () => {
    expect(convert('/span:even:p-2')).toBe(
      '.\\/span\\:even\\:p-2 span:nth-child(even) { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('nested replacement selector', () => {
    expect(convert('^:rtl&:odd/span:even:p-2')).toBe(
      '[dir="rtl"] .\\^\\:rtl\\&\\:odd\\/span\\:even\\:p-2:nth-child(odd) span:nth-child(even) { padding: var(--p-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });
});
