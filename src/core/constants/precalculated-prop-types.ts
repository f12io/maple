import { PROP_TYPE_COLOR } from './config';

/**
 * This map will be used in the browser build. Only include
 * the ones that needs to be set manually. The rest will
 * be calculated at runtime.
 */
export const PRECALCULATED_PROP_TYPES: Record<string, number> = {
  background: PROP_TYPE_COLOR,
};
