import { lockAliases } from './aliases';
import { processClassList } from './generator';

let observer: MutationObserver | undefined;

export function startObserver() {
  if (typeof document === 'undefined') return;
  if (observer) return stopObserver;

  observer = new MutationObserver((muts) => {
    /**
     * An insertion is reported; children the node already carried are
     * not. The parser inserts elements one by one, so each gets its
     * own record and walking would redo the document once per
     * ancestor. A subtree built in script (`innerHTML`, a clone, a
     * framework mount) arrives assembled, so only its top node is
     * reported. So walk only when a direct child has no record.
     */
    const added = new Set<Element>();

    for (const mut of muts) {
      if (mut.type !== 'childList') continue;

      for (const node of mut.addedNodes) {
        if (node instanceof Element) added.add(node);
      }
    }

    for (const mut of muts) {
      if (mut.type === 'childList') {
        for (const node of mut.addedNodes) {
          if (node instanceof Element) {
            processClassList(node);

            if (node.childElementCount > 0 && hasUnreportedChild(node, added)) {
              const children = node.getElementsByTagName('*');

              for (const child of children) {
                processClassList(child);
              }
            }
          }
        }
      }

      if (mut.type === 'attributes' && mut.target instanceof Element) {
        processClassList(mut.target);
      }
    }
  });

  processClassList(document.documentElement);
  lockAliases();

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  return stopObserver;
}

/**
 * Walks the direct children only. An unreported element always sits
 * under a node that carries it as a direct child, so one unreported
 * child is enough to know the subtree needs processing, and the check
 * costs a set lookup per child instead of a full subtree walk.
 */
function hasUnreportedChild(node: Element, added: Set<Element>): boolean {
  for (let child = node.firstElementChild; child; ) {
    if (!added.has(child)) return true;

    child = child.nextElementSibling;
  }

  return false;
}

function stopObserver() {
  observer?.disconnect();
  observer = undefined;
}
