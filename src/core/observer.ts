import { generateStylesFromClass } from './generator';

export function startObserver() {
  if (typeof document === 'undefined') return;

  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      if (mut.type === 'childList') {
        for (const node of mut.addedNodes) {
          if (node instanceof Element) {
            for (const srcClass of node.classList) {
              generateStylesFromClass(srcClass);
            }
          }
        }
      }

      if (mut.type === 'attributes' && mut.target instanceof Element) {
        for (const srcClass of mut.target.classList) {
          generateStylesFromClass(srcClass);
        }
      }
    }
  });

  for (const srcClass of document.documentElement.classList) {
    generateStylesFromClass(srcClass);
  }

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => observer.disconnect();
}
