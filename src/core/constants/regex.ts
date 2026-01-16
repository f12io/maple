import { SELECTOR_REPLACEMENTS } from './dictionaries';
import { ALL_UNITS, ANGLE_UNITS } from './units';

export const REGEX_UNSAFE_CLASS_CHARS = /([^a-zA-Z0-9_-])/g;
export const REGEX_LOWERCASE_UPPERCASE = /([a-z])([A-Z])/g;
export const REGEX_TO_CAMEL_CASE = /[^a-zA-Z0-9]+(.)/g;
export const REGEX_COLOR_TOKEN =
  /^([a-z]+(?:-[a-z]+)*)(?:-(\d{1,4}))?(?:\/(\d{1,3}))?$/i;
export const REGEX_NUMBER_WITH_UNIT = /^([\d.]+)([a-z]*)/;
export const REGEX_NON_FUNCTION_PARAM_SPLITTER = /(?<=[^|]["'\])])__/;
export const REGEX_BACKDROP_PREFIX = /^bd/;
export const REGEX_COLOR_HEX = /^#(?:[0-9a-f]{3,4}){1,2}$/i;
export const REGEX_COLOR_FUNCTIONAL =
  /^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\s*\([a-z0-9\s%.,/+-]+\)$/i;
export const REGEX_GRADIENT_DIRECTION =
  /^(to|from|at|in|circle|ellipse|closest-side|closest-corner|farthest-corner|farthest-side)$/i;
export const REGEX_RESERVED_KEYWORDS =
  /^(initial|inherit|unset|revert|revert-layer|none|auto|transparent|currentColor)$/i;

// This creates a pattern like: /^([0-9]*\.?[0-9]+)?(px|rem|vmin|vmax|...)?$/i
export const REGEX_NUMBER_VALUE = new RegExp(
  `^([0-9]*\\.?[0-9]+)?(${ALL_UNITS.join('|')})?$`,
  'i',
);

export const REGEX_ANGLE_VALUE = new RegExp(
  `^([0-9]*\\.?[0-9]+)?(${ANGLE_UNITS.join('|')})?$`,
  'i',
);

export const REGEX_SELECTOR_REPLACEMENTS = new RegExp(
  `:(${Object.keys(SELECTOR_REPLACEMENTS)
    .sort((a, b) => b.length - a.length)
    .join('|')})(?![-\\w])`,
  'g',
);
