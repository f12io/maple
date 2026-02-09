import { buildRule } from '../../src/core/builder';
import { OPTIONS } from '../../src/core/constants/config';
import { insert } from '../../src/core/stylesheet';

export function convert(srcClass: string): string | undefined {
  return processRule(buildRule(srcClass));
}

export function convertWithRefs(srcClass: string): string | undefined {
  OPTIONS.refs = 1;
  const result = buildRule(srcClass);
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
