import { expandAliasClass, isAliasDefinition } from '../aliases';
import { buildRule } from '../builder';
import { OPTIONS } from '../constants/config';
import { insert } from '../stylesheet';

export function convert(
  srcClass: string,
  isRoot?: boolean,
): string | undefined {
  if (isAliasDefinition(srcClass)) return;

  const expanded = expandAliasClass(srcClass);

  if (expanded) {
    return expanded
      .map((item) => processRule(buildRule(item, isRoot, srcClass)))
      .filter(Boolean)
      .join(' ');
  }

  return processRule(buildRule(srcClass, isRoot));
}

export function convertWithRefs(
  srcClass: string,
  isRoot?: boolean,
): string | undefined {
  OPTIONS.refs = 1;
  const result = buildRule(srcClass, isRoot);
  OPTIONS.refs = 0;

  return processRule(result);
}

function processRule(rule: ReturnType<typeof buildRule>): string | undefined {
  if (!rule) return;

  insert(rule);

  let content = getContent(rule);

  if (rule.overrideRule) {
    content += ' ' + getContent(rule.overrideRule);
  }

  return content;
}

function getContent(rule: ReturnType<typeof buildRule>) {
  if (!rule) return '';

  return rule.parsedMediaQuery?.bucketQuery
    ? `${rule.parsedMediaQuery.bucketQuery} { ${rule.content} }`
    : rule.content;
}
