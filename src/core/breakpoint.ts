import { DEFAULT_BREAKPOINTS } from './constants/config';

function getBreakpoints() {
  const url = new URL(import.meta.url);
  const customBreakpoints: Record<string, string> = Array.from(
    url.searchParams.entries(),
  ).reduce<Record<string, string>>(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {},
  );

  return {
    ...DEFAULT_BREAKPOINTS,
    ...customBreakpoints,
  };
}

export const BREAKPOINTS = getBreakpoints();
