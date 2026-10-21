import { afterEach, describe, expect, it } from 'vitest';
import { OPTIONS } from '../src/core/constants/config';
import { processClassList } from '../src/core/generator';

/**
 * A media or container variant beats its own base whenever its query
 * matches, because the base bucket sits in a nested layer that the
 * unlayered variant buckets outrank. Layer order is what `!important`
 * reverses, so the one case this does not cover is both sides being
 * important: there the base wins. These tests pin both halves, since
 * the alternative — one layer, ordered by source — hands precedence to
 * specificity and lets any selector-bearing rule jump the query that
 * should win.
 */
const BASE = 'rgb(255, 0, 0)';
const VARIANT = 'rgb(0, 128, 0)';

const hosts: Array<Element> = [];

function render(cls: string, containerClass?: string) {
  return read(cls, containerClass, (style) => style.backgroundColor);
}

function read(
  cls: string,
  containerClass: string | undefined,
  pick: (style: CSSStyleDeclaration) => string,
) {
  let parent: HTMLElement = document.body;

  if (containerClass) {
    const host = document.createElement('div');
    host.className = containerClass;
    document.body.append(host);
    processClassList(host);
    hosts.push(host);
    parent = host;
  }

  const el = document.createElement('div');
  el.className = cls;
  parent.append(el);
  processClassList(el);
  hosts.push(el);

  return pick(getComputedStyle(el));
}

function color(cls: string, containerClass?: string) {
  return read(cls, containerClass, (style) => style.color);
}

afterEach(() => {
  for (const host of hosts) host.remove();
  hosts.length = 0;
});

describe('Important variants', () => {
  describe('Viewport media variant against its base', () => {
    it('wins when neither is important', () => {
      expect(render('bgc=red @mnw=1px:bgc=green')).toBe(VARIANT);
    });

    it('loses when both are important, as layer order reverses', () => {
      expect(render('!bgc=red !@mnw=1px:bgc=green')).toBe(BASE);
    });

    it('wins when only the variant is important', () => {
      expect(render('bgc=red !@mnw=1px:bgc=green')).toBe(VARIANT);
    });

    it('loses to an important base, which outranks a normal variant', () => {
      expect(render('!bgc=red @mnw=1px:bgc=green')).toBe(BASE);
    });
  });

  describe('Container query variant against its base', () => {
    it('wins when neither is important', () => {
      expect(render('bgc=red mnw=1px:bgc=green', 'cnt w=500px')).toBe(VARIANT);
    });

    it('loses when both are important, as layer order reverses', () => {
      expect(render('!bgc=red !mnw=1px:bgc=green', 'cnt w=500px')).toBe(BASE);
    });
  });

  describe('Selector variant against its base', () => {
    // same layer either way, so specificity decides and importance is moot
    it('wins when both are important', () => {
      expect(render('!bgc=red !&.on:bgc=green on')).toBe(VARIANT);
    });
  });

  describe('With the important config flag', () => {
    /**
     * Fresh utilities, because a class generated earlier in this file is
     * cached with the declarations it had then: reusing one would measure
     * the normal rules rather than the important ones the flag produces.
     */
    it('leaves query variants losing to their base', () => {
      OPTIONS.important = 1;

      try {
        expect(color('c=red @mnw=1px:c=green')).toBe(BASE);
        expect(color('c=red mnw=1px:c=green', 'cnt w=500px')).toBe(BASE);
      } finally {
        OPTIONS.important = 0;
      }
    });
  });
});
