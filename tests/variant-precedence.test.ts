import { afterEach, describe, expect, it } from 'vitest';
import { collectAliases } from '../src/core/aliases';
import { processClassList } from '../src/core/generator';

/**
 * A query variant outranks its base whatever selectors are involved,
 * because the base bucket sits in a nested layer that the unlayered
 * query buckets beat — layer order outranks specificity. Without that
 * asymmetry precedence falls to specificity, and every rule carrying a
 * selector jumps ahead of the query that should win: a state variant,
 * a parent selector, or the combined selector an alias override emits
 * to settle two aliases writing the same property.
 *
 * The alias case is the one that cannot be seen coming from the markup,
 * since the engine raises that specificity itself.
 */
const hosts: Array<Element> = [];

function inContainer(cls: string, property: string) {
  const host = document.createElement('div');
  host.className = 'cnt w=[1000px] d=grid';
  document.body.append(host);
  processClassList(host);
  hosts.push(host);

  const el = document.createElement('div');
  el.className = cls;
  host.append(el);
  processClassList(el);

  return getComputedStyle(el).getPropertyValue(property);
}

afterEach(() => {
  for (const host of hosts) host.remove();
  hosts.length = 0;
  collectAliases([]);
});

describe('Variant precedence', () => {
  describe('against an alias override', () => {
    it('keeps the later alias query value when an earlier alias is overridden', () => {
      collectAliases([
        '--alias-x=z=2;alignSelf=center',
        '--alias-y=alignSelf=start;md:alignSelf=center',
      ]);

      expect(inContainer('@x @y', 'align-self')).toBe('center');
    });

    it('keeps the later alias query value for a shorthand', () => {
      collectAliases(['--alias-a=z=3;p-4', '--alias-b=p-2;md:p-8']);

      expect(inContainer('@a @b', 'padding-top')).toBe('32px');
    });

    it('still lets the later alias win in the base context', () => {
      collectAliases(['--alias-c=z=4;p-4', '--alias-d=p-2']);

      expect(inContainer('@c @d', 'padding-top')).toBe('8px');
    });
  });

  describe('against a selector variant', () => {
    it('outranks a state variant', () => {
      expect(inContainer('p-2 &.on:p-4 md:p-8 on', 'padding-top')).toBe('32px');
    });

    it('outranks a parent selector', () => {
      expect(inContainer('^.cnt:pl-4 md:pl-8', 'padding-left')).toBe('32px');
    });

    it('outranks a child selector imposed by the container', () => {
      const host = document.createElement('div');
      host.className = 'cnt w=[1000px] /*:mr-4';
      document.body.append(host);
      processClassList(host);
      hosts.push(host);

      const el = document.createElement('div');
      el.className = 'md:mr-8';
      host.append(el);
      processClassList(el);

      expect(getComputedStyle(el).marginRight).toBe('32px');
    });
  });

  describe('without a query in play', () => {
    // specificity still settles these, and importance leaves it alone
    it('lets a state variant beat its base', () => {
      expect(inContainer('m-2 &.on:m-4 on', 'margin-top')).toBe('16px');
    });

    it('lets a state variant beat its base when both are important', () => {
      expect(inContainer('!m-3 !&.on:m-5 on', 'margin-top')).toBe('20px');
    });
  });
});
