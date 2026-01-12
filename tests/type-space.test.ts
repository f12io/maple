import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Positive Numbers', () => {
  it('padding', () => {
    expect(convert('p-4')).toBe(
      '.p-4 { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding without shortcut', () => {
    expect(convert('padding-4')).toBe(
      '.padding-4 { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding with variable', () => {
    expect(convert('p-2xs')).toBe(
      '.p-2xs { padding: var(--p-2xs, var(--space-2xs, var(--2xs, 2xs))); }',
    );
  });

  it('padding with multiple values', () => {
    expect(convert('p-4_5')).toBe(
      '.p-4_5 { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) var(--p-5, var(--space-5, calc(5rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding with multiple values and custom unit', () => {
    expect(convert('p-4_5px')).toBe(
      '.p-4_5px { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) 5px; }',
    );
  });

  it('padding important', () => {
    expect(convert('!p-4')).toBe(
      '.\\!p-4 { padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) !important; }',
    );
  });

  it('padding unsupported important', () => {
    expect(convert('p-4!')).toBe(
      '.p-4\\! { padding: var(--p-4\\!, var(--space-4\\!, var(--4\\!, 4!))); }',
    );
  });

  it('padding with unit', () => {
    expect(convert('p-4px')).toBe('.p-4px { padding: 4px; }');
  });

  it('padding with unit without shortcut', () => {
    expect(convert('padding-4px')).toBe('.padding-4px { padding: 4px; }');
  });

  it('padding with unit and important', () => {
    expect(convert('!p-4px')).toBe('.\\!p-4px { padding: 4px !important; }');
  });

  it('padding with unit and important without shortcut', () => {
    expect(convert('!padding-4px')).toBe(
      '.\\!padding-4px { padding: 4px !important; }',
    );
  });

  it('padding auto', () => {
    expect(convert('p-auto')).toBe(
      '.p-auto { padding: var(--p-auto, var(--space-auto, var(--auto, auto))); }',
    );
  });

  it('padding lg', () => {
    expect(convert('p-lg')).toBe(
      '.p-lg { padding: var(--p-lg, var(--space-lg, var(--lg, lg))); }',
    );
  });

  it('padding with 1 decimal', () => {
    expect(convert('p-4.5')).toBe(
      `.p-4\\.5 { padding: var(--p-4\\.5, var(--space-4\\.5, calc(4.5rem * var(--spacer, 0.25)))); }`,
    );
  });

  it('padding with 2 decimals', () => {
    expect(convert('p-4.25')).toBe(
      `.p-4\\.25 { padding: var(--p-4\\.25, var(--space-4\\.25, calc(4.25rem * var(--spacer, 0.25)))); }`,
    );
  });

  it('padding with fraction', () => {
    expect(convert('p-1/2')).toBe(`.p-1\\/2 { padding: 50%; }`);
  });

  it('padding 0', () => {
    expect(convert('p-0')).toBe('.p-0 { padding: 0; }');
  });

  it('padding 1', () => {
    expect(convert('p-1')).toBe(
      '.p-1 { padding: var(--p-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding 1px', () => {
    expect(convert('p-px')).toBe(`.p-px { padding: 1px; }`);
  });

  it('padding 1rem', () => {
    expect(convert('p-rem')).toBe(`.p-rem { padding: 1rem; }`);
  });

  it('padding 1em', () => {
    expect(convert('p-em')).toBe(`.p-em { padding: 1em; }`);
  });

  it('padding 100%', () => {
    expect(convert('p-%')).toBe(`.p-\\% { padding: 100%; }`);
  });

  it('padding 100% without shortcut', () => {
    expect(convert('padding-%')).toBe(`.padding-\\% { padding: 100%; }`);
  });

  it('padding 100% with number', () => {
    expect(convert('p-100%')).toBe(`.p-100\\% { padding: 100%; }`);
  });

  it('padding 100% with number and without shortcut', () => {
    expect(convert('padding-100%')).toBe(`.padding-100\\% { padding: 100%; }`);
  });

  it('padding 100vh', () => {
    expect(convert('p-vh')).toBe(`.p-vh { padding: 100vh; }`);
  });

  it('padding 100vw', () => {
    expect(convert('p-vw')).toBe(`.p-vw { padding: 100vw; }`);
  });

  it('padding 100dvh', () => {
    expect(convert('p-dvh')).toBe(`.p-dvh { padding: 100dvh; }`);
  });

  it('padding 100dvw', () => {
    expect(convert('p-dvw')).toBe(`.p-dvw { padding: 100dvw; }`);
  });

  it('padding 100svh', () => {
    expect(convert('p-svh')).toBe(`.p-svh { padding: 100svh; }`);
  });

  it('padding 100svw', () => {
    expect(convert('p-svw')).toBe(`.p-svw { padding: 100svw; }`);
  });

  it('padding 100lvh', () => {
    expect(convert('p-lvh')).toBe(`.p-lvh { padding: 100lvh; }`);
  });

  it('padding 100lvw', () => {
    expect(convert('p-lvw')).toBe(`.p-lvw { padding: 100lvw; }`);
  });

  it('padding 100cqw', () => {
    expect(convert('p-cqw')).toBe(`.p-cqw { padding: 100cqw; }`);
  });

  it('padding 100cqh', () => {
    expect(convert('p-cqh')).toBe(`.p-cqh { padding: 100cqh; }`);
  });

  it('padding 100cqi', () => {
    expect(convert('p-cqi')).toBe(`.p-cqi { padding: 100cqi; }`);
  });

  it('padding 100cqb', () => {
    expect(convert('p-cqb')).toBe(`.p-cqb { padding: 100cqb; }`);
  });

  it('padding 100cqmin', () => {
    expect(convert('p-cqmin')).toBe(`.p-cqmin { padding: 100cqmin; }`);
  });

  it('padding 100cqmax', () => {
    expect(convert('p-cqmax')).toBe(`.p-cqmax { padding: 100cqmax; }`);
  });

  it('padding x axis', () => {
    expect(convert('px-3')).toBe(
      '.px-3 { padding-inline: var(--px-3, var(--space-3, calc(3rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding y axis', () => {
    expect(convert('py-2')).toBe(
      '.py-2 { padding-block: var(--py-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-right', () => {
    expect(convert('pr-2')).toBe(
      '.pr-2 { padding-right: var(--pr-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-left', () => {
    expect(convert('pl-2')).toBe(
      '.pl-2 { padding-left: var(--pl-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-inline-start', () => {
    expect(convert('ps-2')).toBe(
      '.ps-2 { padding-inline-start: var(--ps-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-inline-end', () => {
    expect(convert('pe-2')).toBe(
      '.pe-2 { padding-inline-end: var(--pe-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-top', () => {
    expect(convert('pt-2')).toBe(
      '.pt-2 { padding-top: var(--pt-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-bottom', () => {
    expect(convert('pb-2')).toBe(
      '.pb-2 { padding-bottom: var(--pb-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-block-start', () => {
    expect(convert('pbs-2')).toBe(
      '.pbs-2 { padding-block-start: var(--pbs-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding-block-end', () => {
    expect(convert('pbe-2')).toBe(
      '.pbe-2 { padding-block-end: var(--pbe-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))); }',
    );
  });

  it('padding with multiple predefined values', () => {
    expect(convert('p-1/2_1/4_4_rem')).toBe(
      '.p-1\\/2_1\\/4_4_rem { padding: 50% 25% var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) 1rem; }',
    );
  });

  it('padding with predefined values in brackets', () => {
    expect(convert('p-[1/2_1/4_4_rem]')).toBe(
      '.p-\\[1\\/2_1\\/4_4_rem\\] { padding: 50% 25% var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) 1rem; }',
    );
  });

  it('padding with custom value', () => {
    expect(convert('p=4px')).toBe('.p\\=4px { padding: 4px; }');
  });

  it('padding with custom value and without shortcut', () => {
    expect(convert('padding=4px')).toBe('.padding\\=4px { padding: 4px; }');
  });

  it('padding with multiple custom values', () => {
    expect(convert('p=4px_2px')).toBe('.p\\=4px_2px { padding: 4px 2px; }');
  });

  it('padding with custom values in brackets', () => {
    expect(convert('p=[4px_2px]')).toBe(
      '.p\\=\\[4px_2px\\] { padding: 4px 2px; }',
    );
  });
});

describe('Positive Numbers with Multiple Property Outputs', () => {
  it('square', () => {
    expect(convert('square-4')).toBe(
      '.square-4 { width: var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25))));height: var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))); }',
    );
  });

  it('square important', () => {
    expect(convert('!square-4')).toBe(
      '.\\!square-4 { width: var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) !important;height: var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) !important; }',
    );
  });

  it('square unsupported important', () => {
    expect(convert('square-4!')).toBe(
      '.square-4\\! { width: var(--square-4\\!, var(--space-4\\!, var(--4\\!, 4!)));height: var(--square-4\\!, var(--space-4\\!, var(--4\\!, 4!))); }',
    );
  });

  it('square with unit', () => {
    expect(convert('square-4px')).toBe(
      '.square-4px { width: 4px;height: 4px; }',
    );
  });

  it('square with unit and important', () => {
    expect(convert('!square-4px')).toBe(
      '.\\!square-4px { width: 4px !important;height: 4px !important; }',
    );
  });

  it('square auto', () => {
    expect(convert('square-auto')).toBe(
      '.square-auto { width: var(--square-auto, var(--space-auto, var(--auto, auto)));height: var(--square-auto, var(--space-auto, var(--auto, auto))); }',
    );
  });

  it('square fit-content', () => {
    expect(convert('square-fit-content')).toBe(
      '.square-fit-content { width: var(--square-fit-content, var(--space-fit-content, var(--fit-content, fit-content)));height: var(--square-fit-content, var(--space-fit-content, var(--fit-content, fit-content))); }',
    );
  });

  it('square lg', () => {
    expect(convert('square-lg')).toBe(
      '.square-lg { width: var(--square-lg, var(--space-lg, var(--lg, lg)));height: var(--square-lg, var(--space-lg, var(--lg, lg))); }',
    );
  });

  it('square with 1 decimal', () => {
    expect(convert('square-4.5')).toBe(
      `.square-4\\.5 { width: var(--square-4\\.5, var(--space-4\\.5, calc(4.5rem * var(--spacer, 0.25))));height: var(--square-4\\.5, var(--space-4\\.5, calc(4.5rem * var(--spacer, 0.25)))); }`,
    );
  });

  it('square with 2 decimals', () => {
    expect(convert('square-4.25')).toBe(
      `.square-4\\.25 { width: var(--square-4\\.25, var(--space-4\\.25, calc(4.25rem * var(--spacer, 0.25))));height: var(--square-4\\.25, var(--space-4\\.25, calc(4.25rem * var(--spacer, 0.25)))); }`,
    );
  });

  it('square with fraction', () => {
    expect(convert('square-1/2')).toBe(
      `.square-1\\/2 { width: 50%;height: 50%; }`,
    );
  });

  it('square 0', () => {
    expect(convert('square-0')).toBe('.square-0 { width: 0;height: 0; }');
  });

  it('square 1', () => {
    expect(convert('square-1')).toBe(
      '.square-1 { width: var(--square-1, var(--space-1, calc(1rem * var(--spacer, 0.25))));height: var(--square-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))); }',
    );
  });

  it('square 1px', () => {
    expect(convert('square-px')).toBe(`.square-px { width: 1px;height: 1px; }`);
  });

  it('square 1rem', () => {
    expect(convert('square-rem')).toBe(
      `.square-rem { width: 1rem;height: 1rem; }`,
    );
  });

  it('square 1em', () => {
    expect(convert('square-em')).toBe(`.square-em { width: 1em;height: 1em; }`);
  });

  it('square 100%', () => {
    expect(convert('square-%')).toBe(
      `.square-\\% { width: 100%;height: 100%; }`,
    );
  });

  it('square 100vh', () => {
    expect(convert('square-vh')).toBe(
      `.square-vh { width: 100vh;height: 100vh; }`,
    );
  });

  it('square 100vw', () => {
    expect(convert('square-vw')).toBe(
      `.square-vw { width: 100vw;height: 100vw; }`,
    );
  });

  it('square 100dvh', () => {
    expect(convert('square-dvh')).toBe(
      `.square-dvh { width: 100dvh;height: 100dvh; }`,
    );
  });

  it('square 100dvw', () => {
    expect(convert('square-dvw')).toBe(
      `.square-dvw { width: 100dvw;height: 100dvw; }`,
    );
  });

  it('square 100svh', () => {
    expect(convert('square-svh')).toBe(
      `.square-svh { width: 100svh;height: 100svh; }`,
    );
  });

  it('square 100svw', () => {
    expect(convert('square-svw')).toBe(
      `.square-svw { width: 100svw;height: 100svw; }`,
    );
  });

  it('square 100lvh', () => {
    expect(convert('square-lvh')).toBe(
      `.square-lvh { width: 100lvh;height: 100lvh; }`,
    );
  });

  it('square 100lvw', () => {
    expect(convert('square-lvw')).toBe(
      `.square-lvw { width: 100lvw;height: 100lvw; }`,
    );
  });

  it('square 100cqw', () => {
    expect(convert('square-cqw')).toBe(
      `.square-cqw { width: 100cqw;height: 100cqw; }`,
    );
  });

  it('square 100cqh', () => {
    expect(convert('square-cqh')).toBe(
      `.square-cqh { width: 100cqh;height: 100cqh; }`,
    );
  });

  it('square 100cqi', () => {
    expect(convert('square-cqi')).toBe(
      `.square-cqi { width: 100cqi;height: 100cqi; }`,
    );
  });

  it('square 100cqb', () => {
    expect(convert('square-cqb')).toBe(
      `.square-cqb { width: 100cqb;height: 100cqb; }`,
    );
  });

  it('square 100cqmin', () => {
    expect(convert('square-cqmin')).toBe(
      `.square-cqmin { width: 100cqmin;height: 100cqmin; }`,
    );
  });

  it('square 100cqmax', () => {
    expect(convert('square-cqmax')).toBe(
      `.square-cqmax { width: 100cqmax;height: 100cqmax; }`,
    );
  });

  it('square with predefined value in brackets', () => {
    expect(convert('square-[1/2]')).toBe(
      '.square-\\[1\\/2\\] { width: 50%;height: 50%; }',
    );
  });

  it('square with custom value', () => {
    expect(convert('square=4px')).toBe(
      '.square\\=4px { width: 4px;height: 4px; }',
    );
    expect(convert('square=auto')).toBe(
      '.square\\=auto { width: auto;height: auto; }',
    );
  });

  it('square with custom values in brackets', () => {
    expect(convert('square=[4px]')).toBe(
      '.square\\=\\[4px\\] { width: 4px;height: 4px; }',
    );
  });
});

describe('Negative Numbers', () => {
  it('margin', () => {
    expect(convert('-m-4')).toBe(
      '.-m-4 { margin: calc(var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin negative value', () => {
    expect(convert('m--4')).toBe(
      '.m--4 { margin: var(--m--4, var(--space--4, calc(-4rem * var(--spacer, 0.25)))); }',
    );
  });

  it('margin with variable', () => {
    expect(convert('-m-2xs')).toBe(
      '.-m-2xs { margin: calc(var(--m-2xs, var(--space-2xs, var(--2xs, 2xs))) * -1); }',
    );
  });

  it('margin with multiple values', () => {
    expect(convert('m--4_-5')).toBe(
      '.m--4_-5 { margin: var(--m--4, var(--space--4, calc(-4rem * var(--spacer, 0.25)))) var(--m--5, var(--space--5, calc(-5rem * var(--spacer, 0.25)))); }',
    );
  });

  it('margin with multiple values and custom unit', () => {
    expect(convert('m--4_-5px')).toBe(
      '.m--4_-5px { margin: var(--m--4, var(--space--4, calc(-4rem * var(--spacer, 0.25)))) -5px; }',
    );
  });

  it('margin without shortcut', () => {
    expect(convert('-margin-4')).toBe(
      '.-margin-4 { margin: calc(var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin important', () => {
    expect(convert('!-m-4')).toBe(
      '.\\!-m-4 { margin: calc(var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1) !important; }',
    );
  });

  it('margin unsupported important', () => {
    expect(convert('-m-4!')).toBe(
      '.-m-4\\! { margin: calc(var(--m-4\\!, var(--space-4\\!, var(--4\\!, 4!))) * -1); }',
    );
  });

  it('margin with unit', () => {
    expect(convert('-m-4px')).toBe('.-m-4px { margin: -4px; }');
  });

  it('margin with unit without shortcut', () => {
    expect(convert('-margin-4px')).toBe('.-margin-4px { margin: -4px; }');
  });

  it('margin with unit and important', () => {
    expect(convert('!-m-4px')).toBe('.\\!-m-4px { margin: -4px !important; }');
  });

  it('margin with unit and important without shortcut', () => {
    expect(convert('!-margin-4px')).toBe(
      '.\\!-margin-4px { margin: -4px !important; }',
    );
  });

  it('margin auto', () => {
    expect(convert('-m-auto')).toBe(
      '.-m-auto { margin: calc(var(--m-auto, var(--space-auto, var(--auto, auto))) * -1); }',
    );
  });

  it('margin lg', () => {
    expect(convert('-m-lg')).toBe(
      '.-m-lg { margin: calc(var(--m-lg, var(--space-lg, var(--lg, lg))) * -1); }',
    );
  });

  it('margin with 1 decimal', () => {
    expect(convert('-m-4.5')).toBe(
      `.-m-4\\.5 { margin: calc(var(--m-4\\.5, var(--space-4\\.5, calc(4.5rem * var(--spacer, 0.25)))) * -1); }`,
    );
  });

  it('margin with 2 decimals', () => {
    expect(convert('-m-4.25')).toBe(
      `.-m-4\\.25 { margin: calc(var(--m-4\\.25, var(--space-4\\.25, calc(4.25rem * var(--spacer, 0.25)))) * -1); }`,
    );
  });

  it('margin with fraction', () => {
    expect(convert('-m-1/2')).toBe(`.-m-1\\/2 { margin: -50%; }`);
  });

  it('margin 0', () => {
    expect(convert('-m-0')).toBe('.-m-0 { margin: 0; }');
  });

  it('margin 1', () => {
    expect(convert('-m-1')).toBe(
      '.-m-1 { margin: calc(var(--m-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin 1px', () => {
    expect(convert('-m-px')).toBe(`.-m-px { margin: -1px; }`);
  });

  it('margin 1rem', () => {
    expect(convert('-m-rem')).toBe(`.-m-rem { margin: -1rem; }`);
  });

  it('margin 1em', () => {
    expect(convert('-m-em')).toBe(`.-m-em { margin: -1em; }`);
  });

  it('margin 100%', () => {
    expect(convert('-m-%')).toBe(`.-m-\\% { margin: -100%; }`);
  });

  it('margin 100% without shortcut', () => {
    expect(convert('-margin-%')).toBe(`.-margin-\\% { margin: -100%; }`);
  });

  it('margin 100% with number', () => {
    expect(convert('-m-100%')).toBe(`.-m-100\\% { margin: -100%; }`);
  });

  it('margin 100% with number and without shortcut', () => {
    expect(convert('-margin-100%')).toBe(`.-margin-100\\% { margin: -100%; }`);
  });

  it('margin with negative unit', () => {
    expect(convert('m--%')).toBe(`.m--\\% { margin: -100%; }`);
  });

  it('margin 100% with negative number', () => {
    expect(convert('m--100%')).toBe(`.m--100\\% { margin: -100%; }`);
  });

  it('margin 100% with negative number and without shortcut', () => {
    expect(convert('margin--100%')).toBe(`.margin--100\\% { margin: -100%; }`);
  });

  it('margin 100vh', () => {
    expect(convert('-m-vh')).toBe(`.-m-vh { margin: -100vh; }`);
  });

  it('margin 100vw', () => {
    expect(convert('-m-vw')).toBe(`.-m-vw { margin: -100vw; }`);
  });

  it('margin 100dvh', () => {
    expect(convert('-m-dvh')).toBe(`.-m-dvh { margin: -100dvh; }`);
  });

  it('margin 100dvw', () => {
    expect(convert('-m-dvw')).toBe(`.-m-dvw { margin: -100dvw; }`);
  });

  it('margin 100svh', () => {
    expect(convert('-m-svh')).toBe(`.-m-svh { margin: -100svh; }`);
  });

  it('margin 100svw', () => {
    expect(convert('-m-svw')).toBe(`.-m-svw { margin: -100svw; }`);
  });

  it('margin 100lvh', () => {
    expect(convert('-m-lvh')).toBe(`.-m-lvh { margin: -100lvh; }`);
  });

  it('margin 100lvw', () => {
    expect(convert('-m-lvw')).toBe(`.-m-lvw { margin: -100lvw; }`);
  });

  it('margin 100cqw', () => {
    expect(convert('-m-cqw')).toBe(`.-m-cqw { margin: -100cqw; }`);
  });

  it('margin 100cqh', () => {
    expect(convert('-m-cqh')).toBe(`.-m-cqh { margin: -100cqh; }`);
  });

  it('margin 100cqi', () => {
    expect(convert('-m-cqi')).toBe(`.-m-cqi { margin: -100cqi; }`);
  });

  it('margin 100cqb', () => {
    expect(convert('-m-cqb')).toBe(`.-m-cqb { margin: -100cqb; }`);
  });

  it('margin 100cqmin', () => {
    expect(convert('-m-cqmin')).toBe(`.-m-cqmin { margin: -100cqmin; }`);
  });

  it('margin 100cqmax', () => {
    expect(convert('-m-cqmax')).toBe(`.-m-cqmax { margin: -100cqmax; }`);
  });

  it('margin x axis', () => {
    expect(convert('-mx-3')).toBe(
      '.-mx-3 { margin-inline: calc(var(--mx-3, var(--space-3, calc(3rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin y axis', () => {
    expect(convert('-my-2')).toBe(
      '.-my-2 { margin-block: calc(var(--my-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-right', () => {
    expect(convert('-mr-2')).toBe(
      '.-mr-2 { margin-right: calc(var(--mr-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-left', () => {
    expect(convert('-ml-2')).toBe(
      '.-ml-2 { margin-left: calc(var(--ml-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-inline-start', () => {
    expect(convert('-ms-2')).toBe(
      '.-ms-2 { margin-inline-start: calc(var(--ms-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-inline-end', () => {
    expect(convert('-me-2')).toBe(
      '.-me-2 { margin-inline-end: calc(var(--me-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-top', () => {
    expect(convert('-mt-2')).toBe(
      '.-mt-2 { margin-top: calc(var(--mt-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-bottom', () => {
    expect(convert('-mb-2')).toBe(
      '.-mb-2 { margin-bottom: calc(var(--mb-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-block-start', () => {
    expect(convert('-mbs-2')).toBe(
      '.-mbs-2 { margin-block-start: calc(var(--mbs-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin-block-end', () => {
    expect(convert('-mbe-2')).toBe(
      '.-mbe-2 { margin-block-end: calc(var(--mbe-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('margin with multiple predefined values', () => {
    expect(convert('-m-1/2_1/4_4_rem')).toBe(
      '.-m-1\\/2_1\\/4_4_rem { margin: -50% -25% calc(var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1) -1rem; }',
    );
  });

  it('margin with predefined values in brackets', () => {
    expect(convert('-m-[1/2_1/4_4_rem]')).toBe(
      '.-m-\\[1\\/2_1\\/4_4_rem\\] { margin: -50% -25% calc(var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1) -1rem; }',
    );
  });

  it('margin with custom value', () => {
    expect(convert('m=-4px')).toBe('.m\\=-4px { margin: -4px; }');
  });

  it('margin with custom value and without shortcut', () => {
    expect(convert('margin=-4px')).toBe('.margin\\=-4px { margin: -4px; }');
  });

  it('margin with multiple custom values', () => {
    expect(convert('m=-4px_-2px')).toBe(
      '.m\\=-4px_-2px { margin: -4px -2px; }',
    );
  });

  it('margin with custom values in brackets', () => {
    expect(convert('m=[-4px_-2px]')).toBe(
      '.m\\=\\[-4px_-2px\\] { margin: -4px -2px; }',
    );
  });

  it('margin with wrong custom value syntax', () => {
    expect(convert('-m=4px')).toBe('.-m\\=4px { -m: 4px; }');
  });

  it('margin with wrong multiple custom values syntax', () => {
    expect(convert('-m=4px_2px')).toBe('.-m\\=4px_2px { -m: 4px 2px; }');
  });

  it('margin with wrong custom values in brackets syntax', () => {
    expect(convert('-m=[4px_2px]')).toBe(
      '.-m\\=\\[4px_2px\\] { -m: 4px 2px; }',
    );
  });
});

/**
 * Using negative syntax with "square" is actually invalid, but from testing
 * perspective we still expect to see invalid results. The reason we use "square"
 * in this test is that currently we support multiple property outputs for
 * only width and height.
 */
describe('Negative Numbers with Multiple Property Outputs', () => {
  it('square', () => {
    expect(convert('-square-4')).toBe(
      '.-square-4 { width: calc(var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1);height: calc(var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('square with negative value', () => {
    expect(convert('square--4')).toBe(
      '.square--4 { width: var(--square--4, var(--space--4, calc(-4rem * var(--spacer, 0.25))));height: var(--square--4, var(--space--4, calc(-4rem * var(--spacer, 0.25)))); }',
    );
  });

  it('square important', () => {
    expect(convert('!-square-4')).toBe(
      '.\\!-square-4 { width: calc(var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1) !important;height: calc(var(--square-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1) !important; }',
    );
  });

  it('square unsupported important', () => {
    expect(convert('-square-4!')).toBe(
      '.-square-4\\! { width: calc(var(--square-4\\!, var(--space-4\\!, var(--4\\!, 4!))) * -1);height: calc(var(--square-4\\!, var(--space-4\\!, var(--4\\!, 4!))) * -1); }',
    );
  });

  it('square with unit', () => {
    expect(convert('-square-4px')).toBe(
      '.-square-4px { width: -4px;height: -4px; }',
    );
  });

  it('square with unit and important', () => {
    expect(convert('!-square-4px')).toBe(
      '.\\!-square-4px { width: -4px !important;height: -4px !important; }',
    );
  });

  it('square auto', () => {
    expect(convert('-square-auto')).toBe(
      '.-square-auto { width: calc(var(--square-auto, var(--space-auto, var(--auto, auto))) * -1);height: calc(var(--square-auto, var(--space-auto, var(--auto, auto))) * -1); }',
    );
  });

  it('square fit-content', () => {
    expect(convert('-square-fit-content')).toBe(
      '.-square-fit-content { width: calc(var(--square-fit-content, var(--space-fit-content, var(--fit-content, fit-content))) * -1);height: calc(var(--square-fit-content, var(--space-fit-content, var(--fit-content, fit-content))) * -1); }',
    );
  });

  it('square lg', () => {
    expect(convert('-square-lg')).toBe(
      '.-square-lg { width: calc(var(--square-lg, var(--space-lg, var(--lg, lg))) * -1);height: calc(var(--square-lg, var(--space-lg, var(--lg, lg))) * -1); }',
    );
  });

  it('square with 1 decimal', () => {
    expect(convert('-square-4.5')).toBe(
      `.-square-4\\.5 { width: calc(var(--square-4\\.5, var(--space-4\\.5, calc(4.5rem * var(--spacer, 0.25)))) * -1);height: calc(var(--square-4\\.5, var(--space-4\\.5, calc(4.5rem * var(--spacer, 0.25)))) * -1); }`,
    );
  });

  it('square with 2 decimals', () => {
    expect(convert('-square-4.25')).toBe(
      `.-square-4\\.25 { width: calc(var(--square-4\\.25, var(--space-4\\.25, calc(4.25rem * var(--spacer, 0.25)))) * -1);height: calc(var(--square-4\\.25, var(--space-4\\.25, calc(4.25rem * var(--spacer, 0.25)))) * -1); }`,
    );
  });

  it('square with fraction', () => {
    expect(convert('-square-1/2')).toBe(
      `.-square-1\\/2 { width: -50%;height: -50%; }`,
    );
  });

  it('square 0', () => {
    expect(convert('-square-0')).toBe('.-square-0 { width: 0;height: 0; }');
  });

  it('square 1', () => {
    expect(convert('-square-1')).toBe(
      '.-square-1 { width: calc(var(--square-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))) * -1);height: calc(var(--square-1, var(--space-1, calc(1rem * var(--spacer, 0.25)))) * -1); }',
    );
  });

  it('square 1px', () => {
    expect(convert('-square-px')).toBe(
      `.-square-px { width: -1px;height: -1px; }`,
    );
  });

  it('square 1rem', () => {
    expect(convert('-square-rem')).toBe(
      `.-square-rem { width: -1rem;height: -1rem; }`,
    );
  });

  it('square 1em', () => {
    expect(convert('-square-em')).toBe(
      `.-square-em { width: -1em;height: -1em; }`,
    );
  });

  it('square 100%', () => {
    expect(convert('-square-%')).toBe(
      `.-square-\\% { width: -100%;height: -100%; }`,
    );
  });

  it('square 100vh', () => {
    expect(convert('-square-vh')).toBe(
      `.-square-vh { width: -100vh;height: -100vh; }`,
    );
  });

  it('square 100vw', () => {
    expect(convert('-square-vw')).toBe(
      `.-square-vw { width: -100vw;height: -100vw; }`,
    );
  });

  it('square 100dvh', () => {
    expect(convert('-square-dvh')).toBe(
      `.-square-dvh { width: -100dvh;height: -100dvh; }`,
    );
  });

  it('square 100dvw', () => {
    expect(convert('-square-dvw')).toBe(
      `.-square-dvw { width: -100dvw;height: -100dvw; }`,
    );
  });

  it('square 100svh', () => {
    expect(convert('-square-svh')).toBe(
      `.-square-svh { width: -100svh;height: -100svh; }`,
    );
  });

  it('square 100svw', () => {
    expect(convert('-square-svw')).toBe(
      `.-square-svw { width: -100svw;height: -100svw; }`,
    );
  });

  it('square 100lvh', () => {
    expect(convert('-square-lvh')).toBe(
      `.-square-lvh { width: -100lvh;height: -100lvh; }`,
    );
  });

  it('square 100lvw', () => {
    expect(convert('-square-lvw')).toBe(
      `.-square-lvw { width: -100lvw;height: -100lvw; }`,
    );
  });

  it('square 100cqw', () => {
    expect(convert('-square-cqw')).toBe(
      `.-square-cqw { width: -100cqw;height: -100cqw; }`,
    );
  });

  it('square 100cqh', () => {
    expect(convert('-square-cqh')).toBe(
      `.-square-cqh { width: -100cqh;height: -100cqh; }`,
    );
  });

  it('square 100cqi', () => {
    expect(convert('-square-cqi')).toBe(
      `.-square-cqi { width: -100cqi;height: -100cqi; }`,
    );
  });

  it('square 100cqb', () => {
    expect(convert('-square-cqb')).toBe(
      `.-square-cqb { width: -100cqb;height: -100cqb; }`,
    );
  });

  it('square 100cqmin', () => {
    expect(convert('-square-cqmin')).toBe(
      `.-square-cqmin { width: -100cqmin;height: -100cqmin; }`,
    );
  });

  it('square 100cqmax', () => {
    expect(convert('-square-cqmax')).toBe(
      `.-square-cqmax { width: -100cqmax;height: -100cqmax; }`,
    );
  });

  it('square with predefined value in brackets', () => {
    expect(convert('-square-[1/2]')).toBe(
      `.-square-\\[1\\/2\\] { width: -50%;height: -50%; }`,
    );
  });

  it('square with custom value', () => {
    expect(convert('square=-4px')).toBe(
      '.square\\=-4px { width: -4px;height: -4px; }',
    );
  });

  it('square with custom value in brackets', () => {
    expect(convert('square=[-4px]')).toBe(
      '.square\\=\\[-4px\\] { width: -4px;height: -4px; }',
    );
  });

  it('square with wrong custom value', () => {
    expect(convert('-square=4px')).toBe('.-square\\=4px { -square: 4px; }');
    expect(convert('-square=auto')).toBe('.-square\\=auto { -square: auto; }');
  });

  it('square with wrong custom values in brackets', () => {
    expect(convert('-square=[4px]')).toBe(
      '.-square\\=\\[4px\\] { -square: 4px; }',
    );
  });
});
