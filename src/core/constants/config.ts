import { BucketType } from '../types';

export const CACHE_MAX_SIZE = 2000;
export const CACHE_EVICTION_BATCH = Math.floor(CACHE_MAX_SIZE * 0.25);

export const DEFAULT_BREAKPOINTS: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const REM_SIZE = 16;
export const COLOR_MID_TONE = 500;

export const PROP_TYPE_OTHER = 0;
export const PROP_TYPE_SPACE = 1;
export const PROP_TYPE_COLOR = 2;

export const MEDIA_BUCKET_TYPE_ORDER: Record<BucketType, number> = {
  base: 1,
  supports: 2,
  other: 10,
  mnw: 20,
  mxw: 30,
  mnh: 40,
  mxh: 50,
  orientation: 60,
  style: 70,
  stuck: 80,
  scrollable: 90,
  snapped: 100,
  prefers: 1000,
  initial: 9999,
};
