import { PRECALCULATED_PROP_TYPES } from 'internal:precalculated-prop-types';
import { CHAR_DASH } from '../constants/chars';
import {
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
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
  DEFAULT_ANGLE_UNIT,
  DEFAULT_SPACE_UNIT,
  DEFAULT_TIME_UNIT,
} from '../constants/units';

let element: HTMLDivElement | undefined;

export function resolveType(
  propKeyKebab: string,
  propKeyCamel: string,
): number {
  // Return precalculated type, if available
  if (propKeyCamel in PRECALCULATED_PROP_TYPES) {
    return PRECALCULATED_PROP_TYPES[propKeyCamel];
  }

  // Return other type, if we're not in a browser
  if (typeof document === 'undefined') {
    return PROP_TYPE_OTHER;
  }

  element ??= document.createElement('div');
  let type = PROP_TYPE_OTHER;

  element.style.setProperty(propKeyKebab, '#000000');

  if (element.style.getPropertyValue(propKeyKebab)) {
    type = PROP_TYPE_COLOR;
  }

  const spaceValue = '1' + DEFAULT_SPACE_UNIT;
  element.style.setProperty(propKeyKebab, spaceValue);

  if (element.style.getPropertyValue(propKeyKebab) === spaceValue) {
    type = PROP_TYPE_SPACE;
  } else {
    const timeValue = '1' + DEFAULT_TIME_UNIT;
    element.style.setProperty(propKeyKebab, timeValue);

    if (element.style.getPropertyValue(propKeyKebab) === timeValue) {
      type = PROP_TYPE_SPACE;
    } else {
      const angleValue = '1' + DEFAULT_ANGLE_UNIT;
      element.style.setProperty(propKeyKebab, angleValue);

      if (element.style.getPropertyValue(propKeyKebab) === angleValue) {
        type = PROP_TYPE_SPACE;
      }
    }
  }

  element.style.setProperty(propKeyKebab, null);

  return type;
}

export function isKnownProperty(propKeyCamel: string): boolean {
  // Return precalculated type, if available
  if (propKeyCamel in PRECALCULATED_PROP_TYPES) {
    return true;
  }

  // Return other type, if we're not in a browser
  if (typeof document === 'undefined') {
    return false;
  }

  element ??= document.createElement('div');

  return propKeyCamel in element.style;
}

export function isKnownNumberValue(val: string): boolean {
  if (!val) return false;

  val = val.charCodeAt(0) === CHAR_DASH ? val.slice(1) : val;
  return REGEX_NUMBER_VALUE.test(val);
}

export function isKnownAngleValue(val: string): boolean {
  if (!val) return false;

  val = val.charCodeAt(0) === CHAR_DASH ? val.slice(1) : val;
  return REGEX_ANGLE_VALUE.test(val);
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
