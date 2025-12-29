import { defaultBreakpoints } from '../constants/default-breakpoints';

export const getBreakpoints = () => {
  const url = new URL(import.meta.url);
  const customBreakpoints: Record<string, string> = url.searchParams
    .entries()
    .reduce((acc, [key, value]) => {
      if (!isNaN(parseInt(value)) && key !== '@min' && key !== '@max') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
  return {
    ...defaultBreakpoints,
    ...customBreakpoints,
  };
};
