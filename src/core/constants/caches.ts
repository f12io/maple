import { MediaQueryBucketParams, ParsedSelector } from '../types';

export const CLASS_CACHE = new Map<string, string | undefined>();
export const VARIABLE_CACHE = new Set<string>();
export const PROP_TYPE_CACHE = new Map<string, number>();
export const MEDIA_QUERY_CACHE = new Map<string, MediaQueryBucketParams>();
export const SELECTOR_CACHE = new Map<string, ParsedSelector>();
