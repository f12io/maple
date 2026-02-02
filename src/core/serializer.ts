import { VARIABLE_CACHE } from './constants/caches';
import {
  REF_CHAR_CUSTOM,
  REF_CHAR_FUNCTION_COMMA,
  REF_CHAR_NON_FUNCTION_START,
  REF_CHAR_PREDEFINED,
  REF_CHAR_SPACE,
  REF_CHAR_VALUE_PARTS,
} from './constants/chars';
import {
  COLOR_MID_TONE,
  OPTIONS,
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
} from './constants/config';
import {
  ABBREVIATIONS,
  ABBREVIATIONS_REVERSE,
  BACKDROP_FILTER_KEYS,
  CONTAINER_TYPES,
  CSS_VARIABLE_CATEGORY,
  FILTER_KEYS,
  FLEX_H,
  FLEX_V,
  FUNCTION_KEYS,
  PROP_UNIT_MAP,
  SELECTOR_REPLACEMENTS,
  TRANSFORM_KEYS,
  VENDOR_PREFIXES,
} from './constants/dictionaries';
import {
  REGEX_BACKDROP_PREFIX,
  REGEX_COLOR_TOKEN,
  REGEX_NON_FUNCTION_PARAM_SPLITTER,
  REGEX_SELECTOR_REPLACEMENTS,
} from './constants/regex';
import { COVER_UNITS, DEFAULT_SPACE_UNIT, ONE_UNITS } from './constants/units';
import {
  isGradientDirection,
  isKnownAngleValue,
  isKnownColorValue,
  isKnownNumberValue,
  isKnownProperty,
  isReservedKeyword,
} from './helpers/property.helper';
import {
  escapeVariable,
  removeBrackets,
  split,
  splitAtFirstOccurrence,
  startsWithNegative,
  toCamelCase,
  toKebabCase,
} from './helpers/string.helper';
import { insertRefVar } from './stylesheet';
import { Modifiers, ParsedClass, ValueModifiers } from './types';

// Applied to classes usign strict equality (as is utility values)
const CUSTOM_MODIFIERS: Modifiers = {
  cnt: serializeContainer,
};

// Applied to classes using predefined css variables
const PREDEFINED_MODIFIERS: Modifiers = {
  cols: serializeGridTemplate,
  rows: serializeGridTemplate,
  col: serializeGridItem,
  row: serializeGridItem,
  area: serializeGridItem,
  o: serializePercentageToDecimal,
  opacity: serializePercentageToDecimal,
  wc: serializePropsInValue,
  tsprop: serializePropsInValue,
};

export const TYPE_MODIFIERS: Modifiers = {
  [PROP_TYPE_OTHER]: serializeOtherValue,
  [PROP_TYPE_SPACE]: serializeNumberValue,
  [PROP_TYPE_COLOR]: serializeColorValue,
};

export const VALUE_MODIFIERS: ValueModifiers = {
  ts: serializeTransitionValue,
  bshadow: serializeShadowValue,
  tshadow: serializeShadowValue,
};

export const PART_MODIFIERS: ValueModifiers = {
  bgimg: serializeBackgroundImageParts,
  bg: serializeBackgroundImageParts,
};

const TRANSFORM_VARIABLES = createVariables(
  TRANSFORM_KEYS,
  ABBREVIATIONS_REVERSE.transform,
);
const FILTER_VARIABLES = createVariables(FILTER_KEYS, 'filter');
const BACKDROP_FILTER_VARIABLES = createVariables(
  BACKDROP_FILTER_KEYS,
  'filter',
);
const INTERNAL_DECISION_MODIFIERS: Modifiers = {
  square: (p) =>
    serializeRepeat({ ...p, propType: PROP_TYPE_SPACE }, 'width', 'height'),
  ...Object.keys(TRANSFORM_KEYS).reduce(
    (acc, key) => ({ ...acc, [key]: serializeTransform }),
    {},
  ),
  ...Object.keys(FILTER_KEYS).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (p: ParsedClass) =>
        serializeFilter(p, 'filter', FILTER_VARIABLES, FILTER_KEYS),
    }),
    {},
  ),
  ...Object.keys(BACKDROP_FILTER_KEYS).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (p: ParsedClass) =>
        serializeFilter(
          p,
          'backdrop-filter',
          BACKDROP_FILTER_VARIABLES,
          BACKDROP_FILTER_KEYS,
        ),
    }),
    {},
  ),
  // Flex layout shortcuts
  fxrow: (p) => serializeFlexLayout(p, 'row', 0),
  fxcol: (p) => serializeFlexLayout(p, 'column', 0),
  ifxrow: (p) => serializeFlexLayout(p, 'row', 1),
  ifxcol: (p) => serializeFlexLayout(p, 'column', 1),
  fxrowself: (p) => serializeFlexSelf(p, 'row'),
  fxcolself: (p) => serializeFlexSelf(p, 'column'),
};

export function applyModifier(parsed: ParsedClass): string | undefined {
  return (
    INTERNAL_DECISION_MODIFIERS[parsed.utilKey] ??
    (parsed.utilOp === REF_CHAR_CUSTOM
      ? CUSTOM_MODIFIERS
      : PREDEFINED_MODIFIERS)[parsed.utilKey]
  )?.(parsed);
}

export function serializeSelector(selector: string) {
  return selector.replace(
    REGEX_SELECTOR_REPLACEMENTS,
    (match, key: string) => SELECTOR_REPLACEMENTS[key],
  );
}

export function serializeProp(
  propKeyKebab: string,
  value: string,
  isImportant: 1 | 0,
) {
  const important = isImportant ? ' !important' : '';
  const prefixes = VENDOR_PREFIXES[propKeyKebab];

  if (prefixes) {
    return (
      prefixes
        .map((prefix) => `${prefix}${propKeyKebab}: ${value}${important};`)
        .join(' ') + ` ${propKeyKebab}: ${value}${important};`
    );
  }

  return `${propKeyKebab}: ${value}${important};`;
}

export function serializeValue(value: string) {
  return value.replaceAll(REF_CHAR_SPACE, ' ').trim();
}

function createVariables(keys: Record<string, string>, prefix: string) {
  return Object.keys(keys)
    .map((key) => `var(--${prefix}-${key},)`)
    .join(' ');
}

function serializeOtherValue({
  utilKey,
  validVarVal,
  propVal,
  isNoRef,
}: ParsedClass) {
  return serializeValueAsVariable(utilKey, validVarVal, propVal, isNoRef);
}

function serializeFraction(value: string): string | undefined {
  if (!value.includes('/')) return;

  const [num, den] = split(value, '/').map(Number);
  const val = Math.round((num / den) * 1000000) / 10000;

  if (!num || !den) return;

  return `${val}%`;
}

function serializeValueAsVariable(
  utilKey: string,
  validVarVal: string,
  propVal: string,
  isNoRef: 1 | 0,
  fallbackValue?: string,
  variableCategoryAsIs?: string,
  variableCategoryForMap?: string,
) {
  const propValueAsIs = removeBrackets(propVal);

  if (propVal !== propValueAsIs) {
    return serializeValue(propValueAsIs);
  }

  if (isReservedKeyword(propVal)) {
    return propVal;
  }

  const refKey = `${utilKey}-${validVarVal}`;
  const isNoRefMode = !OPTIONS.refs || isNoRef;

  if (isNoRefMode || !VARIABLE_CACHE.has(refKey)) {
    let variableCategoryFromMap: string | undefined;

    fallbackValue ??= propVal;

    if (!isKnownNumberValue(propVal)) {
      fallbackValue = `var(--${validVarVal}, ${fallbackValue})`;

      if (variableCategoryAsIs) {
        fallbackValue = `var(--${variableCategoryAsIs}-${validVarVal}, ${fallbackValue})`;
      }
    }

    if (variableCategoryForMap) {
      variableCategoryFromMap = CSS_VARIABLE_CATEGORY[variableCategoryForMap];
    }

    if (!variableCategoryForMap) {
      variableCategoryFromMap = CSS_VARIABLE_CATEGORY[utilKey];
    }

    if (variableCategoryFromMap) {
      fallbackValue = `var(--${variableCategoryFromMap}-${validVarVal}, ${fallbackValue})`;
    }

    const val = `var(--${refKey}, ${fallbackValue})`;

    if (isNoRefMode) {
      return val;
    }

    insertRefVar(
      refKey,
      val,
      isNaN(Number(propValueAsIs)) ? 'custom' : 'number',
    );
    VARIABLE_CACHE.add(refKey);
  }

  return `var(--ref-${refKey})`;
}

function serializeNumberValue({
  utilKey,
  utilVal,
  propKeyCamel,
  validVarVal,
  isUtilNegative,
  isNoRef,
  varCat,
}: ParsedClass): string {
  const utilityValueAsIs = removeBrackets(utilVal);

  if (utilityValueAsIs !== utilVal) {
    return serializeValue(utilityValueAsIs);
  }

  if (isReservedKeyword(utilVal)) {
    return utilVal;
  }

  const refKey = `${utilKey}-${validVarVal}`;
  const isNoRefMode = !OPTIONS.refs || isNoRef;

  if (isNoRefMode || !VARIABLE_CACHE.has(refKey)) {
    const numberValue = Number(utilVal);

    if (numberValue === 0) return '0';

    const transformFnName = TRANSFORM_KEYS[utilKey];
    const unit =
      PROP_UNIT_MAP[transformFnName || propKeyCamel] ?? DEFAULT_SPACE_UNIT;

    let fallbackValue = utilVal;

    const isValueNumber = !isNaN(numberValue);

    if (!isValueNumber) {
      const isValueNegative = startsWithNegative(utilVal);

      isUtilNegative = isUtilNegative || isValueNegative;

      if (isValueNegative) {
        utilVal = utilVal.slice(1);
      }

      if (COVER_UNITS.includes(utilVal)) {
        return `${isUtilNegative ? '-' : ''}100${utilVal}`;
      }

      if (ONE_UNITS.includes(utilVal)) {
        return `${isUtilNegative ? '-' : ''}1${utilVal}`;
      }

      const percentValue = serializeFraction(utilVal);

      if (percentValue) {
        return `${isUtilNegative ? '-' : ''}${percentValue}`;
      }

      const float = parseFloat(utilVal);

      if (!isNaN(float) && isKnownNumberValue(utilVal)) {
        return `${isUtilNegative ? '-' : ''}${utilVal}`;
      }
    } else if (isKnownNumberValue(utilVal)) {
      fallbackValue =
        unit === DEFAULT_SPACE_UNIT
          ? `calc(${numberValue}${unit} * var(--spacer, 0.25))`
          : `${numberValue}${unit}`;
    }

    let val = serializeValueAsVariable(
      utilKey,
      validVarVal,
      utilVal,
      1,
      fallbackValue,
      varCat,
      unit,
    );
    val = isUtilNegative ? `calc(${val} * -1)` : val;

    if (isNoRefMode) {
      return val;
    }

    insertRefVar(refKey, val, isValueNumber ? 'number' : 'custom');
    VARIABLE_CACHE.add(refKey);
  }

  return `var(--ref-${refKey})`;
}

function serializeColorValue(parsed: ParsedClass): string {
  const { utilVal, utilKey } = parsed;
  const utilityValueAsIs = removeBrackets(utilVal);

  if (utilVal !== utilityValueAsIs) {
    return serializeValue(utilityValueAsIs);
  }

  if (isReservedKeyword(utilVal)) {
    return utilVal;
  }

  const refKey = `${utilKey}-${parsed.validVarVal}`;
  const isNoRefMode = !OPTIONS.refs || parsed.isNoRef;

  if (isNoRefMode || !VARIABLE_CACHE.has(refKey)) {
    const tokenParts = REGEX_COLOR_TOKEN.exec(utilVal);

    if (!tokenParts) {
      const serializedValue = serializeValue(utilVal);

      return isKnownColorValue(serializedValue)
        ? serializedValue
        : serializeOtherValue(parsed);
    }

    const name = tokenParts[1];
    const tone = Number(tokenParts[2]) || COLOR_MID_TONE;
    const opacity = tokenParts[3] ? Number(tokenParts[3]) : null;
    const amount = (COLOR_MID_TONE - tone) / COLOR_MID_TONE;

    const nameVar = serializeValueAsVariable(
      utilKey,
      name,
      name,
      1,
      name,
      CSS_VARIABLE_CATEGORY.color,
    );
    const [lightnessFactor, chromaFactor, hueRotate] = [
      ['lightness-factor', 1],
      ['chroma-factor', 1],
      ['hue-rotate', 0],
    ].map(
      ([key, defaultValue]) =>
        `var(--${utilKey}-${name}-${key}, var(--${name}-${key}, var(--${utilKey}-${key}, var(--${key}, ${defaultValue}))))`,
    );

    const lCalc = amount > 0 ? `(1 - l) * ${amount}` : `l * ${amount}`;
    const l =
      amount === 0
        ? `calc(l * ${lightnessFactor})`
        : `calc((l + ${lCalc}) * ${lightnessFactor})`;
    const c = `calc(c * ${chromaFactor})`;
    const h = `calc(h + ${hueRotate})`;
    const alpha = opacity && opacity < 100 ? `${opacity}%` : 'alpha';
    const val = `oklch(from ${nameVar} ${l} ${c} ${h} / ${alpha})`;

    if (isNoRefMode) {
      return val;
    }

    insertRefVar(refKey, val, 'color');
    VARIABLE_CACHE.add(refKey);
  }

  return `var(--ref-${refKey})`;
}

function serializeContainer({
  utilVal,
  propVal,
  isImportant,
}: ParsedClass): string {
  let propKeyKebab = 'container-name';

  // Reqular container property
  if (propVal.includes('/')) {
    propKeyKebab = 'container';
  }

  // Container type
  if (CONTAINER_TYPES.includes(split(utilVal, REF_CHAR_SPACE)[0])) {
    propKeyKebab = 'container-type';
  }

  return serializeProp(propKeyKebab, propVal, isImportant);
}

function serializeRepeat(
  parsed: ParsedClass,
  validPropKey1: string,
  validPropKey2: string,
): string {
  const value =
    parsed.utilOp == REF_CHAR_CUSTOM
      ? parsed.propVal
      : serializeNumberValue(parsed);

  return (
    serializeProp(validPropKey1, value, parsed.isImportant) +
    serializeProp(validPropKey2, value, parsed.isImportant)
  );
}

function serializePercentageToDecimal(parsed: ParsedClass): string {
  const { utilKey, utilVal, propVal, validVarVal, isImportant, isNoRef } =
    parsed;
  const rawValue = Number(utilVal);
  const value = isNaN(rawValue)
    ? serializeValueAsVariable(utilKey, validVarVal, propVal, isNoRef)
    : rawValue / 100;

  return serializeProp('opacity', `${value}`, isImportant);
}

function serializeTransform(parsed: ParsedClass): string {
  let value;

  if (parsed.utilOp == REF_CHAR_CUSTOM) {
    value = parsed.propVal;
  } else {
    const valueItems = split(parsed.utilVal, REF_CHAR_SPACE);
    const serializedValue = [];

    for (const valueItem of valueItems) {
      serializedValue.push(
        serializeNumberValue({
          ...parsed,
          utilVal: valueItem,
          validVarVal: escapeVariable(valueItem),
        }),
      );
    }

    value = serializedValue.join(',');
  }

  return (
    serializeProp(
      `--tf-${parsed.utilKey}`,
      `${TRANSFORM_KEYS[parsed.utilKey]}(${value})`,
      0,
    ) + serializeProp('transform', TRANSFORM_VARIABLES, parsed.isImportant)
  );
}

function serializeFilter(
  parsed: ParsedClass,
  propKey: 'filter' | 'backdrop-filter',
  variables: string,
  abbreviationKeys: Record<string, string>,
): string {
  let value;

  if (parsed.utilOp == REF_CHAR_CUSTOM) {
    value = `${abbreviationKeys[parsed.utilKey]}(${parsed.propVal})`;
  } else {
    const parts = split(parsed.utilVal, REF_CHAR_VALUE_PARTS);
    const serializedParts = [];

    for (const part of parts) {
      const valueItems = split(part, REF_CHAR_SPACE);
      const serializedValue = [];

      for (let i = 0; i < valueItems.length; i++) {
        const valueItem = valueItems[i];

        if (parsed.utilKey === 'dshadow' || parsed.utilKey === 'bdshadow') {
          serializedValue.push(
            serializeShadowValue(
              { ...parsed, utilKey: 'dshadow' },
              valueItem,
              i,
              valueItems,
            ),
          );
        } else if (isKnownNumberValue(valueItem)) {
          serializedValue.push(
            serializeNumberValue({
              ...parsed,
              utilVal: valueItem,
              utilKey: parsed.utilKey.replace(REGEX_BACKDROP_PREFIX, ''),
              validVarVal: escapeVariable(valueItem),
            }),
          );
        } else {
          serializedValue.push(
            serializeOtherValue({
              ...parsed,
              utilKey: parsed.utilKey.replace(REGEX_BACKDROP_PREFIX, ''),
            }),
          );
        }
      }

      serializedParts.push(
        `${abbreviationKeys[parsed.utilKey]}(${serializedValue.join(' ')})`,
      );
    }

    value = serializedParts.join(' ');
  }

  return (
    serializeProp(`--filter-${parsed.utilKey}`, value, 0) +
    serializeProp(propKey, variables, parsed.isImportant)
  );
}

function serializeGridTemplate(parsed: ParsedClass): string | undefined {
  const { utilKey, utilVal, propVal, propKeyKebab, validVarVal, isImportant } =
    parsed;
  const valueItems = split(utilVal, REF_CHAR_SPACE);

  if (valueItems.length === 1) {
    if (isNaN(Number(valueItems[0]))) {
      const frItems = split(utilVal, '/');

      if (frItems.length > 1) {
        return serializeProp(
          propKeyKebab,
          frItems.map((item) => `${item}fr`).join(' '),
          isImportant,
        );
      } else {
        return serializeProp(
          propKeyKebab,
          serializeNumberValue(parsed),
          isImportant,
        );
      }
    } else {
      return serializeProp(
        propKeyKebab,
        `repeat(var(--${utilKey}-${validVarVal}, ${propVal}), minmax(0, 1fr))`,
        isImportant,
      );
    }
  }

  const serializedValue = [];

  for (const valueItem of valueItems) {
    serializedValue.push(
      serializeNumberValue({
        ...parsed,
        utilVal: valueItem,
        validVarVal: escapeVariable(valueItem),
      }),
    );
  }

  if (serializedValue.length) {
    return serializeProp(propKeyKebab, serializedValue.join(' '), isImportant);
  }
}

function serializeGridItem(parsed: ParsedClass): string | undefined {
  const frItems = split(parsed.utilVal, '/');

  if (frItems.length === 1 && isKnownNumberValue(frItems[0])) {
    const numberValue = Number(frItems[0]);
    return serializeProp(
      parsed.propKeyKebab,
      `span ${numberValue} / span ${numberValue}`,
      parsed.isImportant,
    );
  }
}

function serializePropsInValue(parsed: ParsedClass): string | undefined {
  const parts = split(parsed.utilVal, REF_CHAR_VALUE_PARTS);
  const propNames = [];

  for (const part of parts) {
    const propName =
      ABBREVIATIONS_REVERSE[part] ||
      ABBREVIATIONS_REVERSE[toCamelCase(part)] ||
      part;
    const mappedPropKeyKebab = ABBREVIATIONS[propName]
      ? toKebabCase(ABBREVIATIONS[propName])
      : propName;

    if (isKnownProperty(mappedPropKeyKebab)) {
      propNames.push(
        serializeValueAsVariable(
          parsed.utilKey,
          escapeVariable(propName),
          mappedPropKeyKebab,
          parsed.isNoRef,
          undefined,
          CSS_VARIABLE_CATEGORY.prop,
        ),
      );
    } else {
      propNames.push(
        serializeValueAsVariable(
          parsed.utilKey,
          escapeVariable(propName),
          mappedPropKeyKebab,
          parsed.isNoRef,
          undefined,
          undefined,
        ),
      );
    }
  }

  return serializeProp(
    parsed.propKeyKebab,
    propNames.join(REF_CHAR_VALUE_PARTS + ' '),
    parsed.isImportant,
  );
}

function serializeTransitionValue(
  parsed: ParsedClass,
  valueItem: string,
  index: number,
  items: Array<string>,
): string | undefined {
  let mappedValueItem = valueItem;
  let varCat;
  let utilKey = parsed.utilKey;

  valueItem =
    ABBREVIATIONS_REVERSE[valueItem] ||
    ABBREVIATIONS_REVERSE[toCamelCase(valueItem)] ||
    valueItem;
  mappedValueItem = ABBREVIATIONS[valueItem]
    ? toKebabCase(ABBREVIATIONS[valueItem])
    : valueItem;

  if (isKnownProperty(mappedValueItem)) {
    varCat = CSS_VARIABLE_CATEGORY.prop;
    utilKey = ABBREVIATIONS_REVERSE.transitionProperty;
  } else if (isKnownNumberValue(valueItem)) {
    let numberCount = 0;

    for (let i = 0; i <= index; i++) {
      if (isKnownNumberValue(items[i])) {
        numberCount++;
      }
    }

    if (numberCount === 1) {
      utilKey = ABBREVIATIONS_REVERSE.transitionDuration;
    } else if (numberCount === 2) {
      utilKey = ABBREVIATIONS_REVERSE.transitionDelay;
    }
  } else if (items.length > 1) {
    utilKey = ABBREVIATIONS_REVERSE.transitionTimingFunction;
  }

  return serializeNumberValue({
    ...parsed,
    utilKey,
    utilVal: mappedValueItem,
    validVarVal: escapeVariable(valueItem),
    varCat,
  });
}

function serializeShadowValue(
  parsed: ParsedClass,
  valueItem: string,
  index: number,
  items: Array<string>,
): string | undefined {
  if (valueItem === 'inset') {
    return 'inset';
  }

  let type = PROP_TYPE_OTHER;

  if (isKnownNumberValue(valueItem)) {
    type = PROP_TYPE_SPACE;
  } else if (items.length > 1 && index === items.length - 1) {
    type = PROP_TYPE_COLOR;
  }

  return TYPE_MODIFIERS[type]?.({
    ...parsed,
    utilVal: valueItem,
    propVal: valueItem,
    validVarVal: escapeVariable(valueItem),
  });
}

function serializeBackgroundImageParts(
  parsed: ParsedClass,
  partItem: string,
): string | undefined {
  let cssFunction;
  let nonFunctionParams;

  if (parsed.utilKey === ABBREVIATIONS_REVERSE.background) {
    [cssFunction, nonFunctionParams] = partItem.split(
      REGEX_NON_FUNCTION_PARAM_SPLITTER,
    );

    partItem = cssFunction;

    if (!nonFunctionParams) {
      [cssFunction, nonFunctionParams] = partItem.split(
        REF_CHAR_NON_FUNCTION_START,
      );

      partItem = cssFunction;
    }
  }

  const parts = split(partItem, REF_CHAR_FUNCTION_COMMA);
  const functionKey = parts[0];
  const functionName = FUNCTION_KEYS[functionKey];

  if (!functionName) {
    // Check if the value starts with a known function name
    if (FUNCTION_KEYS[split(partItem, REF_CHAR_PREDEFINED)[0]]) {
      return serializeValueAsVariable(
        parsed.utilKey,
        escapeVariable(partItem),
        partItem,
        parsed.isNoRef,
        undefined,
        CSS_VARIABLE_CATEGORY.gradient,
      );
    } else {
      return TYPE_MODIFIERS[parsed.propType]?.({
        ...parsed,
        utilVal: partItem,
        utilKey:
          parsed.propType === PROP_TYPE_COLOR
            ? ABBREVIATIONS_REVERSE.backgroundColor
            : ABBREVIATIONS_REVERSE.backgroundImage,
        propVal: partItem,
        validVarVal: escapeVariable(partItem),
      });
    }
  }

  // Remove function key
  parts.shift();

  const serializedParams: Array<string> = [];

  if (parts.length < 2) {
    const isUrlFunction = functionName === 'url';
    const value =
      splitAtFirstOccurrence(partItem, REF_CHAR_FUNCTION_COMMA)[1] || partItem;
    const isUrlValue = isUrlFunction && value.includes('/');

    if (isUrlValue) {
      serializedParams.push(removeBrackets(value));
    } else {
      const valueAsIs = removeBrackets(value);

      if (value !== valueAsIs) {
        serializedParams.push(serializeValue(valueAsIs));
      } else {
        const propVal =
          functionKey && functionKey !== value
            ? `${functionKey}${REF_CHAR_PREDEFINED}${value}`
            : value;

        serializedParams.push(
          serializeValueAsVariable(
            ABBREVIATIONS_REVERSE.backgroundImage,
            escapeVariable(propVal),
            propVal,
            parsed.isNoRef,
            undefined,
            isUrlFunction ? undefined : CSS_VARIABLE_CATEGORY.gradient,
          ),
        );
      }
    }
  } else {
    const direction = parts[0];

    if (
      isKnownAngleValue(direction) ||
      isGradientDirection(splitAtFirstOccurrence(direction, REF_CHAR_SPACE)[0])
    ) {
      serializedParams.push(serializeValue(direction));

      // Remove direction from params
      parts.shift();
    }

    for (const part of parts) {
      const stopParts = split(part, REF_CHAR_SPACE);
      const colorToken = stopParts.shift() ?? '';
      const colorValue = serializeColorValue({
        ...parsed,
        utilKey: ABBREVIATIONS_REVERSE.backgroundColor,
        utilVal: colorToken,
        validVarVal: escapeVariable(colorToken),
      });

      const positionTokens: Array<string> = [];

      for (const positionToken of stopParts) {
        positionTokens.push(
          serializeNumberValue({
            ...parsed,
            utilKey: 'stop',
            utilVal: positionToken,
            validVarVal: escapeVariable(positionToken),
          }),
        );
      }

      serializedParams.push(
        positionTokens.length
          ? `${colorValue} ${positionTokens.join(' ')}`
          : colorValue,
      );
    }
  }

  return `${functionName}(${serializedParams.join(', ')})${nonFunctionParams ? ` ${serializeValue(nonFunctionParams)}` : ''}`;
}

function serializeFlexLayout(
  parsed: ParsedClass,
  direction: 'row' | 'column',
  isInline: 1 | 0,
): string | undefined {
  const { utilVal, isImportant } = parsed;
  const important = isImportant ? ' !important' : '';
  const display = isInline ? 'inline-flex' : 'flex';

  // No position code
  if (!utilVal) {
    return undefined;
  }

  // Parse 2-letter position code
  if (utilVal.length !== 2) return;

  const v = FLEX_V[utilVal[0]];
  const h = FLEX_H[utilVal[1]];

  if (!v || !h) return;

  // For column: vertical = justify-content, horizontal = align-items
  // For row: vertical = align-items, horizontal = justify-content
  const [jc, ai] = direction === 'column' ? [v, h] : [h, v];

  return `display: ${display}${important}; flex-direction: ${direction}${important}; justify-content: ${jc}${important}; align-items: ${ai}${important};`;
}

function serializeFlexSelf(
  parsed: ParsedClass,
  direction: 'row' | 'column',
): string | undefined {
  const { utilVal, isImportant } = parsed;

  if (utilVal.length !== 2) return;

  const v = FLEX_V[utilVal[0]];
  const h = FLEX_H[utilVal[1]];

  if (!v || !h) return;

  const important = isImportant ? ' !important' : '';

  // For column: vertical = justify-self, horizontal = align-self
  // For row: vertical = align-self, horizontal = justify-self
  const [js, as] = direction === 'column' ? [v, h] : [h, v];

  return `justify-self: ${js}${important}; align-self: ${as}${important};`;
}
