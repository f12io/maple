export function motionVariant(which: string) {
  if (which === 'safe')
    return (css: any) => ({
      wrap: `@media (prefers-reduced-motion: no-preference) { {{selector}} { ${Object.entries(
        css,
      )
        .map(([k, v]) => `${k}: ${v};`)
        .join(' ')} } }`,
    });
  if (which === 'reduce')
    return (css: any) => ({
      wrap: `@media (prefers-reduced-motion: reduce) { {{selector}} { ${Object.entries(
        css,
      )
        .map(([k, v]) => `${k}: ${v};`)
        .join(' ')} } }`,
    });
  return (css: any) => false;
}
