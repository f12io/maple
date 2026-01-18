import { OPTIONS } from '../../src/core/constants/config';
import { buildRule } from '../../src/core/generator';
import { insert } from '../../src/core/stylesheet';

export function convert(srcClass: string): string | undefined {
  return processResult(buildRule(srcClass));
}

export function convertWithRefs(srcClass: string): string | undefined {
  OPTIONS.refs = true;
  const result = buildRule(srcClass);
  OPTIONS.refs = false;

  return processResult(result);
}

function processResult(
  result: ReturnType<typeof buildRule>,
): string | undefined {
  if (!result) return;

  const { rule, parsedMediaQuery } = result;

  insert(rule, parsedMediaQuery);

  return parsedMediaQuery?.bucketQuery
    ? `${parsedMediaQuery.bucketQuery} { ${rule} }`
    : rule;
}
