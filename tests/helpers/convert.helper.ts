import { buildRule } from '../../src/core/generator';
import { setDisableCache } from '../../src/core/serializer';
import { insert } from '../../src/core/stylesheet';

export function convert(srcClass: string): string | undefined {
  setDisableCache(true);
  const result = buildRule(srcClass);
  setDisableCache(false);

  if (!result) return;

  const { rule, parsedMediaQuery } = result;

  insert(rule, parsedMediaQuery);

  return parsedMediaQuery?.bucketQuery
    ? `${parsedMediaQuery.bucketQuery} { ${rule} }`
    : rule;
}
