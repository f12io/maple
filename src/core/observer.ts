import { generateStylesFromClass } from './generator';

export function startObserver() {
  if (typeof document === 'undefined') return;

  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      if (!(mut.target instanceof Element)) continue;

      for (const srcClass of mut.target.classList) {
        generateStylesFromClass(srcClass);
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
