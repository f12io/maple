import { afterEach, describe, expect, it } from 'vitest';
import { OPTIONS } from '../src/core/constants/config';
import { processClassList } from '../src/core/generator';

/**
 * The `important` script flag marks every declaration `!important`,
 * which reverses how the browser reads layer order. The engine lays the
 * depth ordering out backwards in that mode so precedence still means
 * the same thing as in the default one, and this file checks the two
 * agree. The flag is set before any rule is generated, as the script
 * URL would: switching it later would leave a page with rules laid out
 * both ways.
 */
OPTIONS.important = 1;

const hosts: Array<Element> = [];

function styled(cls: string, property: string, containerClass?: string) {
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
  el.className = `${cls} on`;
  parent.append(el);
  processClassList(el);
  hosts.push(el);

  return getComputedStyle(el).getPropertyValue(property);
}

afterEach(() => {
  for (const host of hosts) host.remove();
  hosts.length = 0;
});

describe('Important mode', () => {
  it('marks declarations important', () => {
    const el = document.createElement('div');
    el.className = 'bgc=red';
    document.body.append(el);
    processClassList(el);
    hosts.push(el);

    expect(getComputedStyle(el).backgroundColor).toBe('rgb(255, 0, 0)');
  });

  describe('a longhand beats the shorthand that sets it', () => {
    it('text-decoration-line over text-decoration', () => {
      expect(
        styled(
          'tdeco=none &.on:text-decoration-line=underline',
          'text-decoration-line',
        ),
      ).toBe('underline');
    });

    it('background-image over background', () => {
      expect(
        styled(
          'background=gray &.on:bgimg=[linear-gradient(red,blue)]',
          'background-image',
        ),
      ).toBe('linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))');
    });

    it('padding-left over padding', () => {
      expect(styled('p=10px &.on:pl=20px', 'padding-left')).toBe('20px');
    });

    it('a physical property over its logical peer', () => {
      expect(styled('mx-4 ml-8', 'margin-left')).toBe('32px');
    });
  });

  describe('matches the default mode in the other direction too', () => {
    it('a variant on the shorthand does not beat a base longhand', () => {
      expect(
        styled(
          'bgimg=[linear-gradient(red,blue)] &.on:background=gray',
          'background-image',
        ),
      ).toBe('linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))');
    });
  });

  describe('variants keep winning over their base', () => {
    it('viewport media variant', () => {
      expect(styled('c=red @mnw=1px:c=green', 'color')).toBe('rgb(0, 128, 0)');
    });

    it('container query variant', () => {
      expect(styled('c=red mnw=1px:c=green', 'color', 'cnt w=500px')).toBe(
        'rgb(0, 128, 0)',
      );
    });

    it('selector variant', () => {
      expect(styled('bgc=red &.on:bgc=blue', 'background-color')).toBe(
        'rgb(0, 0, 255)',
      );
    });
  });
});
