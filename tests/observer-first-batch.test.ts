import { describe, expect, it } from 'vitest';
import { startObserver } from '../src/core/observer';

/**
 * The observer skips the descendants of an added element while its
 * `streaming` flag is set, which covers the whole first mutation batch.
 * That holds for content the HTML parser inserts, because the parser
 * inserts every element on its own and each one arrives as its own
 * record. It does not hold for a subtree built in script — an
 * `innerHTML` assignment, a cloned template, a framework mounting —
 * where only the top node is reported and the descendants are never
 * seen again.
 *
 * Own file: `streaming` is module state, so the first batch can only be
 * observed in a fresh module.
 */
function find(root: Element, selector: string): Element {
  const found = root.querySelector(selector);

  if (!found) throw new Error(`missing ${selector}`);

  return found;
}

describe('Observer first batch', () => {
  it('compiles the insides of an element added in the first batch', async () => {
    const stop = startObserver();

    try {
      const tree = document.createElement('div');
      tree.className = 'p-4';
      tree.innerHTML = '<span class="mt-5"><b class="mr-3">x</b></span>';
      document.body.append(tree);

      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(getComputedStyle(tree).paddingTop).toBe('16px');
      expect(getComputedStyle(find(tree, 'span')).marginTop).toBe('20px');
      expect(getComputedStyle(find(tree, 'b')).marginRight).toBe('12px');

      tree.remove();
    } finally {
      stop?.();
    }
  });

  /**
   * The parser-shaped case the skip exists for: each element arrives on
   * its own, so the subtree is covered by its own records and must not
   * need a walk to be compiled.
   */
  it('compiles elements inserted one at a time', async () => {
    const stop = startObserver();

    try {
      const parent = document.createElement('div');
      parent.className = 'p-7';
      document.body.append(parent);

      const child = document.createElement('span');
      child.className = 'mt-9';
      parent.append(child);

      const grandchild = document.createElement('b');
      grandchild.className = 'mr-4';
      child.append(grandchild);

      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(getComputedStyle(parent).paddingTop).toBe('28px');
      expect(getComputedStyle(child).marginTop).toBe('36px');
      expect(getComputedStyle(grandchild).marginRight).toBe('16px');

      parent.remove();
    } finally {
      stop?.();
    }
  });
});
