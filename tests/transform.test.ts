import { describe, expect, it } from 'vitest';
import { generateStylesFromClass as convert } from '../src/core/generator';

const tf =
  'transform: var(--tf-tl,) var(--tf-tlx,) var(--tf-tly,) var(--tf-tlz,) var(--tf-tl3,) var(--tf-scale,) var(--tf-scalex,) var(--tf-scaley,) var(--tf-scalez,) var(--tf-scale3,) var(--tf-rot,) var(--tf-rotx,) var(--tf-roty,) var(--tf-rotz,) var(--tf-rot3,) var(--tf-skew,) var(--tf-skewx,) var(--tf-skewy,) var(--tf-mtx,) var(--tf-mtx3,)';

describe('Scale', () => {
  it('scale with integer', () => {
    expect(convert('scale-2')).toBe(
      `.scale-2 { --tf-scale: scale(var(--scale-2, 2));${tf}; }`,
    );
  });

  it('scale with 2 integers', () => {
    expect(convert('scale-2_3')).toBe(
      `.scale-2_3 { --tf-scale: scale(var(--scale-2, 2),var(--scale-3, 3));${tf}; }`,
    );
  });

  it('scale with 3 values', () => {
    expect(convert('scale-2_1.3_0.4')).toBe(
      `.scale-2_1\\.3_0\\.4 { --tf-scale: scale(var(--scale-2, 2),var(--scale-1\\.3, 1.3),var(--scale-0\\.4, 0.4));${tf}; }`,
    );
  });

  it('scale with integer and important', () => {
    expect(convert('!scale-2')).toBe(
      `.\\!scale-2 { --tf-scale: scale(var(--scale-2, 2));${tf} !important; }`,
    );
  });

  it('scale with integers and important', () => {
    expect(convert('!scale-2_3')).toBe(
      `.\\!scale-2_3 { --tf-scale: scale(var(--scale-2, 2),var(--scale-3, 3));${tf} !important; }`,
    );
  });

  it('scale with float', () => {
    expect(convert('scale-1.5')).toBe(
      `.scale-1\\.5 { --tf-scale: scale(var(--scale-1\\.5, 1.5));${tf}; }`,
    );
  });

  it('scale with float without integer', () => {
    expect(convert('scale-.5')).toBe(
      `.scale-\\.5 { --tf-scale: scale(var(--scale-\\.5, 0.5));${tf}; }`,
    );
  });

  it('scale with negative integer', () => {
    expect(convert('-scale-1')).toBe(
      `.-scale-1 { --tf-scale: scale(calc(var(--scale-1, 1) * -1));${tf}; }`,
    );
  });

  it('scale with negative float', () => {
    expect(convert('-scale-1.5')).toBe(
      `.-scale-1\\.5 { --tf-scale: scale(calc(var(--scale-1\\.5, 1.5) * -1));${tf}; }`,
    );
  });

  it('scale with negative float without integer', () => {
    expect(convert('-scale-.5')).toBe(
      `.-scale-\\.5 { --tf-scale: scale(calc(var(--scale-\\.5, 0.5) * -1));${tf}; }`,
    );
  });

  it('scale with 0', () => {
    expect(convert('scale-0')).toBe(`.scale-0 { --tf-scale: scale(0);${tf}; }`);
  });

  it('scale with negative 3 integers', () => {
    expect(convert('-scale-2_3_4')).toBe(
      `.-scale-2_3_4 { --tf-scale: scale(calc(var(--scale-2, 2) * -1),calc(var(--scale-3, 3) * -1),calc(var(--scale-4, 4) * -1));${tf}; }`,
    );
  });

  it('scale with negative values', () => {
    expect(convert('scale--2_-3_4')).toBe(
      `.scale--2_-3_4 { --tf-scale: scale(var(--scale--2, -2),var(--scale--3, -3),var(--scale-4, 4));${tf}; }`,
    );
  });

  it('scale with variable', () => {
    expect(convert('scale-lg')).toBe(
      `.scale-lg { --tf-scale: scale(var(--scale-lg, var(--lg, lg)));${tf}; }`,
    );
  });

  it('scale with custom value', () => {
    expect(convert('scale=2')).toBe(
      `.scale\\=2 { --tf-scale: scale(2);${tf}; }`,
    );
  });

  it('scale with multiple custom value', () => {
    expect(convert('scale=1,-1')).toBe(
      `.scale\\=1\\,-1 { --tf-scale: scale(1,-1);${tf}; }`,
    );
  });

  it('scale with multiple custom value and important', () => {
    expect(convert('!scale=1,-1')).toBe(
      `.\\!scale\\=1\\,-1 { --tf-scale: scale(1,-1);${tf} !important; }`,
    );
  });
});

describe('Skew', () => {
  it('skew with integer', () => {
    expect(convert('skew-15')).toBe(
      `.skew-15 { --tf-skew: skew(var(--skew-15, var(--angle-15, 15deg)));${tf}; }`,
    );
  });

  it('skew with 2 integers', () => {
    expect(convert('skew-10_15')).toBe(
      `.skew-10_15 { --tf-skew: skew(var(--skew-10, var(--angle-10, 10deg)),var(--skew-15, var(--angle-15, 15deg)));${tf}; }`,
    );
  });

  it('skew with 2 integers with rad', () => {
    expect(convert('skew-10rad_15rad')).toBe(
      `.skew-10rad_15rad { --tf-skew: skew(10rad,15rad);${tf}; }`,
    );
  });

  it('skew with integer and important', () => {
    expect(convert('!skew-15')).toBe(
      `.\\!skew-15 { --tf-skew: skew(var(--skew-15, var(--angle-15, 15deg)));${tf} !important; }`,
    );
  });

  it('skew with integers and important', () => {
    expect(convert('!skew-10_15')).toBe(
      `.\\!skew-10_15 { --tf-skew: skew(var(--skew-10, var(--angle-10, 10deg)),var(--skew-15, var(--angle-15, 15deg)));${tf} !important; }`,
    );
  });

  it('skew with float', () => {
    expect(convert('skew-1.5')).toBe(
      `.skew-1\\.5 { --tf-skew: skew(var(--skew-1\\.5, var(--angle-1\\.5, 1.5deg)));${tf}; }`,
    );
  });

  it('skew with float without integer', () => {
    expect(convert('skew-.5')).toBe(
      `.skew-\\.5 { --tf-skew: skew(var(--skew-\\.5, var(--angle-\\.5, 0.5deg)));${tf}; }`,
    );
  });

  it('skew with negative integer', () => {
    expect(convert('-skew-10')).toBe(
      `.-skew-10 { --tf-skew: skew(calc(var(--skew-10, var(--angle-10, 10deg)) * -1));${tf}; }`,
    );
  });

  it('skew with negative float', () => {
    expect(convert('-skew-1.5')).toBe(
      `.-skew-1\\.5 { --tf-skew: skew(calc(var(--skew-1\\.5, var(--angle-1\\.5, 1.5deg)) * -1));${tf}; }`,
    );
  });

  it('skew with negative float without integer', () => {
    expect(convert('-skew-.5')).toBe(
      `.-skew-\\.5 { --tf-skew: skew(calc(var(--skew-\\.5, var(--angle-\\.5, 0.5deg)) * -1));${tf}; }`,
    );
  });

  it('skew with negative values and custom unit', () => {
    expect(convert('skew--2rad_-3')).toBe(
      `.skew--2rad_-3 { --tf-skew: skew(-2rad,var(--skew--3, var(--angle--3, -3deg)));${tf}; }`,
    );
  });

  it('skew with 0', () => {
    expect(convert('skew-0')).toBe(`.skew-0 { --tf-skew: skew(0);${tf}; }`);
  });

  it('skew with variable', () => {
    expect(convert('skew-lg')).toBe(
      `.skew-lg { --tf-skew: skew(var(--skew-lg, var(--angle-lg, var(--lg, lg))));${tf}; }`,
    );
  });

  it('skew with custom value', () => {
    expect(convert('skew=2')).toBe(`.skew\\=2 { --tf-skew: skew(2);${tf}; }`);
  });

  it('skew with multiple custom value', () => {
    expect(convert('skew=1,-1')).toBe(
      `.skew\\=1\\,-1 { --tf-skew: skew(1,-1);${tf}; }`,
    );
  });

  it('skew with multiple custom value and important', () => {
    expect(convert('!skew=1,-1')).toBe(
      `.\\!skew\\=1\\,-1 { --tf-skew: skew(1,-1);${tf} !important; }`,
    );
  });
});

describe('Rotate', () => {
  it('rotate with integer', () => {
    expect(convert('rot-15')).toBe(
      `.rot-15 { --tf-rot: rotate(var(--rot-15, var(--angle-15, 15deg)));${tf}; }`,
    );
  });

  it('rotate with 2 integers', () => {
    expect(convert('rot-10_15')).toBe(
      `.rot-10_15 { --tf-rot: rotate(var(--rot-10, var(--angle-10, 10deg)),var(--rot-15, var(--angle-15, 15deg)));${tf}; }`,
    );
  });

  it('rotate with 2 integers with rad', () => {
    expect(convert('rot-10rad_15rad')).toBe(
      `.rot-10rad_15rad { --tf-rot: rotate(10rad,15rad);${tf}; }`,
    );
  });

  it('rotate with 3 values', () => {
    expect(convert('rot-2_1.3_0.4')).toBe(
      `.rot-2_1\\.3_0\\.4 { --tf-rot: rotate(var(--rot-2, var(--angle-2, 2deg)),var(--rot-1\\.3, var(--angle-1\\.3, 1.3deg)),var(--rot-0\\.4, var(--angle-0\\.4, 0.4deg)));${tf}; }`,
    );
  });

  it('rotate with integer and important', () => {
    expect(convert('!rot-15')).toBe(
      `.\\!rot-15 { --tf-rot: rotate(var(--rot-15, var(--angle-15, 15deg)));${tf} !important; }`,
    );
  });

  it('rotate with integers and important', () => {
    expect(convert('!rot-10_15')).toBe(
      `.\\!rot-10_15 { --tf-rot: rotate(var(--rot-10, var(--angle-10, 10deg)),var(--rot-15, var(--angle-15, 15deg)));${tf} !important; }`,
    );
  });

  it('rotate with float', () => {
    expect(convert('rot-1.5')).toBe(
      `.rot-1\\.5 { --tf-rot: rotate(var(--rot-1\\.5, var(--angle-1\\.5, 1.5deg)));${tf}; }`,
    );
  });

  it('rotate with float without integer', () => {
    expect(convert('rot-.5')).toBe(
      `.rot-\\.5 { --tf-rot: rotate(var(--rot-\\.5, var(--angle-\\.5, 0.5deg)));${tf}; }`,
    );
  });

  it('rotate with negative integer', () => {
    expect(convert('-rot-10')).toBe(
      `.-rot-10 { --tf-rot: rotate(calc(var(--rot-10, var(--angle-10, 10deg)) * -1));${tf}; }`,
    );
  });

  it('rotate with negative float', () => {
    expect(convert('-rot-1.5')).toBe(
      `.-rot-1\\.5 { --tf-rot: rotate(calc(var(--rot-1\\.5, var(--angle-1\\.5, 1.5deg)) * -1));${tf}; }`,
    );
  });

  it('rotate with negative float without integer', () => {
    expect(convert('-rot-.5')).toBe(
      `.-rot-\\.5 { --tf-rot: rotate(calc(var(--rot-\\.5, var(--angle-\\.5, 0.5deg)) * -1));${tf}; }`,
    );
  });

  it('rotate with 0', () => {
    expect(convert('rot-0')).toBe(`.rot-0 { --tf-rot: rotate(0);${tf}; }`);
  });

  it('rotate with negative 3 integers', () => {
    expect(convert('-rot-2_3_4')).toBe(
      `.-rot-2_3_4 { --tf-rot: rotate(calc(var(--rot-2, var(--angle-2, 2deg)) * -1),calc(var(--rot-3, var(--angle-3, 3deg)) * -1),calc(var(--rot-4, var(--angle-4, 4deg)) * -1));${tf}; }`,
    );
  });

  it('rotate with negative values and custom unit', () => {
    expect(convert('rot-2rad_-3_-0.06turn')).toBe(
      `.rot-2rad_-3_-0\\.06turn { --tf-rot: rotate(2rad,var(--rot--3, var(--angle--3, -3deg)),-0.06turn);${tf}; }`,
    );
  });

  it('rotate with variable', () => {
    expect(convert('rot-lg')).toBe(
      `.rot-lg { --tf-rot: rotate(var(--rot-lg, var(--angle-lg, var(--lg, lg))));${tf}; }`,
    );
  });

  it('rotate with custom value', () => {
    expect(convert('rot=2')).toBe(`.rot\\=2 { --tf-rot: rotate(2);${tf}; }`);
  });

  it('rotate with multiple custom value', () => {
    expect(convert('rot=1,-1')).toBe(
      `.rot\\=1\\,-1 { --tf-rot: rotate(1,-1);${tf}; }`,
    );
  });

  it('rotate with multiple custom value and important', () => {
    expect(convert('!rot=1,-1')).toBe(
      `.\\!rot\\=1\\,-1 { --tf-rot: rotate(1,-1);${tf} !important; }`,
    );
  });
});

describe('Translate', () => {
  it('translate with integer', () => {
    expect(convert('tl-15')).toBe(
      `.tl-15 { --tf-tl: translate(var(--tl-15, var(--space-15, calc(15rem * var(--spacer, 0.25)))));${tf}; }`,
    );
  });

  it('translate with 2 integers', () => {
    expect(convert('tl-10_15')).toBe(
      `.tl-10_15 { --tf-tl: translate(var(--tl-10, var(--space-10, calc(10rem * var(--spacer, 0.25)))),var(--tl-15, var(--space-15, calc(15rem * var(--spacer, 0.25)))));${tf}; }`,
    );
  });

  it('translate with unit shortcut', () => {
    expect(convert('tl-%')).toBe(`.tl-\\% { --tf-tl: translate(100%);${tf}; }`);
  });

  it('translate with negative unit shortcut', () => {
    expect(convert('-tl-%')).toBe(
      `.-tl-\\% { --tf-tl: translate(-100%);${tf}; }`,
    );
  });

  it('translate with number and unit', () => {
    expect(convert('tl-100%')).toBe(
      `.tl-100\\% { --tf-tl: translate(100%);${tf}; }`,
    );
  });

  it('translate with negative number and unit', () => {
    expect(convert('tl--100%')).toBe(
      `.tl--100\\% { --tf-tl: translate(-100%);${tf}; }`,
    );
  });

  it('translate with 2 integers with px', () => {
    expect(convert('tl-10px_15px')).toBe(
      `.tl-10px_15px { --tf-tl: translate(10px,15px);${tf}; }`,
    );
  });

  it('translate with 3 values', () => {
    expect(convert('tl-2_1.3_0.4')).toBe(
      `.tl-2_1\\.3_0\\.4 { --tf-tl: translate(var(--tl-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))),var(--tl-1\\.3, var(--space-1\\.3, calc(1.3rem * var(--spacer, 0.25)))),var(--tl-0\\.4, var(--space-0\\.4, calc(0.4rem * var(--spacer, 0.25)))));${tf}; }`,
    );
  });

  it('translate with integer and important', () => {
    expect(convert('!tl-15')).toBe(
      `.\\!tl-15 { --tf-tl: translate(var(--tl-15, var(--space-15, calc(15rem * var(--spacer, 0.25)))));${tf} !important; }`,
    );
  });

  it('translate with integers and important', () => {
    expect(convert('!tl-10_15')).toBe(
      `.\\!tl-10_15 { --tf-tl: translate(var(--tl-10, var(--space-10, calc(10rem * var(--spacer, 0.25)))),var(--tl-15, var(--space-15, calc(15rem * var(--spacer, 0.25)))));${tf} !important; }`,
    );
  });

  it('translate with float', () => {
    expect(convert('tl-1.5')).toBe(
      `.tl-1\\.5 { --tf-tl: translate(var(--tl-1\\.5, var(--space-1\\.5, calc(1.5rem * var(--spacer, 0.25)))));${tf}; }`,
    );
  });

  it('translate with float without integer', () => {
    expect(convert('tl-.5')).toBe(
      `.tl-\\.5 { --tf-tl: translate(var(--tl-\\.5, var(--space-\\.5, calc(0.5rem * var(--spacer, 0.25)))));${tf}; }`,
    );
  });

  it('translate with negative integer', () => {
    expect(convert('-tl-10')).toBe(
      `.-tl-10 { --tf-tl: translate(calc(var(--tl-10, var(--space-10, calc(10rem * var(--spacer, 0.25)))) * -1));${tf}; }`,
    );
  });

  it('translate with negative float', () => {
    expect(convert('-tl-1.5')).toBe(
      `.-tl-1\\.5 { --tf-tl: translate(calc(var(--tl-1\\.5, var(--space-1\\.5, calc(1.5rem * var(--spacer, 0.25)))) * -1));${tf}; }`,
    );
  });

  it('translate with negative float without integer', () => {
    expect(convert('-tl-.5')).toBe(
      `.-tl-\\.5 { --tf-tl: translate(calc(var(--tl-\\.5, var(--space-\\.5, calc(0.5rem * var(--spacer, 0.25)))) * -1));${tf}; }`,
    );
  });

  it('translate with 0', () => {
    expect(convert('tl-0')).toBe(`.tl-0 { --tf-tl: translate(0);${tf}; }`);
  });

  it('translate with negative 3 integers', () => {
    expect(convert('-tl-2_3_4')).toBe(
      `.-tl-2_3_4 { --tf-tl: translate(calc(var(--tl-2, var(--space-2, calc(2rem * var(--spacer, 0.25)))) * -1),calc(var(--tl-3, var(--space-3, calc(3rem * var(--spacer, 0.25)))) * -1),calc(var(--tl-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1));${tf}; }`,
    );
  });

  it('translate with negative values and custom unit', () => {
    expect(convert('tl-50%_-3_-10px')).toBe(
      `.tl-50\\%_-3_-10px { --tf-tl: translate(50%,var(--tl--3, var(--space--3, calc(-3rem * var(--spacer, 0.25)))),-10px);${tf}; }`,
    );
  });

  it('translate with variable', () => {
    expect(convert('tl-lg')).toBe(
      `.tl-lg { --tf-tl: translate(var(--tl-lg, var(--space-lg, var(--lg, lg))));${tf}; }`,
    );
  });

  it('translate with custom value', () => {
    expect(convert('tl=2px')).toBe(
      `.tl\\=2px { --tf-tl: translate(2px);${tf}; }`,
    );
  });

  it('translate with multiple custom value', () => {
    expect(convert('tl=1px,-1px')).toBe(
      `.tl\\=1px\\,-1px { --tf-tl: translate(1px,-1px);${tf}; }`,
    );
  });

  it('translate with multiple custom value and important', () => {
    expect(convert('!tl=1px,-1px')).toBe(
      `.\\!tl\\=1px\\,-1px { --tf-tl: translate(1px,-1px);${tf} !important; }`,
    );
  });
});
