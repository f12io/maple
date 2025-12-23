import { generateForClass } from './generator';

export function startObserver() {
  const observer = new MutationObserver((muts) => {
    for (let mut of muts) {
      const el = mut.target as Element;
      if (!el.classList) return;
      for (const raw of el.classList) {
        generateForClass(raw);
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
