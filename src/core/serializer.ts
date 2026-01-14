import {
  CONTAINER_TYPES,
  COVER_UNITS,
  CSS_VARIABLE_CATEGORY,
  DEFAULT_SPACE_UNIT,
  FUNCTION_KEYS,
  ONE_UNITS,
  PROP_TYPE_COLOR,
  PROP_TYPE_OTHER,
  PROP_TYPE_SPACE,
  PROP_UNIT_MAP,
  REF_CHAR_CUSTOM,
  REF_CHAR_FUNCTION_COMMA,
  REF_CHAR_FUNCTION_START,
  REF_CHAR_NON_FUNCTION_START,
  REF_CHAR_SPACE,
  REF_CHAR_VALUE_PARTS,
  REGEX_COLOR_TOKEN,
  REGEX_NON_FUNCTION_PARAM_SPLITTER,
  REGEX_SELECTOR_REPLACEMENTS,
  SELECTOR_REPLACEMENTS,
  TRANSFORM_KEYS,
} from './constants';
import {
  isGradientDirection,
  isKnownAngleValue,
  isKnownNumberValue,
  isKnownProperty,
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
import { abbreviationMap, abbreviationReverseMap } from './parser-class';
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

const INTERNAL_DECISION_MODIFIERS: Modifiers = {
  square: (p) =>
    serializeRepeat({ ...p, propType: PROP_TYPE_SPACE }, 'width', 'height'),
  ...Object.keys(TRANSFORM_KEYS).reduce(
    (acc, key) => ({ ...acc, [key]: serializeTransform }),
    {},
  ),
};

const TRANSFORM_VARIABLES = Object.keys(TRANSFORM_KEYS)
  .map((key) => `var(--tf-${key},)`)
  .join(' ');

export function applyModifier(parsed: ParsedClass): string | undefined {
  const { utilityKey, utilityOperator } = parsed;

  return (
    INTERNAL_DECISION_MODIFIERS[utilityKey] ??
    (utilityOperator === REF_CHAR_CUSTOM
      ? CUSTOM_MODIFIERS
      : PREDEFINED_MODIFIERS)[utilityKey]
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
  isImportant: boolean,
) {
  return `${propKeyKebab}: ${value}${isImportant ? ' !important' : ''};`;
}

export function serializeValue(value: string) {
  return value.replaceAll(REF_CHAR_SPACE, ' ').trim();
}

function serializeValueAsVariable(
  utilityKey: string,
  validVariableValue: string,
  propValue: string,
  fallbackValue?: string,
  variableCategoryAsIs?: string,
  variableCategoryForMap?: string,
) {
  const propValueAsIs = removeBrackets(propValue);

  if (propValue !== propValueAsIs) {
    return serializeValue(propValueAsIs);
  }

  let variableCategoryFromMap: string | undefined;

  fallbackValue ??= propValue;

  if (!isKnownNumberValue(propValue)) {
    fallbackValue = `var(--${validVariableValue}, ${fallbackValue})`;

    if (variableCategoryAsIs) {
      fallbackValue = `var(--${variableCategoryAsIs}-${validVariableValue}, ${fallbackValue})`;
    }
  }

  if (variableCategoryForMap) {
    variableCategoryFromMap = CSS_VARIABLE_CATEGORY[variableCategoryForMap];
  }

  if (!variableCategoryForMap) {
    variableCategoryFromMap = CSS_VARIABLE_CATEGORY[utilityKey];
  }

  if (variableCategoryFromMap) {
    fallbackValue = `var(--${variableCategoryFromMap}-${validVariableValue}, ${fallbackValue})`;
  }

  return `var(--${utilityKey}-${validVariableValue}, ${fallbackValue})`;
}

function serializeFraction(value: string): string | undefined {
  if (!value.includes('/')) return;

  const [num, den] = split(value, '/').map(Number);
  const val = Math.round((num / den) * 1000000) / 10000;

  if (!num || !den) return;

  return `${val}%`;
}

function serializeOtherValue({
  utilityKey,
  validVariableValue,
  propValue,
}: ParsedClass) {
  return serializeValueAsVariable(utilityKey, validVariableValue, propValue);
}

function serializeNumberValue({
  utilityKey,
  utilityValue,
  propKeyCamel,
  validVariableValue,
  isUtilityNegative,
  variableCategory,
}: ParsedClass): string {
  const utilityValueAsIs = removeBrackets(utilityValue);

  if (utilityValueAsIs !== utilityValue) {
    return serializeValue(utilityValueAsIs);
  }

  const numberValue = Number(utilityValue);

  if (numberValue === 0) return '0';

  const transformFnName = TRANSFORM_KEYS[utilityKey];
  const unit =
    PROP_UNIT_MAP[transformFnName || propKeyCamel] ?? DEFAULT_SPACE_UNIT;

  let fallbackValue = utilityValue;

  if (isNaN(numberValue)) {
    const isValueNegative = startsWithNegative(utilityValue);

    isUtilityNegative = isUtilityNegative || isValueNegative;

    if (isValueNegative) {
      utilityValue = utilityValue.slice(1);
    }

    if (COVER_UNITS.includes(utilityValue)) {
      return `${isUtilityNegative ? '-' : ''}100${utilityValue}`;
    }

    if (ONE_UNITS.includes(utilityValue)) {
      return `${isUtilityNegative ? '-' : ''}1${utilityValue}`;
    }

    const percentValue = serializeFraction(utilityValue);

    if (percentValue) {
      return `${isUtilityNegative ? '-' : ''}${percentValue}`;
    }

    const float = parseFloat(utilityValue);

    if (!isNaN(float) && isKnownNumberValue(utilityValue)) {
      return `${isUtilityNegative ? '-' : ''}${utilityValue}`;
    }
  } else if (isKnownNumberValue(utilityValue)) {
    fallbackValue =
      unit === DEFAULT_SPACE_UNIT
        ? `calc(${numberValue}${unit} * var(--spacer, 0.25))`
        : `${numberValue}${unit}`;
  }

  const val = serializeValueAsVariable(
    utilityKey,
    validVariableValue,
    utilityValue,
    fallbackValue,
    variableCategory,
    unit,
  );

  return isUtilityNegative ? `calc(${val} * -1)` : val;
}

function serializeColorValue({
  utilityValue,
  utilityKey,
}: ParsedClass): string {
  const utilityValueAsIs = removeBrackets(utilityValue);

  if (utilityValue !== utilityValueAsIs) {
    return serializeValue(utilityValueAsIs);
  }

  if (
    utilityValue === 'transparent' ||
    utilityValue === 'none' ||
    utilityValue === 'unset'
  ) {
    return utilityValue;
  }

  const ts = REGEX_COLOR_TOKEN.exec(utilityValue);

  if (!ts) {
    return utilityValue;
  }

  const name = ts[1];
  const tone = Number(ts[2]) || 500;
  const opacity = ts[3] ? Number(ts[3]) : null;
  const amount = (500 - tone) / 500;

  const nameVar = serializeValueAsVariable(
    utilityKey,
    name,
    name,
    name,
    CSS_VARIABLE_CATEGORY.color,
  );
  const [lightnessFactor, chromaFactor, hueRotate] = [
    ['lightness-factor', 1],
    ['chroma-factor', 1],
    ['hue-rotate', 0],
  ].map(
    ([key, defaultValue]) =>
      `var(--${utilityKey}-${name}-${key}, var(--${name}-${key}, var(--${key}, ${defaultValue})))`,
  );

  const lCalc = amount > 0 ? `(1 - l) * ${amount}` : `l * ${amount}`;
  const l =
    amount === 0
      ? `calc(l * ${lightnessFactor})`
      : `calc((l + ${lCalc}) * ${lightnessFactor})`;
  const c = `calc(c * ${chromaFactor})`;
  const h = `calc(h + ${hueRotate})`;
  const alpha = opacity && opacity < 100 ? `${opacity}%` : 'alpha';

  return `oklch(from ${nameVar} ${l} ${c} ${h} / ${alpha})`;
}

function serializeContainer({
  utilityValue,
  propValue,
  isImportant,
}: ParsedClass): string {
  let propKeyKebab = 'container-name';

  // Reqular container property
  if (propValue.includes('/')) {
    propKeyKebab = 'container';
  }

  // Container type
  if (CONTAINER_TYPES.includes(split(utilityValue, REF_CHAR_SPACE)[0])) {
    propKeyKebab = 'container-type';
  }

  return serializeProp(propKeyKebab, propValue, isImportant);
}

function serializeRepeat(
  parsed: ParsedClass,
  validPropKey1: string,
  validPropKey2: string,
): string {
  const { utilityOperator, propValue, isImportant } = parsed;
  const value =
    utilityOperator == REF_CHAR_CUSTOM
      ? propValue
      : serializeNumberValue(parsed);

  return (
    serializeProp(validPropKey1, value, isImportant) +
    serializeProp(validPropKey2, value, isImportant)
  );
}

function serializePercentageToDecimal(parsed: ParsedClass): string {
  const {
    utilityKey,
    utilityValue,
    propValue,
    validVariableValue,
    isImportant,
  } = parsed;
  const rawValue = Number(utilityValue);
  const value = isNaN(rawValue)
    ? serializeValueAsVariable(utilityKey, validVariableValue, propValue)
    : rawValue / 100;

  return serializeProp('opacity', `${value}`, isImportant);
}

function serializeTransform(parsed: ParsedClass): string {
  const { utilityKey, utilityValue, utilityOperator, propValue, isImportant } =
    parsed;

  let value;

  if (utilityOperator == REF_CHAR_CUSTOM) {
    value = propValue;
  } else {
    const valueItems = split(utilityValue, REF_CHAR_SPACE);
    const serializedValue = [];

    for (const valueItem of valueItems) {
      serializedValue.push(
        serializeNumberValue({
          ...parsed,
          utilityValue: valueItem,
          validVariableValue: escapeVariable(valueItem),
        }),
      );
    }

    value = serializedValue.join(',');
  }

  return (
    serializeProp(
      `--tf-${utilityKey}`,
      `${TRANSFORM_KEYS[utilityKey]}(${value})`,
      false,
    ) + serializeProp('transform', TRANSFORM_VARIABLES, isImportant)
  );
}

function serializeGridTemplate(parsed: ParsedClass): string | undefined {
  const {
    utilityKey,
    utilityValue,
    propValue,
    propKeyKebab,
    validVariableValue,
    isImportant,
  } = parsed;
  const valueItems = split(utilityValue, REF_CHAR_SPACE);

  if (valueItems.length === 1) {
    if (isNaN(Number(valueItems[0]))) {
      const frItems = split(utilityValue, '/');

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
        `repeat(var(--${utilityKey}-${validVariableValue}, ${propValue}), minmax(0, 1fr))`,
        isImportant,
      );
    }
  }

  const serializedValue = [];

  for (const valueItem of valueItems) {
    serializedValue.push(
      serializeNumberValue({
        ...parsed,
        utilityValue: valueItem,
        validVariableValue: escapeVariable(valueItem),
      }),
    );
  }

  if (serializedValue.length) {
    return serializeProp(propKeyKebab, serializedValue.join(' '), isImportant);
  }
}

function serializeGridItem(parsed: ParsedClass): string | undefined {
  const { utilityValue, propKeyKebab, isImportant } = parsed;
  const frItems = split(utilityValue, '/');

  if (frItems.length === 1 && isKnownNumberValue(frItems[0])) {
    const numberValue = Number(frItems[0]);
    return serializeProp(
      propKeyKebab,
      `span ${numberValue} / span ${numberValue}`,
      isImportant,
    );
  }
}

function serializePropsInValue(parsed: ParsedClass): string | undefined {
  const { utilityValue, propKeyKebab, isImportant } = parsed;
  const parts = split(utilityValue, REF_CHAR_VALUE_PARTS);
  const propNames = [];

  for (const part of parts) {
    const propName =
      abbreviationReverseMap[part] ||
      abbreviationReverseMap[toCamelCase(part)] ||
      part;
    const mappedPropKeyKebab = abbreviationMap[propName]
      ? toKebabCase(abbreviationMap[propName])
      : propName;
    const mappedPropKeyCamel = toCamelCase(mappedPropKeyKebab);

    if (isKnownProperty(mappedPropKeyCamel)) {
      propNames.push(
        serializeValueAsVariable(
          parsed.utilityKey,
          escapeVariable(propName),
          mappedPropKeyKebab,
          undefined,
          CSS_VARIABLE_CATEGORY.prop,
        ),
      );
    } else {
      propNames.push(
        serializeValueAsVariable(
          parsed.utilityKey,
          escapeVariable(propName),
          mappedPropKeyKebab,
          undefined,
          CSS_VARIABLE_CATEGORY.other,
        ),
      );
    }
  }

  return serializeProp(
    propKeyKebab,
    propNames.join(REF_CHAR_VALUE_PARTS + ' '),
    isImportant,
  );
}

function serializeTransitionValue(
  parsed: ParsedClass,
  valueItem: string,
): string | undefined {
  let mappedValueItem = valueItem;
  let variableCategory;

  valueItem =
    abbreviationReverseMap[valueItem] ||
    abbreviationReverseMap[toCamelCase(valueItem)] ||
    valueItem;
  mappedValueItem = abbreviationMap[valueItem]
    ? toKebabCase(abbreviationMap[valueItem])
    : valueItem;

  if (isKnownProperty(mappedValueItem)) {
    variableCategory = CSS_VARIABLE_CATEGORY.prop;
  }

  return serializeNumberValue({
    ...parsed,
    utilityValue: mappedValueItem,
    validVariableValue: escapeVariable(valueItem),
    variableCategory,
  });
}

function serializeShadowValue(
  parsed: ParsedClass,
  valueItem: string,
  index: number,
  length: number,
): string | undefined {
  if (valueItem === 'inset') {
    return 'inset';
  }

  let type = PROP_TYPE_OTHER;

  if (isKnownNumberValue(valueItem)) {
    type = PROP_TYPE_SPACE;
  } else if (index === length - 1 && length > 1) {
    type = PROP_TYPE_COLOR;
  }

  return TYPE_MODIFIERS[type]?.({
    ...parsed,
    utilityValue: valueItem,
    propValue: valueItem,
    validVariableValue: escapeVariable(valueItem),
  });
}

function serializeBackgroundImageParts(
  parsed: ParsedClass,
  partItem: string,
): string | undefined {
  let cssFunction;
  let nonFunctionParams;

  if (parsed.utilityKey === abbreviationReverseMap.background) {
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

  const [functionKey, params] = splitAtFirstOccurrence(
    partItem,
    REF_CHAR_FUNCTION_START,
  );

  const parts = split(params || partItem, REF_CHAR_FUNCTION_COMMA);
  const functionName = FUNCTION_KEYS[functionKey];

  if (!functionName) {
    return TYPE_MODIFIERS[parsed.propType]?.({
      ...parsed,
      utilityValue: partItem,
      utilityKey:
        parsed.propType === PROP_TYPE_COLOR
          ? abbreviationReverseMap.backgroundColor
          : abbreviationReverseMap.backgroundImage,
      propValue: partItem,
      validVariableValue: escapeVariable(partItem),
    });
  }

  partItem = params || partItem;
  const serializedParams: Array<string> = [];

  if (parts.length < 2) {
    const isUrlFunction = functionName === 'url';
    const isUrlValue = isUrlFunction && partItem.includes('/');
    if (isUrlValue) {
      serializedParams.push(removeBrackets(partItem));
    } else {
      const partItemAsIs = removeBrackets(partItem);

      if (partItem !== partItemAsIs) {
        serializedParams.push(serializeValue(partItemAsIs));
      } else {
        const propValue =
          functionKey && functionKey !== partItem
            ? `${functionKey}-${partItem}`
            : partItem;

        serializedParams.push(
          serializeValueAsVariable(
            abbreviationReverseMap.backgroundImage,
            escapeVariable(propValue),
            propValue,
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
        utilityKey: abbreviationReverseMap.backgroundColor,
        utilityValue: colorToken,
      });

      const positionTokens: Array<string> = [];

      for (const positionToken of stopParts) {
        positionTokens.push(
          serializeNumberValue({
            ...parsed,
            utilityKey: 'stop',
            utilityValue: positionToken,
            validVariableValue: escapeVariable(positionToken),
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
