export function ariaVariant(
  css: any,
  cfg?: any,
  variant?: string | Record<string, string>
) {
  if (!css) return false;

  if (!(variant as string) || !(variant as string).startsWith('aria-'))
    return false;
  const attr = (variant as string).replace('aria-', '');
  return {
    wrap: `[aria-${attr}="true"] {{selector}} { ${Object.entries(css)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ')} }`,
  };
}
