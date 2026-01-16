import { CACHE_EVICTION_BATCH, CACHE_MAX_SIZE } from '../constants';

export function setCacheItem<T>(
  cache: Map<string, T>,
  cacheKey: string,
  value: T,
) {
  if (cache.has(cacheKey)) {
    return;
  }

  if (cache.size >= CACHE_MAX_SIZE) {
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
