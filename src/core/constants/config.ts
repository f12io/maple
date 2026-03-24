import { BucketType } from '../types';

export const OPTIONS: {
  refs: 1 | 0;
  nomerge: 1 | 0;
  batching: 1 | 0;
  nohybrid: 1 | 0;
  breakpoints: Record<string, string>;
} = {
  refs: 0,
  nomerge: 0,
  batching: 0,
  nohybrid: 0,
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export const CACHE_MAX_SIZE = 2000;
export const CACHE_EVICTION_BATCH = Math.floor(CACHE_MAX_SIZE * 0.25);

export const COLOR_MIN_TONE = 50;
export const COLOR_MAX_TONE = 950;

export const PROP_TYPE_OTHER = 0;
export const PROP_TYPE_SPACE = 1;
export const PROP_TYPE_COLOR = 2;
export const PROP_TYPE_VARIABLE = 3;

export const MEDIA_BUCKET_TYPE_ORDER: Record<BucketType, number> = {
  base: 1,
  mnw: 20,
  mxw: 30,
  mnh: 40,
  mxh: 50,
  orientation: 60,
  style: 70,
  scroll: 80,
  light: 90,
  dark: 100,
  prefers: 110,
  supports: 120,
  static: 130,
};
