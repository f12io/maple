import { generateStylesFromClass } from './generator';

export function startObserver() {
  if (typeof document === 'undefined') return;

  let streaming = 1;

  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      if (mut.type === 'childList') {
        for (const node of mut.addedNodes) {
          if (node instanceof Element) {
            for (const srcClass of node.classList) {
              generateStylesFromClass(srcClass);
            }

            if (node.childElementCount > 0 && !streaming) {
              const children = node.getElementsByTagName('*');

              for (const child of children) {
                for (const srcClass of child.classList) {
                  generateStylesFromClass(srcClass);
                }
              }
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

    streaming = 0;
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
