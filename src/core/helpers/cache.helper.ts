import {
  CACHE_EVICTION_BATCH,
  CACHE_MAX_SIZE,
  OPTIONS,
} from '../constants/config';
import { debugWarn } from './debug.helper';

let evictionCount = 0;

export function setCacheItem<T>(
  cache: Map<string, T>,
  cacheKey: string,
  value: T,
) {
  if (cache.has(cacheKey)) {
    return;
  }

  if (cache.size >= CACHE_MAX_SIZE) {
    if (OPTIONS.debug) {
      debugWarn(
        `cache eviction #${++evictionCount}: limit of ${CACHE_MAX_SIZE} reached, evicting ${CACHE_EVICTION_BATCH} oldest entries — repeated evictions suggest unbounded class generation`,
      );
    }

    const iterator = cache.keys();

    // Batch Eviction
    for (let i = 0; i < CACHE_EVICTION_BATCH; i++) {
      const key = iterator.next().value;

      if (key !== undefined) {
        cache.delete(key);
      }
    }
  }

  // Add the new item
  cache.set(cacheKey, value);
}
