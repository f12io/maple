import { generateStylesFromClass } from './generator';

export function startObserver() {
  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      if (!(mut.target instanceof Element)) continue;

      for (const sourceClass of mut.target.classList) {
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
