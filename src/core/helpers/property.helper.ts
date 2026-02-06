import { PRECALCULATED_PROP_TYPES } from 'internal:precalculated-prop-types';
import { PROP_TYPE_CACHE } from '../constants/caches';
import { CHAR_DASH, REF_CHAR_VAR_PREFIX } from '../constants/chars';
import {
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
  PROP_TYPE_VARIABLE,
} from '../constants/config';
import {
  REGEX_ANGLE_VALUE,
  REGEX_COLOR_FUNCTIONAL,
  REGEX_COLOR_HEX,
  REGEX_GRADIENT_DIRECTION,
  REGEX_NUMBER_VALUE,
  REGEX_RESERVED_KEYWORDS,
} from '../constants/regex';
import {
  DEFAULT_ANGLE_VALUE,
  DEFAULT_COLOR_VALUE,
  DEFAULT_SPACE_VALUE,
  DEFAULT_TIME_VALUE,
} from '../constants/units';
import { setCacheItem } from './cache.helper';

export function resolveType(
  propKeyKebab: string,
  propKeyCamel: string,
): number {
  let type = PROP_TYPE_OTHER;

  if (PROP_TYPE_CACHE.has(propKeyKebab)) {
    return PROP_TYPE_CACHE.get(propKeyKebab) ?? type;
  }

  if (propKeyKebab.startsWith(REF_CHAR_VAR_PREFIX)) {
    type = PROP_TYPE_VARIABLE;
    setCacheItem(PROP_TYPE_CACHE, propKeyKebab, type);
    return type;
  }

  if (propKeyCamel in PRECALCULATED_PROP_TYPES) {
    type = PRECALCULATED_PROP_TYPES[propKeyCamel];
    setCacheItem(PROP_TYPE_CACHE, propKeyKebab, type);
    return type;
  }

  if (typeof CSS === 'undefined') {
    return type;
  }

  if (
    CSS.supports(propKeyKebab, DEFAULT_SPACE_VALUE) ||
    CSS.supports(propKeyKebab, DEFAULT_ANGLE_VALUE) ||
    CSS.supports(propKeyKebab, DEFAULT_TIME_VALUE)
  ) {
    type = PROP_TYPE_SPACE;
  } else if (CSS.supports(propKeyKebab, DEFAULT_COLOR_VALUE)) {
    type = PROP_TYPE_COLOR;
  }

  setCacheItem(PROP_TYPE_CACHE, propKeyKebab, type);

  return type;
}

export function isKnownProperty(propKeyKebab: string): 1 | 0 {
  if (
    propKeyKebab in PRECALCULATED_PROP_TYPES ||
    PROP_TYPE_CACHE.has(propKeyKebab)
  ) {
    return 1;
  }

  if (typeof CSS === 'undefined') {
    return 0;
  }

  return CSS.supports(propKeyKebab, 'inherit') ? 1 : 0;
}

export function isKnownNumberValue(val: string): 1 | 0 {
  if (!val) return 0;

  val = val.charCodeAt(0) === CHAR_DASH ? val.slice(1) : val;
  return REGEX_NUMBER_VALUE.test(val) ? 1 : 0;
}

export function isKnownAngleValue(val: string): 1 | 0 {
  if (!val) return 0;

  val = val.charCodeAt(0) === CHAR_DASH ? val.slice(1) : val;
  return REGEX_ANGLE_VALUE.test(val) ? 1 : 0;
}

export function isKnownColorValue(val: string): boolean {
  return REGEX_COLOR_HEX.test(val) || REGEX_COLOR_FUNCTIONAL.test(val);
}

export function isReservedKeyword(val: string): boolean {
  return REGEX_RESERVED_KEYWORDS.test(val);
}

export function isGradientDirection(value: string): boolean {
  return REGEX_GRADIENT_DIRECTION.test(value);
}
