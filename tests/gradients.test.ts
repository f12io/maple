import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

describe('Linear', () => {
  it('function key as variable', () => {
    expect(convert('bgimg-linear')).toBe(
      `.bgimg-linear { background-image: linear-gradient(var(--bgimg-linear, var(--gradient-linear, var(--linear, linear)))); }`,
    );
  });

  it('linear with variable', () => {
    expect(convert('bgimg-linear-primary')).toBe(
      `.bgimg-linear-primary { background-image: linear-gradient(var(--bgimg-linear-primary, var(--gradient-linear-primary, var(--linear-primary, linear-primary)))); }`,
    );
  });

  it('linear with custom value in predefined syntax', () => {
    expect(convert('bgimg-linear-[to_top,red,blue]')).toBe(
      `.bgimg-linear-\\[to_top\\,red\\,blue\\] { background-image: linear-gradient(to top,red,blue); }`,
    );
  });

  it('linear with mulitple predefined variable (function key is not available)', () => {
    expect(convert('bgimg-linear-primary,radial-primary')).toBe(
      `.bgimg-linear-primary\\,radial-primary { background-image: linear-gradient(var(--bgimg-linear-primary, var(--gradient-linear-primary, var(--linear-primary, linear-primary)))), radial-gradient(var(--bgimg-radial-primary, var(--gradient-radial-primary, var(--radial-primary, radial-primary)))); }`,
    );
  });

  it('linear with two stops without direction', () => {
    expect(convert('bgimg-linear-red|blue')).toBe(
      `.bgimg-linear-red\\|blue { background-image: linear-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('linear with two custom stops without direction', () => {
    expect(convert('bgimg-linear-[red]|[blue]')).toBe(
      `.bgimg-linear-\\[red\\]\\|\\[blue\\] { background-image: linear-gradient(red, blue); }`,
    );
  });

  it('linear with two custom stops without direction', () => {
    expect(convert('bgimg-linear-[red]|[blue_50%]')).toBe(
      `.bgimg-linear-\\[red\\]\\|\\[blue_50\\%\\] { background-image: linear-gradient(red, blue 50%); }`,
    );
  });

  it('linear with two custom stops without direction and custom variable', () => {
    expect(
      convert('bgimg-linear-[red]|[blue]_[var(--custom-stop-variable)]'),
    ).toBe(
      `.bgimg-linear-\\[red\\]\\|\\[blue\\]_\\[var\\(--custom-stop-variable\\)\\] { background-image: linear-gradient(red, blue var(--custom-stop-variable)); }`,
    );
  });

  it('repeating-linear with two stops without direction', () => {
    expect(convert('bgimg-rlinear-red|blue')).toBe(
      `.bgimg-rlinear-red\\|blue { background-image: repeating-linear-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('linear multiple gradients with two colors', () => {
    expect(convert('bgimg-linear-red|blue,radial-green|transparent')).toBe(
      `.bgimg-linear-red\\|blue\\,radial-green\\|transparent { background-image: linear-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)), radial-gradient(oklch(from var(--bgc-green, var(--color-green, var(--green, green))) calc(l * var(--bgc-green-lightness-factor, var(--green-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-green-chroma-factor, var(--green-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-green-hue-rotate, var(--green-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent); }`,
    );
  });

  it('linear gradient with direction, alpa and stop', () => {
    expect(
      convert(
        'bgimg-linear-to_top|primary/50_50%|red|transparent_0|transparent',
      ),
    ).toBe(
      `.bgimg-linear-to_top\\|primary\\/50_50\\%\\|red\\|transparent_0\\|transparent { background-image: linear-gradient(to top, oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--hue-rotate, 0)))) / 50%) 50%, oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent 0, transparent); }`,
    );
  });

  it('linear gradient with hex', () => {
    expect(convert('bgimg-linear-in_oklab|#000|#fff_50%')).toBe(
      `.bgimg-linear-in_oklab\\|\\#000\\|\\#fff_50\\% { background-image: linear-gradient(in oklab, #000, #fff 50%); }`,
    );
  });

  it('linear gradient with rgb', () => {
    expect(
      convert('bgimg-linear-in_oklab|rgb(0,0,0)|rgb(255,255,255)_50%'),
    ).toBe(
      `.bgimg-linear-in_oklab\\|rgb\\(0\\,0\\,0\\)\\|rgb\\(255\\,255\\,255\\)_50\\% { background-image: linear-gradient(in oklab, rgb(0,0,0), rgb(255,255,255) 50%); }`,
    );
  });

  it('linear gradient with hex and shortcut stops', () => {
    expect(convert('bgimg-linear-in_oklab|#000_%|#fff_1/2|transparent_0')).toBe(
      `.bgimg-linear-in_oklab\\|\\#000_\\%\\|\\#fff_1\\/2\\|transparent_0 { background-image: linear-gradient(in oklab, #000 100%, #fff 50%, transparent 0); }`,
    );
  });
});

describe('Radial', () => {
  it('function key as variable', () => {
    expect(convert('bgimg-radial')).toBe(
      `.bgimg-radial { background-image: radial-gradient(var(--bgimg-radial, var(--gradient-radial, var(--radial, radial)))); }`,
    );
  });

  it('radial with variable', () => {
    expect(convert('bgimg-radial-primary')).toBe(
      `.bgimg-radial-primary { background-image: radial-gradient(var(--bgimg-radial-primary, var(--gradient-radial-primary, var(--radial-primary, radial-primary)))); }`,
    );
  });

  it('radial with two stops without direction', () => {
    expect(convert('bgimg-radial-red|blue')).toBe(
      `.bgimg-radial-red\\|blue { background-image: radial-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('repeating-radial with two stops without direction', () => {
    expect(convert('bgimg-rradial-red|blue')).toBe(
      `.bgimg-rradial-red\\|blue { background-image: repeating-radial-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('radial multiple gradients with two colors', () => {
    expect(convert('bgimg-radial-red|blue,radial-green|transparent')).toBe(
      `.bgimg-radial-red\\|blue\\,radial-green\\|transparent { background-image: radial-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)), radial-gradient(oklch(from var(--bgc-green, var(--color-green, var(--green, green))) calc(l * var(--bgc-green-lightness-factor, var(--green-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-green-chroma-factor, var(--green-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-green-hue-rotate, var(--green-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent); }`,
    );
  });

  it('radial gradient with direction, alpa and stop', () => {
    expect(
      convert(
        'bgimg-radial-closest-side|primary/50_50%|red|transparent_0|transparent',
      ),
    ).toBe(
      `.bgimg-radial-closest-side\\|primary\\/50_50\\%\\|red\\|transparent_0\\|transparent { background-image: radial-gradient(closest-side, oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--hue-rotate, 0)))) / 50%) 50%, oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent 0, transparent); }`,
    );
  });

  it('radial gradient with hex', () => {
    expect(convert('bgimg-radial-circle|#000|#fff_50%')).toBe(
      `.bgimg-radial-circle\\|\\#000\\|\\#fff_50\\% { background-image: radial-gradient(circle, #000, #fff 50%); }`,
    );
  });

  it('radial gradient with hex and shortcut stops', () => {
    expect(
      convert('bgimg-radial-ellipse_at_top|#000_%|#fff_1/2|transparent_0'),
    ).toBe(
      `.bgimg-radial-ellipse_at_top\\|\\#000_\\%\\|\\#fff_1\\/2\\|transparent_0 { background-image: radial-gradient(ellipse at top, #000 100%, #fff 50%, transparent 0); }`,
    );
  });

  it('radial gradient', () => {
    expect(convert('bgimg-radial-10deg|red|transparent')).toBe(
      `.bgimg-radial-10deg\\|red\\|transparent { background-image: radial-gradient(10deg, oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent); }`,
    );
  });

  it('radial gradient with direction', () => {
    expect(
      convert(
        'bgimg-radial-circle_at_center_in_hsl_longer_hue|red|transparent',
      ),
    ).toBe(
      `.bgimg-radial-circle_at_center_in_hsl_longer_hue\\|red\\|transparent { background-image: radial-gradient(circle at center in hsl longer hue, oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent); }`,
    );
  });

  it('radial gradient with farthest-corner and position', () => {
    expect(
      convert('bgimg-radial-farthest-corner_at_40px_40px|#ff3355_0|#4433ee_%'),
    ).toBe(
      `.bgimg-radial-farthest-corner_at_40px_40px\\|\\#ff3355_0\\|\\#4433ee_\\% { background-image: radial-gradient(farthest-corner at 40px 40px, #ff3355 0, #4433ee 100%); }`,
    );
  });
});

describe('Conic', () => {
  it('function key as variable', () => {
    expect(convert('bgimg-conic')).toBe(
      `.bgimg-conic { background-image: conic-gradient(var(--bgimg-conic, var(--gradient-conic, var(--conic, conic)))); }`,
    );
  });

  it('conic with variable', () => {
    expect(convert('bgimg-conic-primary')).toBe(
      `.bgimg-conic-primary { background-image: conic-gradient(var(--bgimg-conic-primary, var(--gradient-conic-primary, var(--conic-primary, conic-primary)))); }`,
    );
  });

  it('conic with variable', () => {
    expect(convert('bgimg-conic-primary|secondary')).toBe(
      `.bgimg-conic-primary\\|secondary { background-image: conic-gradient(oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-secondary, var(--color-secondary, var(--secondary, secondary))) calc(l * var(--bgc-secondary-lightness-factor, var(--secondary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-secondary-chroma-factor, var(--secondary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-secondary-hue-rotate, var(--secondary-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('conic with two stops without direction', () => {
    expect(convert('bgimg-conic-red|blue')).toBe(
      `.bgimg-conic-red\\|blue { background-image: conic-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('repeating-conic with two stops without direction', () => {
    expect(convert('bgimg-rconic-red|blue')).toBe(
      `.bgimg-rconic-red\\|blue { background-image: repeating-conic-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)); }`,
    );
  });

  it('conic multiple gradients with two colors', () => {
    expect(convert('bgimg-conic-red|blue,conic-green|transparent')).toBe(
      `.bgimg-conic-red\\|blue\\,conic-green\\|transparent { background-image: conic-gradient(oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), oklch(from var(--bgc-blue, var(--color-blue, var(--blue, blue))) calc(l * var(--bgc-blue-lightness-factor, var(--blue-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-blue-chroma-factor, var(--blue-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-blue-hue-rotate, var(--blue-hue-rotate, var(--hue-rotate, 0)))) / alpha)), conic-gradient(oklch(from var(--bgc-green, var(--color-green, var(--green, green))) calc(l * var(--bgc-green-lightness-factor, var(--green-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-green-chroma-factor, var(--green-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-green-hue-rotate, var(--green-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent); }`,
    );
  });

  it('conic gradient with direction, alpa and stop', () => {
    expect(
      convert(
        'bgimg-conic-from_40deg|primary/50_180deg|red|transparent_0|transparent',
      ),
    ).toBe(
      `.bgimg-conic-from_40deg\\|primary\\/50_180deg\\|red\\|transparent_0\\|transparent { background-image: conic-gradient(from 40deg, oklch(from var(--bgc-primary, var(--color-primary, var(--primary, primary))) calc(l * var(--bgc-primary-lightness-factor, var(--primary-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-primary-chroma-factor, var(--primary-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-primary-hue-rotate, var(--primary-hue-rotate, var(--hue-rotate, 0)))) / 50%) 180deg, oklch(from var(--bgc-red, var(--color-red, var(--red, red))) calc(l * var(--bgc-red-lightness-factor, var(--red-lightness-factor, var(--lightness-factor, 1)))) calc(c * var(--bgc-red-chroma-factor, var(--red-chroma-factor, var(--chroma-factor, 1)))) calc(h + var(--bgc-red-hue-rotate, var(--red-hue-rotate, var(--hue-rotate, 0)))) / alpha), transparent 0, transparent); }`,
    );
  });

  it('conic gradient with hex', () => {
    expect(convert('bgimg-conic-from_40deg|#000|#fff_90grad')).toBe(
      `.bgimg-conic-from_40deg\\|\\#000\\|\\#fff_90grad { background-image: conic-gradient(from 40deg, #000, #fff 90grad); }`,
    );
  });

  it('conic checkboard', () => {
    expect(
      convert(
        'bg-conic-#fff_0.25turn|#000_0.25turn_0.5turn|#fff_0.5turn_0.75turn|#000_0.75turn__top_left/25%_25%_repeat',
      ),
    ).toBe(
      `.bg-conic-\\#fff_0\\.25turn\\|\\#000_0\\.25turn_0\\.5turn\\|\\#fff_0\\.5turn_0\\.75turn\\|\\#000_0\\.75turn__top_left\\/25\\%_25\\%_repeat { background: conic-gradient(#fff 0.25turn, #000 0.25turn 0.5turn, #fff 0.5turn 0.75turn, #000 0.75turn) top left/25% 25% repeat; }`,
    );
  });

  it('conic checkboard with another layer', () => {
    expect(
      convert(
        'bg-conic-#fff_0.25turn|#000_0.25turn_0.5turn|#fff_0.5turn_0.75turn|#000_0.75turn__top_left/25%_25%_repeat,linear-#000|#fff',
      ),
    ).toBe(
      `.bg-conic-\\#fff_0\\.25turn\\|\\#000_0\\.25turn_0\\.5turn\\|\\#fff_0\\.5turn_0\\.75turn\\|\\#000_0\\.75turn__top_left\\/25\\%_25\\%_repeat\\,linear-\\#000\\|\\#fff { background: conic-gradient(#fff 0.25turn, #000 0.25turn 0.5turn, #fff 0.5turn 0.75turn, #000 0.75turn) top left/25% 25% repeat, linear-gradient(#000, #fff); }`,
    );
  });

  it('conic gradient with farthest-corner and position', () => {
    expect(
      convert('bgimg-conic-from_3.1416rad_at_10%_50%|#ff3355_0|#4433ee_%'),
    ).toBe(
      `.bgimg-conic-from_3\\.1416rad_at_10\\%_50\\%\\|\\#ff3355_0\\|\\#4433ee_\\% { background-image: conic-gradient(from 3.1416rad at 10% 50%, #ff3355 0, #4433ee 100%); }`,
    );
  });
});

describe('Background Image Url and Gradients', () => {
  it('url with absolute path and brackets', () => {
    expect(convert('bgimg-url-[https://example.com/image.jpg]')).toBe(
      `.bgimg-url-\\[https\\:\\/\\/example\\.com\\/image\\.jpg\\] { background-image: url(https://example.com/image.jpg); }`,
    );
  });

  it('url with absolute path and double quotes', () => {
    expect(convert('bgimg-url-"https://example.com/image.jpg"')).toBe(
      `.bgimg-url-\\"https\\:\\/\\/example\\.com\\/image\\.jpg\\" { background-image: url("https://example.com/image.jpg"); }`,
    );
  });

  it('url with absolute path and single quotes', () => {
    expect(convert("bgimg-url-'https://example.com/image.jpg'")).toBe(
      `.bgimg-url-\\'https\\:\\/\\/example\\.com\\/image\\.jpg\\' { background-image: url('https://example.com/image.jpg'); }`,
    );
  });

  it('url with relative path', () => {
    expect(convert('bgimg-url-/path/to/image.jpg')).toBe(
      `.bgimg-url-\\/path\\/to\\/image\\.jpg { background-image: url(/path/to/image.jpg); }`,
    );
  });

  it('url with predefined variable', () => {
    expect(convert('bgimg-url-logo')).toBe(
      `.bgimg-url-logo { background-image: url(var(--bgimg-url-logo, var(--url-logo, url-logo))); }`,
    );
  });

  it('url with predefined variable and bg params', () => {
    expect(convert('bg-url-logo__no-repeat')).toBe(
      `.bg-url-logo__no-repeat { background: url(var(--bgimg-url-logo, var(--url-logo, url-logo))) no-repeat; }`,
    );
  });

  it('url with absolute path and custom value', () => {
    expect(convert('bgimg=url(https://example.com/image.jpg)')).toBe(
      `.bgimg\\=url\\(https\\:\\/\\/example\\.com\\/image\\.jpg\\) { background-image: url(https://example.com/image.jpg); }`,
    );
  });

  it('url with relative path and custom value', () => {
    expect(convert('bgimg=url(/path/to/image.jpg)')).toBe(
      `.bgimg\\=url\\(\\/path\\/to\\/image\\.jpg\\) { background-image: url(/path/to/image.jpg); }`,
    );
  });

  it('url with bg params', () => {
    expect(
      convert(
        'bg-url-"https://example.com/im__age.jpg"__top_left/25%_25%_repeat',
      ),
    ).toBe(
      `.bg-url-\\"https\\:\\/\\/example\\.com\\/im__age\\.jpg\\"__top_left\\/25\\%_25\\%_repeat { background: url("https://example.com/im__age.jpg") top left/25% 25% repeat; }`,
    );
  });

  it('linear multiple gradients with two colors and url', () => {
    expect(
      convert('bgimg-linear-#000|#fff,url-[https://example.com/image.jpg]'),
    ).toBe(
      `.bgimg-linear-\\#000\\|\\#fff\\,url-\\[https\\:\\/\\/example\\.com\\/image\\.jpg\\] { background-image: linear-gradient(#000, #fff), url(https://example.com/image.jpg); }`,
    );
  });

  it('linear multiple gradients with two colors and url with relative path', () => {
    expect(convert('bgimg-linear-#000|#fff,url-/path/to/image.jpg')).toBe(
      `.bgimg-linear-\\#000\\|\\#fff\\,url-\\/path\\/to\\/image\\.jpg { background-image: linear-gradient(#000, #fff), url(/path/to/image.jpg); }`,
    );
  });

  it('linear multiple gradients with two colors and url with variable', () => {
    expect(convert('bgimg-linear-#000|#fff,url-logo')).toBe(
      `.bgimg-linear-\\#000\\|\\#fff\\,url-logo { background-image: linear-gradient(#000, #fff), url(var(--bgimg-url-logo, var(--url-logo, url-logo))); }`,
    );
  });
});
