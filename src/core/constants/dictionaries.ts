import { PRECALCULATED_PROP_ABBREVIATIONS } from '../../generated/precalculated-prop-abbreviations';
import {
  DEFAULT_ANGLE_UNIT,
  DEFAULT_SPACE_UNIT,
  DEFAULT_TIME_UNIT,
} from './units';

export const ABBREVIATIONS: Record<string, string> =
  PRECALCULATED_PROP_ABBREVIATIONS;
export const ABBREVIATIONS_REVERSE: Record<string, string> = {};

Object.entries(PRECALCULATED_PROP_ABBREVIATIONS).forEach(([alias, prop]) => {
  ABBREVIATIONS_REVERSE[prop] = alias;
});

export const SHORTCUTS: Record<string, string> = {
  // position
  abs: 'position: absolute',
  fixed: 'position: fixed',
  rel: 'position: relative',
  sticky: 'position: sticky',
  static: 'position: static',

  // display
  iblock: 'display: inline-block',
  ifx: 'display: inline-flex',
  fx: 'display: flex',
  gr: 'display: grid',
  block: 'display: block',
  none: 'display: none',
  table: 'display: table',
  inline: 'display: inline',

  // visibility
  hidden: 'visibility: hidden',
  visible: 'visibility: visible',

  // border
  br: 'border-width: 1px; border-style: solid',
  brt: 'border-top-width: 1px; border-top-style: solid',
  brr: 'border-right-width: 1px; border-right-style: solid',
  brb: 'border-bottom-width: 1px; border-bottom-style: solid',
  brl: 'border-left-width: 1px; border-left-style: solid',

  // container
  cnt: 'container-type: inline-size',
};

export const SELECTOR_REPLACEMENTS: Record<string, string> = {
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
  rtl: '[dir="rtl"]',
  ltr: '[dir="ltr"]',
};

export const CONTAINER_TYPES = [
  'inline-size',
  'size',
  'scroll-state',
  'normal',
];

export const CSS_VARIABLE_CATEGORY: Record<string, string> = {
  [DEFAULT_SPACE_UNIT]: 'space',
  [DEFAULT_TIME_UNIT]: 'time',
  [DEFAULT_ANGLE_UNIT]: 'angle',
  tshadow: 'shadow',
  bshadow: 'shadow',
  dshadow: 'shadow',
  bdshadow: 'shadow',
  blur: 'space',
  bdblur: 'space',
  hue: 'angle',
  bdhue: 'angle',
  color: 'color',
  gradient: 'gradient',
  prop: 'prop',
};

export const FUNCTION_KEYS: Record<string, string> = {
  url: 'url',
  linear: 'linear-gradient',
  radial: 'radial-gradient',
  conic: 'conic-gradient',
  rlinear: 'repeating-linear-gradient',
  rradial: 'repeating-radial-gradient',
  rconic: 'repeating-conic-gradient',
};

export const TRANSFORM_KEYS: Record<string, string> = {
  tl: 'translate',
  tlx: 'translateX',
  tly: 'translateY',
  tlz: 'translateZ',
  tl3: 'translate3d',
  scale: 'scale',
  scalex: 'scaleX',
  scaley: 'scaleY',
  scalez: 'scaleZ',
  scale3: 'scale3d',
  rot: 'rotate',
  rotx: 'rotateX',
  roty: 'rotateY',
  rotz: 'rotateZ',
  rot3: 'rotate3d',
  skew: 'skew',
  skewx: 'skewX',
  skewy: 'skewY',
  mtx: 'matrix',
  mtx3: 'matrix3d',
};

export const FILTER_KEYS: Record<string, string> = {
  blur: 'blur',
  brightness: 'brightness',
  contrast: 'contrast',
  dshadow: 'drop-shadow',
  grayscale: 'grayscale',
  hue: 'hue-rotate',
  invert: 'invert',
  saturate: 'saturate',
  sepia: 'sepia',
};

export const BACKDROP_FILTER_KEYS: Record<string, string> = {
  bdblur: 'blur',
  bdbrightness: 'brightness',
  bdcontrast: 'contrast',
  bdshadow: 'drop-shadow',
  bdgrayscale: 'grayscale',
  bdhue: 'hue-rotate',
  bdinvert: 'invert',
  bdsaturate: 'saturate',
  bdsepia: 'sepia',
};

export const PROP_UNIT_MAP: Record<string, string> = {
  animation: DEFAULT_TIME_UNIT,
  animationDelay: DEFAULT_TIME_UNIT,
  animationDuration: DEFAULT_TIME_UNIT,
  transition: DEFAULT_TIME_UNIT,
  transitionDelay: DEFAULT_TIME_UNIT,
  transitionDuration: DEFAULT_TIME_UNIT,
  skew: DEFAULT_ANGLE_UNIT,
  skewX: DEFAULT_ANGLE_UNIT,
  skewY: DEFAULT_ANGLE_UNIT,
  offsetRotate: DEFAULT_ANGLE_UNIT,
  rotate: DEFAULT_ANGLE_UNIT,
  rotateX: DEFAULT_ANGLE_UNIT,
  rotateY: DEFAULT_ANGLE_UNIT,
  rotateZ: DEFAULT_ANGLE_UNIT,
  rotate3d: DEFAULT_ANGLE_UNIT,
  scale: '',
  scaleX: '',
  scaleY: '',
  scaleZ: '',
  scale3d: '',
  matrix: '',
  matrix3d: '',
  brightness: '',
  contrast: '',
  grayscale: '',
  invert: '',
  saturate: '',
  sepia: '',
  hue: DEFAULT_ANGLE_UNIT,
  bdbrightness: '',
  bdcontrast: '',
  bdgrayscale: '',
  bdinvert: '',
  bdsaturate: '',
  bdsepia: '',
  bdhue: DEFAULT_ANGLE_UNIT,
};

const webkit = '-webkit-';

export const VENDOR_PREFIXES: Record<string, Array<string> | undefined> = {
  appearance: [webkit],
  'user-select': [webkit],
  'print-color-adjust': [webkit],
  'text-size-adjust': [webkit],
};

// Flex position value mappings (compact)
export const FLEX_V: Record<string, string> = {
  t: 'flex-start',
  c: 'center',
  b: 'flex-end',
  s: 'stretch',
  w: 'space-between',
};
export const FLEX_H: Record<string, string> = {
  l: 'flex-start',
  c: 'center',
  r: 'flex-end',
  w: 'space-between',
};
