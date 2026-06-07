import { ALIAS_CLASS_CACHE } from './constants/caches';
import {
  CHAR_DOLLAR,
  CHAR_EXCLAMATION_MARK,
  REF_CHAR_ALIAS_PARTS,
  REF_CHAR_ALIAS_PREFIX,
  REF_CHAR_CUSTOM,
  REF_CHAR_VALUE_PARTS,
  REF_CHAR_SEL_CHILD,
  REF_CHAR_SEL_PARENT,
  REF_CHAR_SEL_SELF,
  REF_CHAR_SPACE,
  REF_CHAR_UTILITY_DELIMITER,
} from './constants/chars';
import { BUILTIN_ALIASES } from './constants/dictionaries';
import { REGEX_PSEUDO_ELEMENT_SUFFIX } from './constants/regex';
import { removeBrackets, split } from './helpers/string.helper';
import { parseSelectors } from './parser-class';

const ALIAS_DEFINITION_PREFIX = '--alias-';
const MAX_ALIAS_DEPTH = 5;
let USER_ALIASES: Record<string, string | undefined> = {};
let aliasSignature = '';
const REGEX_ALIAS_PARAM = /\{([^{}]+)\}/g;

export function isAliasDefinition(srcClass: string): boolean {
  return srcClass.startsWith(ALIAS_DEFINITION_PREFIX);
}

export function collectAliases(srcClasses: Array<string>): void {
  const aliases: Record<string, string | undefined> = {};

  for (const srcClass of srcClasses) {
    if (!isAliasDefinition(srcClass)) continue;

    const eqIndex = srcClass.indexOf(REF_CHAR_CUSTOM);

    if (eqIndex === -1) continue;

    const key = srcClass.slice(ALIAS_DEFINITION_PREFIX.length, eqIndex);
    const value = removeBrackets(srcClass.slice(eqIndex + 1));

    if (key && value) {
      aliases[key] = value;
    }
  }

  const nextSignature = Object.keys(aliases)
    .sort()
    .map((key) => `${key}=${aliases[key]}`)
    .join(REF_CHAR_ALIAS_PARTS);

  if (nextSignature !== aliasSignature) {
    ALIAS_CLASS_CACHE.clear();
    aliasSignature = nextSignature;
  }

  USER_ALIASES = aliases;
}

export function expandAliasClass(srcClass: string): Array<string> | undefined {
  return expandAliasClassInternal(srcClass, 0);
}

function expandAliasClassInternal(
  srcClass: string,
  depth: number,
): Array<string> | undefined {
  if (depth >= MAX_ALIAS_DEPTH) return;

  const { prefix, context, utility } = splitClass(srcClass);
  const alias = resolveAlias(utility);

  if (!alias) return;

  const result: Array<string> = [];
  const aliasItems = split(alias.value, REF_CHAR_ALIAS_PARTS).filter(Boolean);

  for (const item of aliasItems) {
    const itemParts = splitClass(applyAliasParams(item, alias.params));
    const mergedContext = mergeContexts(context, itemParts.context);
    const expandedClass =
      prefix +
      (mergedContext ? `${mergedContext}${REF_CHAR_UTILITY_DELIMITER}` : '') +
      itemParts.utility;
    const nested = expandAliasClassInternal(expandedClass, depth + 1);

    if (nested) {
      result.push(...nested);
    } else {
      result.push(expandedClass);
    }
  }

  return result.length ? result : undefined;
}

function resolveAlias(
  utility: string,
): { value: string; params: Record<string, string | undefined> } | undefined {
  if (utility.startsWith(REF_CHAR_ALIAS_PREFIX)) {
    const usage = parseAliasUsage(utility);
    const value = USER_ALIASES[usage.key] ?? BUILTIN_ALIASES[usage.key];

    if (!value) return;

    const params = parseAliasParams(usage.paramsRaw, value);

    if (!params) return;

    return { value, params };
  }

  const value = BUILTIN_ALIASES[utility];

  if (!value) return;

  return {
    value,
    params: {},
  };
}

function parseAliasUsage(utility: string): {
  key: string;
  paramsRaw: string | undefined;
} {
  const body = utility.slice(REF_CHAR_ALIAS_PREFIX.length);
  const openIndex = body.indexOf('(');

  if (openIndex === -1 || !body.endsWith(')')) {
    return { key: body, paramsRaw: undefined };
  }

  return {
    key: body.slice(0, openIndex),
    paramsRaw: body.slice(openIndex + 1, -1),
  };
}

function parseAliasParams(
  paramsRaw: string | undefined,
  alias: string,
): Record<string, string | undefined> | undefined {
  if (paramsRaw === undefined) return {};

  const params: Record<string, string | undefined> = {};
  const positional: Array<string> = [];
  const parts = split(paramsRaw, REF_CHAR_VALUE_PARTS).filter(Boolean);

  for (const part of parts) {
    const pair = split(part, REF_CHAR_UTILITY_DELIMITER);

    if (pair.length > 1 && pair[0]) {
      const value = removeBrackets(
        pair.slice(1).join(REF_CHAR_UTILITY_DELIMITER),
      );

      if (value) {
        params[pair[0]] = value;
      }
    } else {
      positional.push(removeBrackets(part));
    }
  }

  if (
    positional.length > 1 ||
    (positional.length && Object.keys(params).length)
  ) {
    return;
  }

  if (positional.length === 1 && Object.keys(params).length === 0) {
    const firstParam = getAliasParamNames(alias)[0];

    if (firstParam) {
      params[firstParam] = positional[0];
    }
  }

  return params;
}

function getAliasParamNames(alias: string): Array<string> {
  const names: Array<string> = [];

  alias.replace(REGEX_ALIAS_PARAM, (_, content: string) => {
    const name = split(content, REF_CHAR_VALUE_PARTS)[0];

    if (name && !names.includes(name)) {
      names.push(name);
    }

    return '';
  });

  return names;
}

function applyAliasParams(
  value: string,
  params: Record<string, string | undefined>,
): string {
  return value.replace(REGEX_ALIAS_PARAM, (_, content: string) => {
    const parts = split(content, REF_CHAR_VALUE_PARTS);
    const name = parts[0];
    const defaultValue = parts.length > 1 ? parts.slice(1).join(',') : '';

    return params[name] ?? removeBrackets(defaultValue);
  });
}

function splitClass(srcClass: string) {
  let prefix = '';

  if (srcClass.charCodeAt(0) === CHAR_EXCLAMATION_MARK) {
    prefix += srcClass[0];
    srcClass = srcClass.slice(1);
  }

  if (
    srcClass.charCodeAt(0) === CHAR_DOLLAR &&
    srcClass.charCodeAt(1) === CHAR_DOLLAR
  ) {
    prefix += srcClass.slice(0, 2);
    srcClass = srcClass.slice(2);
  } else if (srcClass.charCodeAt(0) === CHAR_DOLLAR) {
    prefix += srcClass[0];
    srcClass = srcClass.slice(1);
  }

  const parts = split(srcClass, REF_CHAR_UTILITY_DELIMITER);
  const utility = parts.pop() ?? '';
  const context = parts.join(REF_CHAR_UTILITY_DELIMITER);

  return { prefix, context, utility };
}

function mergeContexts(baseContext: string, aliasContext: string): string {
  if (!baseContext) return aliasContext;
  if (!aliasContext) return baseContext;

  const base = parseSelectors(baseContext);
  const alias = parseSelectors(aliasContext);

  const mediaQuery = [base?.mediaQuery, alias?.mediaQuery]
    .filter(Boolean)
    .join(REF_CHAR_UTILITY_DELIMITER);
  const parentSel = joinSelector(base?.parentSel, alias?.parentSel);
  let selfSel = base?.selfSel;
  let childSel = base?.childSel;

  if (childSel && alias?.selfSel) {
    childSel = joinSelfSelector(childSel, alias.selfSel);
  } else {
    selfSel = joinSelfSelector(selfSel, alias?.selfSel);
  }

  childSel = joinSelector(childSel, alias?.childSel);
  const selector = [
    parentSel ? `${REF_CHAR_SEL_PARENT}${parentSel}` : '',
    selfSel ? `${REF_CHAR_SEL_SELF}${selfSel}` : '',
    childSel ? `${REF_CHAR_SEL_CHILD}${childSel}` : '',
  ].join('');

  return [mediaQuery, selector]
    .filter(Boolean)
    .join(REF_CHAR_UTILITY_DELIMITER);
}

function joinSelector(
  baseSelector: string | undefined,
  aliasSelector: string | undefined,
) {
  if (!baseSelector) return aliasSelector;
  if (!aliasSelector) return baseSelector;

  return `${baseSelector}${REF_CHAR_SPACE}${aliasSelector}`;
}

function joinSelfSelector(
  baseSelector: string | undefined,
  aliasSelector: string | undefined,
) {
  if (!baseSelector) return aliasSelector ?? '';
  if (!aliasSelector) return baseSelector;

  if (REGEX_PSEUDO_ELEMENT_SUFFIX.test(baseSelector)) {
    return baseSelector.replace(
      REGEX_PSEUDO_ELEMENT_SUFFIX,
      `${aliasSelector}$1$2`,
    );
  }

  return baseSelector + aliasSelector;
}
