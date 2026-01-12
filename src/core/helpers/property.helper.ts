import { PRECALCULATED_PROP_TYPES } from 'internal:precalculated-prop-types';
import {
  CHAR_DASH,
  DEFAULT_ANGLE_UNIT,
  DEFAULT_SPACE_UNIT,
  DEFAULT_TIME_UNIT,
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
  REGEX_CSS_NUMBER_VALUE,
} from '../constants';

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

export function isKnownNumberValue(unit: string): boolean {
  if (!unit) return false;

  unit = unit.charCodeAt(0) === CHAR_DASH ? unit.slice(1) : unit;
  return REGEX_CSS_NUMBER_VALUE.test(unit);
}
