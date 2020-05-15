import { MapleColorHelper } from './helpers/color.helper';

export const MAPLE_PROP_EXTENSION_MAP = {
  'margin-x': (val, important) =>
    `margin-left:${val} ${important};margin-right:${val} ${important};`,
  'margin-y': (val, important) =>
    `margin-top:${val} ${important};margin-bottom:${val} ${important};`,
  'padding-x': (val, important) =>
    `padding-left:${val} ${important};padding-right:${val} ${important};`,
  'padding-y': (val, important) =>
    `padding-top:${val} ${important};padding-bottom:${val} ${important};`,
  link: (val, important) => `
    color:${val} ${important};
  `,
  theme: (val, important) => `
    background-color:${val} ${important};
    border-color:${val} ${important};
    color:${MapleColorHelper.getContrastColor(val)} ${important};
  `,
  'theme-outline': (val, important) => `
    background-color: ${MapleColorHelper.getContrastColor(val)} ${important};
    border-color:${val} ${important};
    color:${val} ${important};
  `,
};
