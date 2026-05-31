import {
  REF_CHAR_CUSTOM,
  REF_CHAR_SPACE,
  REF_CHAR_VALUE_PARTS,
} from './constants/chars';
import { OPTIONS } from './constants/config';
import {
  BACKDROP_FILTER_KEYS,
  FILTER_KEYS,
  TRANSFORM_KEYS,
} from './constants/dictionaries';
import { REGEX_OVERRIDABLE_MEDIA_QUERY } from './constants/regex';
import { escapeVariable, split } from './helpers/string.helper';
import { parseClass } from './parser-class';
import { parseMediaQuery } from './parser-media-query';
import {
  applyModifier,
  PART_MODIFIERS,
  serializeProp,
  serializeSelector,
  TYPE_MODIFIERS,
  VALUE_MODIFIERS,
} from './serializer';
import { ParsedClass, ParsedMediaQuery, RuleData } from './types';

// Composable keys - these don't conflict with each other
const COMPOSABLE_KEYS = new Set([
  ...Object.keys(FILTER_KEYS),
  ...Object.keys(BACKDROP_FILTER_KEYS),
  ...Object.keys(TRANSFORM_KEYS),
]);

export function buildRule(
  srcClass: string,
  isRoot = false,
  selectorSrcClass = srcClass,
): RuleData | undefined {
  const isAlias = selectorSrcClass !== srcClass;
  const parsed = parseClass(srcClass);

  if (isAlias) {
    parsed.srcSel = parseClass(selectorSrcClass).srcSel;
  }

  const styleContent = buildProp(parsed);

  if (!styleContent) return;

  const selectors = buildSelector(parsed);

  if (!selectors.length) return;

  const parsedMediaQuery = parseMediaQuery(parsed);
  const content = buildRuleContent(
    parsedMediaQuery?.prefix,
    parsedMediaQuery?.rootSelector,
    selectors,
    styleContent,
    parsedMediaQuery?.suffix,
    isRoot,
  );
  const overrideRule = buildOverrideRule(
    srcClass,
    selectorSrcClass,
    selectors,
    styleContent,
    parsedMediaQuery?.overrideRootSelector,
    isRoot,
  );

  parsed.conflictKey = OPTIONS.nomerge
    ? '1'
    : buildConflictKey(styleContent, parsed, parsedMediaQuery);

  return { content, isAlias, overrideRule, parsedMediaQuery, parsed };
}

function buildOverrideRule(
  srcClass: string,
  selectorSrcClass: string,
  selectors: Array<string>,
  styleContent: string,
  overrideRootSelector: string | undefined,
  isRoot: boolean,
): RuleData | undefined {
  if (!overrideRootSelector) {
    return;
  }

  const parsed = parseClass(
    srcClass.replace(REGEX_OVERRIDABLE_MEDIA_QUERY, ''),
  );

  if (selectorSrcClass !== srcClass) {
    parsed.srcSel = parseClass(
      selectorSrcClass.replace(REGEX_OVERRIDABLE_MEDIA_QUERY, ''),
    ).srcSel;
  }

  const parsedMediaQuery = parseMediaQuery(parsed);
  const rootSelector = parsedMediaQuery?.rootSelector
    ? parsedMediaQuery.rootSelector.replace(':root', '')
    : '';

  overrideRootSelector += rootSelector;

  const content = buildRuleContent(
    parsedMediaQuery?.prefix,
    overrideRootSelector,
    selectors,
    styleContent,
    parsedMediaQuery?.suffix,
    isRoot,
  );

  return {
    content,
    isAlias: selectorSrcClass !== srcClass,
    parsed,
    parsedMediaQuery,
  };
}

function buildRuleContent(
  prefix: string | undefined,
  rootSelector: string | undefined,
  selectors: Array<string>,
  styleContent: string,
  suffix: string | undefined,
  isRoot: boolean,
) {
  if (rootSelector) {
    if (isRoot) {
      /**
       * Strip the utility class from selectors if we
       * generate styles for the html element.
       *
       * This approach provides style leaking if only we are on
       * the root element and there is internal class selectors, like
       * .dark and .light
       */
      selectors = [rootSelector];
    } else {
      selectors = selectors.map((selector) => {
        /**
         * rootSelector already includes :root, so we need to remove it
         * to prevent duplicate :root selectors
         */
        selector = selector.replace(':root ', '');
        return `${rootSelector}${selector}, ${rootSelector} ${selector}`;
      });
    }
  }

  const style = `${selectors.join(', ')} { ${styleContent} }`;

  if (prefix && suffix) {
    return `${prefix}${style} ${suffix}`.trim();
  }

  return style;
}

function buildProp(parsed: ParsedClass) {
  const { utilKey } = parsed;

  if (!utilKey) {
    return;
  }

  const { utilVal, isImportant } = parsed;

  if (!utilVal) {
    return;
  }

  const mod = applyModifier(parsed);

  if (mod) return mod;

  const { propKeyKebab, propVal, utilOp, propType } = parsed;

  if (utilOp === REF_CHAR_CUSTOM) {
    return serializeProp(propKeyKebab, propVal, isImportant);
  }

  const serializedParts: Array<string> = [];
  const parts = split(utilVal, REF_CHAR_VALUE_PARTS);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const modifierResult = PART_MODIFIERS[utilKey]?.(parsed, part, i, parts);

    if (modifierResult) {
      serializedParts.push(modifierResult);
      continue;
    }

    const valueItems = split(part, REF_CHAR_SPACE);
    const serializedValue = [];

    for (let j = 0; j < valueItems.length; j++) {
      const valueItem = valueItems[j];
      const value =
        VALUE_MODIFIERS[utilKey]?.(parsed, valueItem, j, valueItems) ??
        TYPE_MODIFIERS[propType]?.({
          ...parsed,
          utilVal: valueItem,
          propVal: valueItem,
          validVarVal: escapeVariable(valueItem),
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
  srcSel,
  parentSel = '',
  selfSel = '',
  childSel = '',
  isMultiSelector,
}: ParsedClass): Array<string> {
  const serializedParent = serializeSelector(parentSel);
  const serializedSelf = serializeSelector(selfSel);
  const serializedChild = serializeSelector(childSel);
  const res = [];

  if (isMultiSelector) {
    const self = `:root ${srcSel}${serializedSelf} ${serializedChild}`.trim();

    if (self) {
      res.push(self);
    }

    const parent = `${serializedSelf} ${srcSel} ${serializedChild}`.trim();

    if (parent) {
      res.push(parent);
    }
  } else {
    const selector =
      `${serializedParent} ${srcSel}${serializedSelf} ${serializedChild}`.trim();

    if (selector) {
      res.push(selector);
    }
  }

  return res;
}

function buildConflictKey(
  styleContent: string,
  {
    utilKey,
    propKeyKebab,
    isImportant,
    parentSel = '',
    selfSel = '',
    childSel = '',
  }: ParsedClass,
  parsedMediaQuery: ParsedMediaQuery | undefined,
): string {
  let propKey;

  if (COMPOSABLE_KEYS.has(utilKey)) {
    propKey = utilKey;
  } else {
    propKey = propKeyKebab;
  }

  return `${propKey}:${isImportant ? '!' : ''}${childSel}${selfSel}${parentSel}${parsedMediaQuery?.prefix ?? ''}${parsedMediaQuery?.bucketQuery ?? ''}`;
}
