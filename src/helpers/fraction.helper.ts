export function resolveFraction(value: string): string | null {
  if (!value.includes('/')) return null;
  const [num, den] = value.split('/').map(Number);
  const val = Math.round((num / den) * 1000000) / 10000;
  if (!num || !den) return null;
  return `${val}%`;
}
