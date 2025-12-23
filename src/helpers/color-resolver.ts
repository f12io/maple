export function resolveColor(token: string): string | null {
  const ts = token.match(/^([a-z]+)-?(\d{1,3})?(?:\/(\d{1,3}))?$/i);
  if (!ts) {
    return null;
  }

  const name = ts[1];
  const tone = Number(ts[2]) || 500;
  const opacity = ts[3] ? Number(ts[3]) : null;

  const amount = (500 - tone) / 500;
  const l = `calc(calc(l + calc(${
    amount > 0 ? 'calc(1 - l)' : 'l'
  } * ${amount})) * var(--ligtines-factor, 1))`;
  const c = `calc(c * var(--chroma-factor, 1))`;
  const h = `calc(h * var(--hue-factor, 1))`;
  return `oklch(from var(--color-${name}, ${name}) ${l} ${c} ${h} / ${
    !opacity ? 'alpha' : opacity + '%'
  })`;
}
