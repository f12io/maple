import { generateStylesFromClass } from './generator';

export function startObserver() {
  const observer = new MutationObserver((muts) => {
    for (const { target } of muts) {
      if (!(target instanceof Element)) continue;

      for (const sourceClass of target.classList) {
        generateStylesFromClass(sourceClass);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => observer.disconnect();
}
