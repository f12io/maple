import { isMergingInProgress, processClassList } from './generator';

export function startObserver() {
  if (typeof document === 'undefined') return;

  let streaming = 1;

  const observer = new MutationObserver((muts) => {
    if (isMergingInProgress()) return;

    for (const mut of muts) {
      if (mut.type === 'childList') {
        for (const node of mut.addedNodes) {
          if (node instanceof Element) {
            processClassList(node);

            if (node.childElementCount > 0 && !streaming) {
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

    streaming = 0;
  });

  processClassList(document.documentElement);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => observer.disconnect();
}
