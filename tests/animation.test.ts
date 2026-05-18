import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Animation', () => {
  it('animation alias expansion', () => {
    expect(convert('fade-in')).toBe(
      `.fade-in { animation: var(--animname-fade-in, var(--fade-in, fade-in)) var(--animdur-fade-in, var(--animdur, var(--animdur-600, var(--time-600, 600ms)))) var(--animtf-fade-in, var(--animtf, var(--animtf-ease-out, var(--ease-out, ease-out)))) var(--animfm-fade-in, var(--animfm, var(--animfm-forwards, var(--forwards, forwards)))); }`,
    );

    expect(convert('spin')).toBe(
      `.spin { animation: var(--animname-spin, var(--spin, spin)) var(--animdur-spin, var(--animdur, var(--animdur-1000, var(--time-1000, 1000ms)))) var(--animtf-spin, var(--animtf, var(--animtf-linear, var(--linear, linear)))) var(--animic-spin, var(--animic, var(--animic-infinite, var(--infinite, infinite)))); }`,
    );

    expect(convert('fade-out-up')).toBe(
      `.fade-out-up { animation: var(--animname-fade-out-up, var(--fade-out-up, fade-out-up)) var(--animdur-fade-out-up, var(--animdur, var(--animdur-200, var(--time-200, 200ms)))) var(--animtf-fade-out-up, var(--animtf, var(--animtf-ease-in, var(--ease-in, ease-in)))) var(--animfm-fade-out-up, var(--animfm, var(--animfm-forwards, var(--forwards, forwards)))); }`,
    );

    expect(convert('slide-in-up')).toBe(
      `.slide-in-up { animation: var(--animname-slide-in-up, var(--slide-in-up, slide-in-up)) var(--animdur-slide-in-up, var(--animdur, var(--animdur-600, var(--time-600, 600ms)))) var(--animtf-slide-in-up, var(--animtf, var(--animtf-ease-out, var(--ease-out, ease-out)))) var(--animfm-slide-in-up, var(--animfm, var(--animfm-forwards, var(--forwards, forwards)))); }`,
    );

    expect(convert('slide-out-up')).toBe(
      `.slide-out-up { animation: var(--animname-slide-out-up, var(--slide-out-up, slide-out-up)) var(--animdur-slide-out-up, var(--animdur, var(--animdur-200, var(--time-200, 200ms)))) var(--animtf-slide-out-up, var(--animtf, var(--animtf-ease-in, var(--ease-in, ease-in)))) var(--animfm-slide-out-up, var(--animfm, var(--animfm-forwards, var(--forwards, forwards)))); }`,
    );
  });

  it('animation with name and duration', () => {
    expect(convert('anim-fade_300')).toBe(
      `.anim-fade_300 { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))); }`,
    );
  });

  it('animation with name, duration and timing function', () => {
    expect(convert('anim-fade_300_ease')).toBe(
      `.anim-fade_300_ease { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))); }`,
    );
  });

  it('animation with name, duration, timing function and delay', () => {
    expect(convert('anim-fade_300_ease_200')).toBe(
      `.anim-fade_300_ease_200 { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))) var(--animdel-fade, var(--animdel, var(--animdel-200, var(--time-200, 200ms)))); }`,
    );
  });

  it('animation with name, duration, timing function, delay and iteration count', () => {
    expect(convert('anim-fade_300_ease_200_infinite')).toBe(
      `.anim-fade_300_ease_200_infinite { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))) var(--animdel-fade, var(--animdel, var(--animdel-200, var(--time-200, 200ms)))) var(--animic-fade, var(--animic, var(--animic-infinite, var(--infinite, infinite)))); }`,
    );
  });

  it('animation with all properties', () => {
    expect(
      convert('anim-fade_300_ease_200_infinite_alternate_both_running'),
    ).toBe(
      `.anim-fade_300_ease_200_infinite_alternate_both_running { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))) var(--animdel-fade, var(--animdel, var(--animdel-200, var(--time-200, 200ms)))) var(--animic-fade, var(--animic, var(--animic-infinite, var(--infinite, infinite)))) var(--animdir-fade, var(--animdir, var(--animdir-alternate, var(--alternate, alternate)))) var(--animfm-fade, var(--animfm, var(--animfm-both, var(--both, both)))) var(--animps-fade, var(--animps, var(--animps-running, var(--running, running)))); }`,
    );
  });

  it('animation with multiple animations', () => {
    expect(convert('anim-fade_300_ease,slide_200_linear')).toBe(
      `.anim-fade_300_ease\\,slide_200_linear { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))), var(--animname-slide, var(--slide, slide)) var(--animdur-slide, var(--animdur, var(--animdur-200, var(--time-200, 200ms)))) var(--animtf-slide, var(--animtf, var(--animtf-linear, var(--linear, linear)))); }`,
    );
  });

  it('animation with multiple animations and important', () => {
    expect(convert('!anim-fade_300_ease,slide_200_linear')).toBe(
      `.\\!anim-fade_300_ease\\,slide_200_linear { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))), var(--animname-slide, var(--slide, slide)) var(--animdur-slide, var(--animdur, var(--animdur-200, var(--time-200, 200ms)))) var(--animtf-slide, var(--animtf, var(--animtf-linear, var(--linear, linear)))) !important; }`,
    );
  });

  it('animation with number iteration count', () => {
    expect(convert('anim-fade_300_ease_0_3')).toBe(
      `.anim-fade_300_ease_0_3 { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) var(--animtf-fade, var(--animtf, var(--animtf-ease, var(--ease, ease)))) var(--animdel-fade, var(--animdel, 0ms)) var(--animic-fade, var(--animic, var(--animic-3, 3))); }`,
    );
  });

  it('animation with custom timing function', () => {
    expect(convert('anim-fade_300_[cubic-bezier(0.4,0,0.2,1)]')).toBe(
      `.anim-fade_300_\\[cubic-bezier\\(0\\.4\\,0\\,0\\.2\\,1\\)\\] { animation: var(--animname-fade, var(--fade, fade)) var(--animdur-fade, var(--animdur, var(--animdur-300, var(--time-300, 300ms)))) cubic-bezier(0.4,0,0.2,1); }`,
    );
  });

  it('animation with custom value', () => {
    expect(convert('anim=fade_300ms_ease_infinite')).toBe(
      `.anim\\=fade_300ms_ease_infinite { animation: fade 300ms ease infinite; }`,
    );
  });

  it('animation-name', () => {
    expect(convert('animname-fade')).toBe(
      `.animname-fade { animation-name: var(--animname-fade, var(--fade, fade)); }`,
    );
  });

  it('animation-name with custom value', () => {
    expect(convert('animname=slideIn')).toBe(
      `.animname\\=slideIn { animation-name: slideIn; }`,
    );
  });

  it('animation-duration', () => {
    expect(convert('animdur-300')).toBe(
      `.animdur-300 { animation-duration: var(--animdur-300, var(--time-300, 300ms)); }`,
    );
  });

  it('animation-duration with custom value', () => {
    expect(convert('animdur=500ms')).toBe(
      `.animdur\\=500ms { animation-duration: 500ms; }`,
    );
  });

  it('animation-delay', () => {
    expect(convert('animdel-200')).toBe(
      `.animdel-200 { animation-delay: var(--animdel-200, var(--time-200, 200ms)); }`,
    );
  });

  it('animation-delay with custom value', () => {
    expect(convert('animdel=1s')).toBe(
      `.animdel\\=1s { animation-delay: 1s; }`,
    );
  });

  it('animation-timing-function', () => {
    expect(convert('animtf-ease')).toBe(
      `.animtf-ease { animation-timing-function: var(--animtf-ease, var(--ease, ease)); }`,
    );
  });

  it('animation-timing-function with ease-in-out', () => {
    expect(convert('animtf-ease-in-out')).toBe(
      `.animtf-ease-in-out { animation-timing-function: var(--animtf-ease-in-out, var(--ease-in-out, ease-in-out)); }`,
    );
  });

  it('animation-timing-function with custom value', () => {
    expect(convert('animtf=[cubic-bezier(0.4,0,0.2,1)]')).toBe(
      `.animtf\\=\\[cubic-bezier\\(0\\.4\\,0\\,0\\.2\\,1\\)\\] { animation-timing-function: cubic-bezier(0.4,0,0.2,1); }`,
    );
  });

  it('animation-iteration-count', () => {
    expect(convert('animic-infinite')).toBe(
      `.animic-infinite { animation-iteration-count: var(--animic-infinite, var(--infinite, infinite)); }`,
    );
  });

  it('animation-iteration-count with number', () => {
    expect(convert('animic-3')).toBe(
      `.animic-3 { animation-iteration-count: var(--animic-3, 3); }`,
    );
  });

  it('animation-direction', () => {
    expect(convert('animdir-reverse')).toBe(
      `.animdir-reverse { animation-direction: var(--animdir-reverse, var(--reverse, reverse)); }`,
    );
  });

  it('animation-direction alternate', () => {
    expect(convert('animdir-alternate')).toBe(
      `.animdir-alternate { animation-direction: var(--animdir-alternate, var(--alternate, alternate)); }`,
    );
  });

  it('animation-fill-mode', () => {
    expect(convert('animfm-forwards')).toBe(
      `.animfm-forwards { animation-fill-mode: var(--animfm-forwards, var(--forwards, forwards)); }`,
    );
  });

  it('animation-fill-mode both', () => {
    expect(convert('animfm-both')).toBe(
      `.animfm-both { animation-fill-mode: var(--animfm-both, var(--both, both)); }`,
    );
  });

  it('animation-play-state', () => {
    expect(convert('animps-paused')).toBe(
      `.animps-paused { animation-play-state: var(--animps-paused, var(--paused, paused)); }`,
    );
  });

  it('animation-play-state running', () => {
    expect(convert('animps-running')).toBe(
      `.animps-running { animation-play-state: var(--animps-running, var(--running, running)); }`,
    );
  });

  it('animation with important', () => {
    expect(convert('!anim-fade')).toBe(
      `.\\!anim-fade { animation: var(--animname-fade, var(--fade, fade)) !important; }`,
    );
  });

  it('animation-composition', () => {
    expect(convert('animcomp-add')).toBe(
      `.animcomp-add { animation-composition: var(--animcomp-add, var(--add, add)); }`,
    );
  });

  it('animation-composition replace', () => {
    expect(convert('animcomp-replace')).toBe(
      `.animcomp-replace { animation-composition: var(--animcomp-replace, var(--replace, replace)); }`,
    );
  });
});
