import { describe, expect, it } from 'vitest';
import { convert } from './helpers/convert.helper';

describe('Animation', () => {
  it('animation with name', () => {
    expect(convert('anim-fade')).toBe(
      `.anim-fade { animation: var(--anim-fade, var(--time-fade, var(--fade, fade))); }`,
    );
  });

  it('animation with name and duration', () => {
    expect(convert('anim-fade_300')).toBe(
      `.anim-fade_300 { animation: var(--anim-fade, var(--time-fade, var(--fade, fade))) var(--anim-300, var(--time-300, 300ms)); }`,
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
      `.\\!anim-fade { animation: var(--anim-fade, var(--time-fade, var(--fade, fade))) !important; }`,
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
