export function darkMode() {
  // default: class strategy
  return (css: any) => ({
    wrap: `.dark {{selector}} { ${Object.entries(css)
      .map(([k, v]) => `${k}: ${v};`)
      .join(' ')} }`,
  });
}
