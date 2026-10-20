import { afterEach, describe, expect, it } from 'vitest';
import { OPTIONS } from '../src/core/constants/config';
import { processClassList } from '../src/core/generator';

/**
 * A media or container variant must beat its own base whenever its query
 * matches, and that has to hold for important declarations too. The base
 * bucket and the variant buckets therefore live in one layer, ordered by
 * source: a layer boundary between them would reverse under `!important`
 * and hand the base the win — for every declaration at once when the
 * `important` config flag is on.
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

    it('wins when both are important', () => {
      expect(render('!bgc=red !@mnw=1px:bgc=green')).toBe(VARIANT);
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

    it('wins when both are important', () => {
      expect(render('!bgc=red !mnw=1px:bgc=green', 'cnt w=500px')).toBe(
        VARIANT,
      );
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
    it('keeps media and container variants winning', () => {
      OPTIONS.important = 1;

      try {
        expect(color('c=red @mnw=1px:c=green')).toBe(VARIANT);
        expect(color('c=red mnw=1px:c=green', 'cnt w=500px')).toBe(VARIANT);
      } finally {
        OPTIONS.important = 0;
      }
    });
  });
});
