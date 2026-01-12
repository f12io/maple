import {
  REF_CHAR_CUSTOM,
  REF_CHAR_SPACE,
  REF_CHAR_VALUE_PARTS,
  SHORTCUTS,
} from './constants';
import { escapeVariable } from './helpers/string.helper';
import { parseClass } from './parser-class';
import { parseMediaQuery } from './parser-media-query';
import {
  applyModifier,
  serializeProp,
  serializeSelector,
  TYPE_MODIFIERS,
  VALUE_MODIFIERS,
} from './serializer';
import { insert } from './stylesheet';
import { ParsedClass } from './types';

const cache = new Map<string, 1>();

export function generateStylesFromClass(
  sourceClass: string,
): string | undefined {
  if (cache.has(sourceClass)) return;

  cache.set(sourceClass, 1);

  try {
    const parsed = parseClass(sourceClass);
    const styles = buildProp(parsed);

    if (!styles) return;

    const selector = buildSelector(parsed);

    if (!selector) return;

    const parsedMediaQuery = parseMediaQuery(parsed);
    const block = `${selector} { ${styles} }`;
    const rule = parsedMediaQuery
      ? `${parsedMediaQuery.innerBlockOpen} ${block} ${parsedMediaQuery.innerBlockClose}`
      : block;

    insert(rule, parsedMediaQuery);

    return rule;
  } catch (error) {
    console.error(error);
  }
}

function buildProp(parsed: ParsedClass) {
  const { utilityKey } = parsed;

  if (!utilityKey) {
    return;
  }

  const { utilityValue, propKeyCamel, isImportant } = parsed;

  if (!utilityValue) {
    if (SHORTCUTS[propKeyCamel]) {
      return `${SHORTCUTS[propKeyCamel]}${isImportant ? ' !important' : ''};`;
    }
    return;
  }

  const mod = applyModifier(parsed);

  if (mod) return mod;

  const { propKeyKebab, propValue, utilityOperator, propType } = parsed;

  if (utilityOperator === REF_CHAR_CUSTOM) {
    return serializeProp(propKeyKebab, propValue, isImportant);
  }

  const serializedParts: Array<string> = [];
  const parts = utilityValue.split(REF_CHAR_VALUE_PARTS);

  for (const part of parts) {
    const valueItems = part.split(REF_CHAR_SPACE);
    const serializedValue = [];

    for (let i = 0; i < valueItems.length; i++) {
      const valueItem = valueItems[i];
      const value =
        VALUE_MODIFIERS[utilityKey]?.(
          parsed,
          valueItem,
          i,
          valueItems.length,
        ) ??
        TYPE_MODIFIERS[propType]?.({
          ...parsed,
          utilityValue: valueItem,
          propValue: valueItem,
          validVariableValue: escapeVariable(valueItem),
        });

      if (value) {
        serializedValue.push(value);
      }
    }

    serializedParts.push(serializedValue.join(' '));
  }

  return serializeProp(
    propKeyKebab,
    serializedParts.join(REF_CHAR_VALUE_PARTS + ' '),
    isImportant,
  );
}

function buildSelector({
  sourceSelector,
  parentSelector = '',
  selfSelector = '',
  childSelector = '',
}: ParsedClass) {
  return `${serializeSelector(parentSelector)} ${sourceSelector}${serializeSelector(selfSelector)} ${serializeSelector(childSelector)}`.trim();
}
