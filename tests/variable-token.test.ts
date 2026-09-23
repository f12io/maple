import { afterEach, describe, expect, it } from 'vitest';
import { collectAliases } from '../src/core/aliases';
import { convert, convertWithRefs } from '../src/core/helpers/convert.helper';
import { parseClass } from '../src/core/parser-class';

const SPACER = 'var(--spacer, 0.25)';
const F_SPACER = (key: string) =>
  `var(--${key}-spacer, var(--f-spacer, ${SPACER}))`;
const BR_SPACER = (key: string) =>
  `var(--${key}-spacer, var(--br-spacer, ${SPACER}))`;
const SHADOW_SPACER = `var(--bshadow-spacer, var(--shadow-spacer, ${SPACER}))`;

/** The tone formula the engine emits, with `p` in the position slot */
function tone(prefix: string, name: string, p: string, alpha: string) {
  const chain = (key: string, def: number) =>
    `var(--${prefix}-${name}-${key}, var(--${name}-${key}, var(--${prefix}-${key}, var(--${key}, ${def}))))`;
  const mid = `pow(abs(${p} - 0.5) * 2, 2)`;

  return (
    `calc((l + (((${chain('l-shift', 1)} * (0.5 - ${p})) + (abs(${chain('l-shift', 1)}) * (0.5 - l))) * ` +
    `calc(var(--l-edge-shift, 0.5) + ((1 - var(--l-edge-shift, 0.5)) * ${mid})))) * ${chain('l-scale', 1)}) ` +
    `calc(c * calc(1 - (${mid} * var(--c-curve, 0.5))) * ${chain('c-scale', 1)}) ` +
    `calc(h + ${chain('h-rotate', 0)}) / ${alpha})`
  );
}

const VAR_TONE = (name: string) => `((var(--${name}, 500) - 50) / 900)`;

describe('Variable tokens: number slot', () => {
  it('single factor emits the spacer chain with the variable as factor', () => {
    expect(convert('fs-$display')).toBe(
      `.fs-\\$display { font-size: calc(var(--display) * 1rem * ${F_SPACER('fs')}); }`,
    );
    expect(convert('lh-$display')).toBe(
      `.lh-\\$display { line-height: calc(var(--display) * 1rem * ${F_SPACER('lh')}); }`,
    );
    expect(convert('ls-$display')).toBe(
      `.ls-\\$display { letter-spacing: calc(var(--display) * 1rem * ${F_SPACER('ls')}); }`,
    );
  });

  it('uses the category chain of the property', () => {
    expect(convert('rad-$card')).toBe(
      `.rad-\\$card { border-radius: calc(var(--card) * 1rem * ${BR_SPACER('rad')}); }`,
    );
    expect(convert('brw-$stroke')).toBe(
      `.brw-\\$stroke { border-width: calc(var(--stroke) * 1rem * ${BR_SPACER('brw')}); }`,
    );
    expect(convert('p-$inset')).toBe(
      `.p-\\$inset { padding: calc(var(--inset) * 1rem * var(--p-spacer, ${SPACER})); }`,
    );
    expect(convert('g-$gap')).toBe(
      `.g-\\$gap { gap: calc(var(--gap) * 1rem * var(--g-spacer, ${SPACER})); }`,
    );
    expect(convert('w-$w')).toBe(
      `.w-\\$w { width: calc(var(--w) * 1rem * var(--w-spacer, var(--size-spacer, ${SPACER}))); }`,
    );
  });

  it('does not add the literal leading fallbacks (--fs-11, --space-11)', () => {
    expect(convert('fs-$s')).not.toContain('--fs-\\$s');
    expect(convert('fs-$s')).not.toContain('--space-');
  });

  it('accepts several factors in a multi-value token', () => {
    expect(convert('p-$x_$y')).toBe(
      `.p-\\$x_\\$y { padding: calc(var(--x) * 1rem * var(--p-spacer, ${SPACER})) calc(var(--y) * 1rem * var(--p-spacer, ${SPACER})); }`,
    );
    expect(convert('p-$x_4')).toBe(
      `.p-\\$x_4 { padding: calc(var(--x) * 1rem * var(--p-spacer, ${SPACER})) var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, ${SPACER})))); }`,
    );
  });

  it('negates with the - prefix as it does for literals', () => {
    expect(convert('-ls-$t')).toBe(
      `.-ls-\\$t { letter-spacing: calc(calc(var(--t) * 1rem * ${F_SPACER('ls')}) * -1); }`,
    );
    expect(convert('-m-$x')).toBe(
      `.-m-\\$x { margin: calc(calc(var(--x) * 1rem * var(--m-spacer, ${SPACER})) * -1); }`,
    );
  });

  it('has no fallback: an undefined factor drops the declaration', () => {
    expect(convert('fs-$s')).not.toContain('var(--s,');
  });

  it('uses the unit of the property for non-spacing numbers', () => {
    expect(convert('tsdur-$d')).toBe(
      '.tsdur-\\$d { transition-duration: calc(var(--d) * 1ms); }',
    );
    expect(convert('rot-$r')).toContain(
      '--tf-rot: rotate(calc(var(--r) * 1deg));',
    );
    expect(convert('scale-$k')).toContain('--tf-scale: scale(var(--k));');
  });

  it('works inside filters and transforms', () => {
    expect(convert('blur-$b')).toContain(
      `--filter-blur: blur(calc(var(--b) * 1rem * var(--blur-spacer, ${SPACER})));`,
    );
    expect(convert('tlx-$x')).toContain(
      `--tf-tlx: translateX(calc(var(--x) * 1rem * var(--tlx-spacer, ${SPACER})));`,
    );
  });
});

describe('Sums: a+b in a number slot', () => {
  it('magnitude + plain token: the canonical themed stroke', () => {
    expect(convert('brw-$stroke+stroke-px')).toBe(
      `.brw-\\$stroke\\+stroke-px { border-width: calc(var(--stroke) * 1rem * ${BR_SPACER('brw')} + var(--brw-stroke-px, var(--space-stroke-px, var(--stroke-px, stroke-px)))); }`,
    );
  });

  it('each side resolves exactly as it would alone', () => {
    // magnitude + literal unit shorthand
    expect(convert('brw-$a+px')).toBe(
      `.brw-\\$a\\+px { border-width: calc(var(--a) * 1rem * ${BR_SPACER('brw')} + 1px); }`,
    );
    // literal + literal
    expect(convert('brw-2+px')).toBe(
      `.brw-2\\+px { border-width: calc(var(--brw-2, var(--space-2, calc(2rem * ${BR_SPACER('brw')}))) + 1px); }`,
    );
    // two magnitudes: both scaled, no special case
    expect(convert('brw-$a+$b')).toBe(
      `.brw-\\$a\\+\\$b { border-width: calc(var(--a) * 1rem * ${BR_SPACER('brw')} + var(--b) * 1rem * ${BR_SPACER('brw')}); }`,
    );
    // plain tokens only
    expect(convert('brw-a+b')).toBe(
      '.brw-a\\+b { border-width: calc(var(--brw-a, var(--space-a, var(--a, a))) + var(--brw-b, var(--space-b, var(--b, b)))); }',
    );
  });

  it('subtracts with a negative value, - stays a sign', () => {
    expect(convert('h-100vh+-4')).toBe(
      `.h-100vh\\+-4 { height: calc(100vh + var(--h--4, var(--space--4, calc(-4rem * var(--h-spacer, var(--size-spacer, ${SPACER})))))); }`,
    );
    // a magnitude can be negated the same way
    expect(convert('brw-$a+-$b')).toBe(
      `.brw-\\$a\\+-\\$b { border-width: calc(var(--a) * 1rem * ${BR_SPACER('brw')} + calc(var(--b) * 1rem * ${BR_SPACER('brw')}) * -1); }`,
    );
    expect(convert('m--$x')).toBe(
      `.m--\\$x { margin: calc(calc(var(--x) * 1rem * var(--m-spacer, ${SPACER})) * -1); }`,
    );
    // prefix and inline negatives cancel, as they do for literals
    expect(convert('-m--$x')).toBe(
      `.-m--\\$x { margin: calc(var(--x) * 1rem * var(--m-spacer, ${SPACER})); }`,
    );
  });

  it('takes more than two terms and the - prefix', () => {
    expect(convert('brw-$a+px+2')).toBe(
      `.brw-\\$a\\+px\\+2 { border-width: calc(var(--a) * 1rem * ${BR_SPACER('brw')} + 1px + var(--brw-2, var(--space-2, calc(2rem * ${BR_SPACER('brw')})))); }`,
    );
    expect(convert('-m-$a+b')).toBe(
      `.-m-\\$a\\+b { margin: calc(calc(var(--a) * 1rem * var(--m-spacer, ${SPACER}) + var(--m-b, var(--space-b, var(--b, b)))) * -1); }`,
    );
  });

  it('uses the unit of the property on every side', () => {
    expect(convert('tsdur-$d+$e')).toBe(
      '.tsdur-\\$d\\+\\$e { transition-duration: calc(var(--d) * 1ms + var(--e) * 1ms); }',
    );
    expect(convert('tsdur-$d+100')).toBe(
      '.tsdur-\\$d\\+100 { transition-duration: calc(var(--d) * 1ms + var(--tsdur-100, var(--time-100, 100ms))); }',
    );
  });

  it('is one value item: _ and , split before +', () => {
    expect(convert('p-$x+px_4')).toBe(
      `.p-\\$x\\+px_4 { padding: calc(var(--x) * 1rem * var(--p-spacer, ${SPACER}) + 1px) var(--p-4, var(--space-4, calc(4rem * var(--p-spacer, ${SPACER})))); }`,
    );
  });

  it('an empty side is not a sum', () => {
    expect(convert('brw-+px')).toBe(
      '.brw-\\+px { border-width: var(--brw-\\+px, var(--space-\\+px, var(--\\+px, +px))); }',
    );
    expect(convert('brw-$a+')).toBe(
      '.brw-\\$a\\+ { border-width: var(--brw-\\$a\\+, var(--space-\\$a\\+, var(--\\$a\\+, $a+))); }',
    );
  });
});

describe('Variable tokens: colour slot', () => {
  it('variable tone emits the tone formula with the position from the variable', () => {
    expect(convert('c-body-$tone-stroke')).toBe(
      `.c-body-\\$tone-stroke { color: oklch(from var(--c-body, var(--color-body, var(--body, body))) ${tone('c', 'body', VAR_TONE('tone-stroke'), 'alpha')}; }`,
    );
    expect(convert('brc-red-$t')).toBe(
      `.brc-red-\\$t { border-color: oklch(from var(--brc-red, var(--color-red, var(--red, red))) ${tone('brc', 'red', VAR_TONE('t'), 'alpha')}; }`,
    );
  });

  it('keeps the literal position rounded and the variable position unrounded', () => {
    expect(convert('c-body-900')).toContain('(0.5 - 0.9444)');
    expect(convert('c-body-$t')).toContain(
      '(0.5 - ((var(--t, 500) - 50) / 900))',
    );
    expect(convert('c-body-$t')).not.toContain('round(');
  });

  it('variable alpha multiplies the variable by 1%', () => {
    expect(convert('bgc-red-700/$a')).toBe(
      `.bgc-red-700\\/\\$a { background-color: oklch(from var(--bgc-red, var(--color-red, var(--red, red))) ${tone('bgc', 'red', '0.7222', 'calc(var(--a, 100) * 1%)')}; }`,
    );
  });

  it('variable tone and alpha combine, and mix with literals', () => {
    expect(convert('bgc-body-$tone-elev/$alpha-elev')).toBe(
      `.bgc-body-\\$tone-elev\\/\\$alpha-elev { background-color: oklch(from var(--bgc-body, var(--color-body, var(--body, body))) ${tone('bgc', 'body', VAR_TONE('tone-elev'), 'calc(var(--alpha-elev, 100) * 1%)')}; }`,
    );
    expect(convert('c-body-$t/60')).toContain('/ 60%)');
  });

  it('keeps the property-prefixed override chains', () => {
    const css = convert('bgc-body-$t') ?? '';

    expect(css).toContain(
      'var(--bgc-body-l-shift, var(--body-l-shift, var(--bgc-l-shift, var(--l-shift, 1))))',
    );
    expect(css).toContain(
      'var(--bgc-body-l-scale, var(--body-l-scale, var(--bgc-l-scale, var(--l-scale, 1))))',
    );
    expect(css).toContain(
      'var(--bgc-body-h-rotate, var(--body-h-rotate, var(--bgc-h-rotate, var(--h-rotate, 0))))',
    );
  });

  it('works for gradient stops', () => {
    const css = convert('bg-linear|to_right|red-$t|blue-$t_$p') ?? '';

    expect(css).toContain(`(0.5 - ${VAR_TONE('t')})`);
    expect(css).toContain(
      `calc(var(--p) * 1rem * var(--stop-spacer, var(--bg-spacer, ${SPACER})))`,
    );
  });
});

describe('Variable tokens: shadows and multi-value serializers', () => {
  it('shadow numeric slots use the bshadow spacer chain, the colour slot uses form A', () => {
    expect(
      convert(
        'bshadow-$elev-x_$elev-y_$elev-blur_0_body-$tone-elev/$alpha-elev',
      ),
    ).toBe(
      `.bshadow-\\$elev-x_\\$elev-y_\\$elev-blur_0_body-\\$tone-elev\\/\\$alpha-elev { box-shadow: ` +
        `calc(var(--elev-x) * 1rem * ${SHADOW_SPACER}) calc(var(--elev-y) * 1rem * ${SHADOW_SPACER}) calc(var(--elev-blur) * 1rem * ${SHADOW_SPACER}) 0 ` +
        `oklch(from var(--bshadow-body, var(--shadow-body, var(--color-body, var(--body, body)))) ${tone('bshadow', 'body', VAR_TONE('tone-elev'), 'calc(var(--alpha-elev, 100) * 1%)')}; }`,
    );
  });

  it('sums are accepted in shadow, border and filter slots', () => {
    expect(convert('tshadow-$x+px_0')).toBe(
      `.tshadow-\\$x\\+px_0 { text-shadow: calc(var(--x) * 1rem * var(--tshadow-spacer, var(--shadow-spacer, ${SPACER})) + 1px) 0; }`,
    );
    expect(convert('br-$w+w-px_solid_red')).toContain(
      `border: calc(var(--w) * 1rem * var(--br-spacer, ${SPACER}) + var(--br-w-px, var(--space-w-px, var(--w-px, w-px)))) solid`,
    );
    expect(convert('blur-$b+px')).toContain(
      `--filter-blur: blur(calc(var(--b) * 1rem * var(--blur-spacer, ${SPACER}) + 1px));`,
    );
  });

  it('border shorthand accepts a variable width and a variable tone', () => {
    expect(convert('br-$w_solid_red-$t')).toBe(
      `.br-\\$w_solid_red-\\$t { border: calc(var(--w) * 1rem * var(--br-spacer, ${SPACER})) solid oklch(from var(--br-red, var(--color-red, var(--red, red))) ${tone('br', 'red', VAR_TONE('t'), 'alpha')}; }`,
    );
  });
});

describe('Variable tokens: refs mode', () => {
  it('always generates the full chain and never a --ref- variable', () => {
    for (const cls of [
      'c-body-$t',
      'bgc-red-700/$a',
      'fs-$s',
      'brw-$stroke+stroke-px',
      'p-2+px',
      'bshadow-$x_$y_0_0_body-$t',
    ]) {
      const css = convertWithRefs(cls) ?? '';

      expect(css, cls).not.toContain('--ref-');
      expect(css, cls).toContain('var(--');
    }
  });

  it('leaves literal tokens on the refs cache', () => {
    expect(convertWithRefs('c-red-400/50')).toContain('var(--ref-c-red-400');
  });

  it('accepts the class-level $ and $$ prefixes in front of a $-token', () => {
    expect(convertWithRefs('$fs-$s')).toBe(
      `.\\$fs-\\$s { font-size: calc(var(--s) * 1rem * ${F_SPACER('fs')}); }`,
    );
    expect(convert('$$fs-$s')).toBe(
      `.\\$\\$fs-\\$s { font-size: calc(var(--s) * 1rem * ${F_SPACER('fs')}); }`,
    );
  });
});

describe('Variable tokens: aliases', () => {
  afterEach(() => collectAliases([]));

  it('expand inside alias bodies', () => {
    collectAliases([
      '--alias-stroke=brw-$stroke+stroke-px;brc-body-$tone-stroke',
    ]);

    expect(convert('@stroke')).toBe(
      `.\\@stroke { border-width: calc(var(--stroke) * 1rem * ${BR_SPACER('brw')} + var(--brw-stroke-px, var(--space-stroke-px, var(--stroke-px, stroke-px)))); } ` +
        `.\\@stroke { border-color: oklch(from var(--brc-body, var(--color-body, var(--body, body))) ${tone('brc', 'body', VAR_TONE('tone-stroke'), 'alpha')}; }`,
    );
  });

  it('expand alias params before the token is parsed', () => {
    collectAliases(['--alias-tone-of=brc-{color,body}-$tone-{role}']);

    expect(convert('@tone-of(color:red,role:hover)')).toBe(
      `.\\@tone-of\\(color\\:red\\,role\\:hover\\) { border-color: oklch(from var(--brc-red, var(--color-red, var(--red, red))) ${tone('brc', 'red', VAR_TONE('tone-hover'), 'alpha')}; }`,
    );
    expect(convert('@tone-of(role:stroke)')).toContain(
      `(0.5 - ${VAR_TONE('tone-stroke')})`,
    );
  });
});

describe('Variable tokens: parser', () => {
  it('keeps $name in utilVal and exposes the referenced names', () => {
    const parsed = parseClass('brw-$stroke+stroke-px');

    expect(parsed.utilVal).toBe('$stroke+stroke-px');
    expect(parsed.vars).toEqual(['stroke']);
  });

  it('collects every slot of a token once', () => {
    expect(
      parseClass(
        'bshadow-$elev-x_$elev-y_$elev-x_0_body-$tone-elev/$alpha-elev',
      ).vars,
    ).toEqual(['elev-x', 'elev-y', 'tone-elev', 'alpha-elev']);
    expect(parseClass('@dark:^.card:c-body-$t/$a').vars).toEqual(['t', 'a']);
  });

  it('exposes nothing for literals, bracket values and custom values', () => {
    expect(parseClass('p-4').vars).toBeUndefined();
    expect(parseClass('c-body-900/60').vars).toBeUndefined();
    expect(parseClass('p-[$x]').vars).toBeUndefined();
    expect(parseClass('content=$x').vars).toBeUndefined();
  });

  it('ends a name at / _ + , or the token end', () => {
    expect(parseClass('bshadow-$a_$b,$c+$d').vars).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
    expect(parseClass('c-red-$t/$a').vars).toEqual(['t', 'a']);
  });
});

describe('Variable tokens: forms that are not defined', () => {
  it('$ is not a token outside the tone, alpha and number slots', () => {
    // keyword and other properties already read variables through the plain chain
    expect(convert('pos-$mode')).toBe(
      '.pos-\\$mode { position: var(--pos-\\$mode, var(--\\$mode, $mode)); }',
    );
    expect(convert('pos-mode')).toBe(
      '.pos-mode { position: var(--pos-mode, var(--mode, mode)); }',
    );
    expect(convert('d-$x')).toContain('display: var(--d-\\$x');
    expect(convert('z-$layer')).toContain('z-index: var(--z-\\$layer');
    expect(convert('o-$fade')).toContain('opacity: var(--o-\\$fade');
    // the colour name is not a slot
    expect(convert('c-$x')).toBe(
      '.c-\\$x { color: var(--c-\\$x, var(--\\$x, $x)); }',
    );
  });

  it('+ is not a token outside a number slot', () => {
    expect(convert('bgc-red-$t+$a')).toBe(
      '.bgc-red-\\$t\\+\\$a { background-color: var(--bgc-red-\\$t\\+\\$a, var(--red-\\$t\\+\\$a, red-$t+$a)); }',
    );
    expect(convert('pos-a+b')).toBe(
      '.pos-a\\+b { position: var(--pos-a\\+b, var(--a\\+b, a+b)); }',
    );
  });

  it('- between two $ terms is not a token, and does not leak into vars', () => {
    expect(convert('brw-$a-$b')).toBe(
      '.brw-\\$a-\\$b { border-width: var(--brw-\\$a-\\$b, var(--space-\\$a-\\$b, var(--\\$a-\\$b, $a-$b))); }',
    );
    expect(parseClass('brw-$a-$b').vars).toEqual(['a', 'b']);
    expect(parseClass('c-red-$a--b').vars).toEqual(['a']);
  });

  it('a name must start with a letter', () => {
    expect(convert('brw-$1a')).toBe(
      '.brw-\\$1a { border-width: var(--brw-\\$1a, var(--space-\\$1a, var(--\\$1a, $1a))); }',
    );
    expect(convert('brw-$')).toBe(
      '.brw-\\$ { border-width: var(--brw-\\$, var(--space-\\$, var(--\\$, $))); }',
    );
  });

  it('bracket values still pass through verbatim', () => {
    expect(convert('brw-[calc(var(--a)*1rem+var(--b))]')).toBe(
      '.brw-\\[calc\\(var\\(--a\\)\\*1rem\\+var\\(--b\\)\\)\\] { border-width: calc(var(--a)*1rem+var(--b)); }',
    );
  });
});

/**
 * Computed-style equality in Chromium. `convert` inserts the rule into the
 * runtime sheet, so an element with the class picks it up.
 */
describe('Variable tokens: computed styles', () => {
  const html = document.documentElement;
  const mounted: Array<HTMLElement> = [];

  function mount(
    className: string,
    options: { style?: string; parentStyle?: string } = {},
  ): HTMLElement {
    convert(className);

    const parent = document.createElement('div');
    const el = document.createElement('div');

    parent.setAttribute('style', options.parentStyle ?? '');
    el.className = className;
    el.setAttribute('style', options.style ?? '');
    el.textContent = 'x';
    parent.appendChild(el);
    document.body.appendChild(parent);
    mounted.push(parent);

    return el;
  }

  function computed(
    className: string,
    prop: string,
    options: { style?: string; parentStyle?: string } = {},
  ): string {
    return getComputedStyle(mount(className, options)).getPropertyValue(prop);
  }

  function numbers(value: string): Array<number> {
    return (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  }

  function expectClose(actual: string, expected: string, tolerance = 1e-4) {
    const a = numbers(actual);
    const b = numbers(expected);

    expect(a.length, `${actual} vs ${expected}`).toBe(b.length);

    a.forEach((n, i) => {
      expect(Math.abs(n - b[i]), `${actual} vs ${expected}`).toBeLessThan(
        tolerance,
      );
    });
  }

  function setRootVars(vars: string) {
    html.setAttribute('style', vars);
  }

  afterEach(() => {
    html.removeAttribute('style');
    mounted.splice(0).forEach((el) => el.remove());
  });

  it('1. c-body-$t with --t=900 equals c-body-900, on the page and inside --l-shift=-0.7', () => {
    setRootVars('--body: #2a4d8f; --t: 900');

    const literal = computed('c-body-900', 'color');
    const variable = computed('c-body-$t', 'color');

    expect(literal).toMatch(/^oklch\(/);
    expectClose(variable, literal);

    const band = { parentStyle: '--l-shift: -0.7' };
    const literalBand = computed('c-body-900', 'color', band);
    const variableBand = computed('c-body-$t', 'color', band);

    expectClose(variableBand, literalBand);
    // the band actually inverts: lighter than on the page
    expect(numbers(literalBand)[0]).toBeGreaterThan(numbers(literal)[0]);
  });

  it('2. bgc-red-$t/$a with --t=700 --a=60 equals bgc-red-700/60', () => {
    setRootVars('--t: 700; --a: 60');

    const literal = computed('bgc-red-700/60', 'background-color');
    const variable = computed('bgc-red-$t/$a', 'background-color');

    expectClose(variable, literal);
    expect(numbers(literal).at(-1)).toBeCloseTo(0.6, 5);
  });

  it('3. fs-$s with --s=11 equals fs-11, also under a scaled spacer', () => {
    setRootVars('--s: 11');
    expect(computed('fs-$s', 'font-size')).toBe(computed('fs-11', 'font-size'));
    expect(computed('fs-11', 'font-size')).toBe('44px');

    setRootVars('--s: 11; --spacer: 0.21875; --fs-spacer: 0.21875');
    expect(computed('fs-$s', 'font-size')).toBe(computed('fs-11', 'font-size'));
    expect(computed('fs-11', 'font-size')).toBe('38.5px');
  });

  it('3b. a local --spacer scales a $-token on the element, not at the root', () => {
    setRootVars('--s: 4');

    const scaled = { parentStyle: '--spacer: 0.5' };

    expect(computed('p-$s', 'padding-top', scaled)).toBe(
      computed('p-4', 'padding-top', scaled),
    );
    expect(computed('p-4', 'padding-top', scaled)).toBe('32px');
  });

  it('4. -ls-$t and ls-$t with a negative variable agree with -ls-0.25', () => {
    const negative = computed('-ls-0.25', 'letter-spacing');

    expect(negative).toBe('-1px');

    setRootVars('--t: -0.25');
    expect(computed('ls-$t', 'letter-spacing')).toBe(negative);

    setRootVars('--t: 0.25');
    expect(computed('-ls-$t', 'letter-spacing')).toBe(negative);
  });

  it('5. brw-$stroke+stroke-px equals brw-0.5 in one theme and brw-px in the other', () => {
    const solid = { style: 'border-style: solid' };

    setRootVars('--stroke: 0.5; --stroke-px: 0px');
    expect(computed('brw-$stroke+stroke-px', 'border-top-width', solid)).toBe(
      computed('brw-0.5', 'border-top-width', solid),
    );
    expect(computed('brw-0.5', 'border-top-width', solid)).toBe('2px');

    setRootVars('--stroke: 0; --stroke-px: 1px');
    expect(computed('brw-$stroke+stroke-px', 'border-top-width', solid)).toBe(
      computed('brw-px', 'border-top-width', solid),
    );
    expect(computed('brw-px', 'border-top-width', solid)).toBe('1px');
  });

  it('5b. both sides of a sum must be defined (an undefined side drops the declaration)', () => {
    const solid = { style: 'border-style: solid' };

    setRootVars('--stroke-px: 1px');
    // invalid at computed-value time → `medium`
    expect(computed('brw-$stroke+stroke-px', 'border-top-width', solid)).toBe(
      '3px',
    );

    setRootVars('--stroke: 0.5');
    expect(computed('brw-$stroke+stroke-px', 'border-top-width', solid)).toBe(
      '3px',
    );
  });

  it('5c. a unitless 0 in a length token invalidates the sum (documented: write 0px)', () => {
    const solid = { style: 'border-style: solid' };

    setRootVars('--stroke: 0.5; --stroke-px: 0');
    expect(computed('brw-$stroke+stroke-px', 'border-top-width', solid)).toBe(
      '3px',
    );
  });

  it('5d. literal sums: brw-$a+px and h-100vh+-4', () => {
    const solid = { style: 'border-style: solid' };

    setRootVars('--a: 0.5');
    expect(computed('brw-$a+px', 'border-top-width', solid)).toBe('3px');

    setRootVars('--a: 0');
    expect(computed('brw-$a+px', 'border-top-width', solid)).toBe('1px');

    expect(computed('h-100vh+-4', 'height')).toBe(
      `${window.innerHeight - 16}px`,
    );
  });

  it('6. the shadow form with 1 1 0 950 100 equals bshadow-1_1_0_0_body-950', () => {
    setRootVars('--body: #2a4d8f; --x: 1; --y: 1; --b: 0; --t: 950; --a: 100');

    const literal = computed('bshadow-1_1_0_0_body-950', 'box-shadow');
    const variable = computed('bshadow-$x_$y_$b_0_body-$t/$a', 'box-shadow');

    expect(literal).toContain('4px 4px 0px 0px');
    expectClose(variable, literal);
  });

  it('7. undefined variables: tone → base colour, factor → unset, alpha → 100%', () => {
    setRootVars('--body: #2a4d8f');

    expectClose(
      computed('c-body-$t', 'color'),
      computed('c-body-500', 'color'),
    );
    expectClose(
      computed('bgc-red-700/$a', 'background-color'),
      computed('bgc-red-700', 'background-color'),
    );

    // font-size is inherited, so the dropped declaration leaves the parent size
    expect(
      computed('fs-$s', 'font-size', { parentStyle: 'font-size: 23px' }),
    ).toBe('23px');
  });
});
