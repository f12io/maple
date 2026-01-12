import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('grid-template-columns', () => {
  it('columns with integer', () => {
    expect(convert('cols-2')).toBe(
      '.cols-2 { grid-template-columns: repeat(var(--cols-2, 2), minmax(0, 1fr)); }',
    );
  });

  it('columns with multiple integers', () => {
    expect(convert('cols-100_150')).toBe(
      '.cols-100_150 { grid-template-columns: var(--cols-100, var(--space-100, calc(100rem * var(--spacer, 0.25)))) var(--cols-150, var(--space-150, calc(150rem * var(--spacer, 0.25)))); }',
    );
  });

  it('columns with css variable', () => {
    expect(convert('cols-lg')).toBe(
      '.cols-lg { grid-template-columns: var(--cols-lg, var(--space-lg, var(--lg, lg))); }',
    );
  });

  it('columns with fr unit', () => {
    expect(convert('cols-fr')).toBe('.cols-fr { grid-template-columns: 1fr; }');
  });

  it('columns with dvh unit', () => {
    expect(convert('cols-dvh')).toBe(
      '.cols-dvh { grid-template-columns: 100dvh; }',
    );
  });

  it('columns with multiple units', () => {
    expect(convert('cols-dvh_px_fr')).toBe(
      '.cols-dvh_px_fr { grid-template-columns: 100dvh 1px 1fr; }',
    );
  });

  it('columns with slash', () => {
    expect(convert('cols-1/2')).toBe(
      '.cols-1\\/2 { grid-template-columns: 1fr 2fr; }',
    );
  });

  it('columns with more slashes', () => {
    expect(convert('cols-1/2/1')).toBe(
      '.cols-1\\/2\\/1 { grid-template-columns: 1fr 2fr 1fr; }',
    );
  });

  it('columns with multiple slashes', () => {
    expect(convert('cols-1/2_1/4')).toBe(
      '.cols-1\\/2_1\\/4 { grid-template-columns: 50% 25%; }',
    );
  });

  it('columns with unit', () => {
    expect(convert('cols-50%')).toBe(
      '.cols-50\\% { grid-template-columns: 50%; }',
    );
  });

  it('columns with multiple units', () => {
    expect(convert('cols-50%_20px_50%')).toBe(
      '.cols-50\\%_20px_50\\% { grid-template-columns: 50% 20px 50%; }',
    );
  });

  it('columns with multiple units and spacer', () => {
    expect(convert('cols-50%_20_50%')).toBe(
      '.cols-50\\%_20_50\\% { grid-template-columns: 50% var(--cols-20, var(--space-20, calc(20rem * var(--spacer, 0.25)))) 50%; }',
    );
  });

  it('columns with complex value', () => {
    expect(convert('cols-1/2_fr_20_10_css-variable')).toBe(
      '.cols-1\\/2_fr_20_10_css-variable { grid-template-columns: 50% 1fr var(--cols-20, var(--space-20, calc(20rem * var(--spacer, 0.25)))) var(--cols-10, var(--space-10, calc(10rem * var(--spacer, 0.25)))) var(--cols-css-variable, var(--space-css-variable, var(--css-variable, css-variable))); }',
    );
  });

  it('columns with custom value', () => {
    expect(convert('cols=1fr_2fr_50%')).toBe(
      '.cols\\=1fr_2fr_50\\% { grid-template-columns: 1fr 2fr 50%; }',
    );
  });

  it('columns with custom repeat', () => {
    expect(convert('cols=repeat(auto-fit,minmax(300px,1fr))')).toBe(
      '.cols\\=repeat\\(auto-fit\\,minmax\\(300px\\,1fr\\)\\) { grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); }',
    );
  });
});

describe('grid-template-rows', () => {
  it('rows with integer', () => {
    expect(convert('rows-2')).toBe(
      '.rows-2 { grid-template-rows: repeat(var(--rows-2, 2), minmax(0, 1fr)); }',
    );
  });

  it('rows with multiple integers', () => {
    expect(convert('rows-100_150')).toBe(
      '.rows-100_150 { grid-template-rows: var(--rows-100, var(--space-100, calc(100rem * var(--spacer, 0.25)))) var(--rows-150, var(--space-150, calc(150rem * var(--spacer, 0.25)))); }',
    );
  });

  it('rows with css variable', () => {
    expect(convert('rows-lg')).toBe(
      '.rows-lg { grid-template-rows: var(--rows-lg, var(--space-lg, var(--lg, lg))); }',
    );
  });

  it('rows with fr unit', () => {
    expect(convert('rows-fr')).toBe('.rows-fr { grid-template-rows: 1fr; }');
  });

  it('rows with dvh unit', () => {
    expect(convert('rows-dvh')).toBe(
      '.rows-dvh { grid-template-rows: 100dvh; }',
    );
  });

  it('rows with multiple units', () => {
    expect(convert('rows-dvh_px_fr')).toBe(
      '.rows-dvh_px_fr { grid-template-rows: 100dvh 1px 1fr; }',
    );
  });

  it('rows with slash', () => {
    expect(convert('rows-1/2')).toBe(
      '.rows-1\\/2 { grid-template-rows: 1fr 2fr; }',
    );
  });

  it('rows with more slashes', () => {
    expect(convert('rows-1/2/1')).toBe(
      '.rows-1\\/2\\/1 { grid-template-rows: 1fr 2fr 1fr; }',
    );
  });

  it('rows with multiple slashes', () => {
    expect(convert('rows-1/2_1/4')).toBe(
      '.rows-1\\/2_1\\/4 { grid-template-rows: 50% 25%; }',
    );
  });

  it('rows with unit', () => {
    expect(convert('rows-50%')).toBe(
      '.rows-50\\% { grid-template-rows: 50%; }',
    );
  });

  it('rows with multiple units', () => {
    expect(convert('rows-50%_20px_50%')).toBe(
      '.rows-50\\%_20px_50\\% { grid-template-rows: 50% 20px 50%; }',
    );
  });

  it('rows with multiple units and spacer', () => {
    expect(convert('rows-50%_20_50%')).toBe(
      '.rows-50\\%_20_50\\% { grid-template-rows: 50% var(--rows-20, var(--space-20, calc(20rem * var(--spacer, 0.25)))) 50%; }',
    );
  });

  it('rows with complex value', () => {
    expect(convert('rows-1/2_fr_20_10_css-variable')).toBe(
      '.rows-1\\/2_fr_20_10_css-variable { grid-template-rows: 50% 1fr var(--rows-20, var(--space-20, calc(20rem * var(--spacer, 0.25)))) var(--rows-10, var(--space-10, calc(10rem * var(--spacer, 0.25)))) var(--rows-css-variable, var(--space-css-variable, var(--css-variable, css-variable))); }',
    );
  });

  it('rows with custom value', () => {
    expect(convert('rows=1fr_2fr_50%')).toBe(
      '.rows\\=1fr_2fr_50\\% { grid-template-rows: 1fr 2fr 50%; }',
    );
  });

  it('rows with custom repeat', () => {
    expect(convert('rows=repeat(auto-fit,minmax(300px,1fr))')).toBe(
      '.rows\\=repeat\\(auto-fit\\,minmax\\(300px\\,1fr\\)\\) { grid-template-rows: repeat(auto-fit,minmax(300px,1fr)); }',
    );
  });
});

describe('grid-template-areas', () => {
  it('areas with css variable', () => {
    expect(convert('areas-mobile-layout')).toBe(
      '.areas-mobile-layout { grid-template-areas: var(--areas-mobile-layout, var(--mobile-layout, mobile-layout)); }',
    );
  });

  it('areas with custom value', () => {
    expect(convert('areas=none')).toBe(
      '.areas\\=none { grid-template-areas: none; }',
    );
  });

  it('areas with custom repeat', () => {
    expect(convert('areas="header_header"_"sidebar_main"')).toBe(
      '.areas\\=\\"header_header\\"_\\"sidebar_main\\" { grid-template-areas: "header header" "sidebar main"; }',
    );
  });

  it('areas with custom repeat', () => {
    expect(convert('areas="a_b_."_"a_c_d"')).toBe(
      '.areas\\=\\"a_b_\\.\\"_\\"a_c_d\\" { grid-template-areas: "a b ." "a c d"; }',
    );
  });
});

describe('grid-column', () => {
  it('column with integer', () => {
    expect(convert('col-2')).toBe('.col-2 { grid-column: span 2 / span 2; }');
  });

  it('column with css variable', () => {
    expect(convert('col-full')).toBe(
      '.col-full { grid-column: var(--col-full, var(--full, full)); }',
    );
  });

  it('column with start and end', () => {
    expect(convert('col=2/3')).toBe('.col\\=2\\/3 { grid-column: 2/3; }');
  });

  it('column with span start', () => {
    expect(convert('col=span_2/3')).toBe(
      '.col\\=span_2\\/3 { grid-column: span 2/3; }',
    );
  });

  it('column with span end', () => {
    expect(convert('col=2/span_3')).toBe(
      '.col\\=2\\/span_3 { grid-column: 2/span 3; }',
    );
  });

  it('column with span both', () => {
    expect(convert('col=span_2/span_3')).toBe(
      '.col\\=span_2\\/span_3 { grid-column: span 2/span 3; }',
    );
  });

  it('column with custom full value', () => {
    expect(convert('col=1/-1')).toBe('.col\\=1\\/-1 { grid-column: 1/-1; }');
  });
});

describe('grid-row', () => {
  it('row with integer', () => {
    expect(convert('row-2')).toBe('.row-2 { grid-row: span 2 / span 2; }');
  });

  it('row with css variable', () => {
    expect(convert('row-full')).toBe(
      '.row-full { grid-row: var(--row-full, var(--full, full)); }',
    );
  });

  it('row with start and end', () => {
    expect(convert('row=2/3')).toBe('.row\\=2\\/3 { grid-row: 2/3; }');
  });

  it('row with span start', () => {
    expect(convert('row=span_2/3')).toBe(
      '.row\\=span_2\\/3 { grid-row: span 2/3; }',
    );
  });

  it('row with span end', () => {
    expect(convert('row=2/span_3')).toBe(
      '.row\\=2\\/span_3 { grid-row: 2/span 3; }',
    );
  });

  it('row with span both', () => {
    expect(convert('row=span_2/span_3')).toBe(
      '.row\\=span_2\\/span_3 { grid-row: span 2/span 3; }',
    );
  });

  it('row with custom full value', () => {
    expect(convert('row=1/-1')).toBe('.row\\=1\\/-1 { grid-row: 1/-1; }');
  });
});

describe('grid-area', () => {
  it('area with integer', () => {
    expect(convert('area-2')).toBe('.area-2 { grid-area: span 2 / span 2; }');
  });

  it('area with css variable', () => {
    expect(convert('area-full')).toBe(
      '.area-full { grid-area: var(--area-full, var(--full, full)); }',
    );
    expect(convert('area-top-right')).toBe(
      '.area-top-right { grid-area: var(--area-top-right, var(--top-right, top-right)); }',
    );
  });

  it('area with start and end', () => {
    expect(convert('area=2/1/2/4')).toBe(
      '.area\\=2\\/1\\/2\\/4 { grid-area: 2/1/2/4; }',
    );
  });

  it('area with span start', () => {
    expect(convert('area=span_2/3')).toBe(
      '.area\\=span_2\\/3 { grid-area: span 2/3; }',
    );
  });

  it('area with span end', () => {
    expect(convert('area=2/span_3')).toBe(
      '.area\\=2\\/span_3 { grid-area: 2/span 3; }',
    );
  });

  it('area with span both', () => {
    expect(convert('area=span_2/span_3')).toBe(
      '.area\\=span_2\\/span_3 { grid-area: span 2/span 3; }',
    );
  });

  it('area with custom named cell', () => {
    expect(convert('area=span_2/span_some-grid-area')).toBe(
      '.area\\=span_2\\/span_some-grid-area { grid-area: span 2/span some-grid-area; }',
    );
  });

  it('area with custom full value', () => {
    expect(convert('area=1/-1')).toBe('.area\\=1\\/-1 { grid-area: 1/-1; }');
  });
});
