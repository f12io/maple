import { IMapleVariableModel } from './types/variables.model';

export const getMapleUtilityClassMap = ({
  fontFamily,
  fontSize,
  fontWeight,
  maxWidth,
  spacer,
  transition,
  button,
  alert,
}: IMapleVariableModel) => {
  const buttonCommonStyles = {
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    'font-weight': button.normal.fontWeight,
    'user-select': 'none',
    'border-style': 'solid',
    'white-space': 'nowrap',
    'border-width': button.normal.borderWidth,
    'border-radius': button.normal.borderRadius,
    'font-size': button.normal.fontSize,
    'line-height': button.normal.lineHeight,
    'text-decoration': 'none',
    'text-transform': button.normal.textCase || 'none',
    'letter-spacing': button.normal.letterSpacing || 'normal',
    padding: button.normal.padding,
    transition: `
      color ${button.transitionDuration} ${button.transitionTiming},
      background-color ${button.transitionDuration} ${button.transitionTiming},
      border-color ${button.transitionDuration} ${button.transitionTiming}
    `,
  };

  const alertCommonStyles = {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'flex-start',
    'font-weight': alert.normal.fontWeight,
    'user-select': 'none',
    'border-style': 'solid',
    'border-width': alert.normal.borderWidth,
    'border-radius': alert.normal.borderRadius,
    'font-size': alert.normal.fontSize,
    'line-height': alert.normal.lineHeight,
    'text-decoration': 'none',
    padding: alert.normal.padding,
  };

  return {
    alert: {
      _common: alertCommonStyles,
    },

    'alert-outline': {
      _common: alertCommonStyles,
    },

    'alert-size': {
      small: {
        'border-width': alert.small.borderWidth,
        'border-radius': alert.small.borderRadius,
        'font-size': alert.small.fontSize,
        'font-weight': alert.small.fontWeight,
        'line-height': alert.small.lineHeight,
        padding: alert.small.padding,
      },
      normal: {
        'border-width': alert.normal.borderWidth,
        'border-radius': alert.normal.borderRadius,
        'font-size': alert.normal.fontSize,
        'font-weight': alert.normal.fontWeight,
        'line-height': alert.normal.lineHeight,
        padding: alert.normal.padding,
      },
      medium: {
        'border-width': alert.medium.borderWidth,
        'border-radius': alert.medium.borderRadius,
        'font-size': alert.medium.fontSize,
        'font-weight': alert.medium.fontWeight,
        'line-height': alert.medium.lineHeight,
        padding: alert.medium.padding,
      },
      large: {
        'border-width': alert.large.borderWidth,
        'border-radius': alert.large.borderRadius,
        'font-size': alert.large.fontSize,
        'font-weight': alert.large.fontWeight,
        'line-height': alert.large.lineHeight,
        padding: alert.large.padding,
      },
    },

    // animation
    animation: {
      '*': { animation: '*' },
    },

    // background-image
    bgi: {
      none: { 'background-image': 'none' },
      '*': { 'background-image': 'url("*")' },
    },

    // background-repeat
    'bg-repeat': {
      no: { 'background-repeat': 'no-repeat' },
      yes: { 'background-repeat': 'repeat' },
      '*': { 'background-repeat': '*' },
    },

    // border
    b: {
      none: { border: 'none' },
      '*': { border: '*' },
    },

    // border-radius
    br: {
      full: { 'border-radius': '100%' },
      half: { 'border-radius': '50%' },
      quarter: { 'border-radius': '25%' },
      0: { 'border-radius': 0 },
      '*': { 'border-radius': '*' },
    },

    // border-spacing

    'border-spacing': {
      0: { 'border-spacing': 0 },
      '*': { 'border-spacing': '*' },
    },

    // border-collapse

    'border-collapse': {
      collapse: { 'border-collapse': 'collapse' },
      revert: { 'border-collapse': 'revert' },
      separate: { 'border-collapse': 'separate' },
      '*': { 'border-collapse': '*' },
    },

    // box-shadow
    bs: {
      none: { 'box-shadow': 'none' },
      '*': { 'box-shadow': '*' },
    },

    bw: {
      _common: { 'border-style': 'solid' },
      0: { 'border-width': '0' },
      '*': { 'border-width': '*' },
    },

    'bw-top': {
      _common: { 'border-top-style': 'solid' },
      0: { 'border-top-width': '0' },
      '*': { 'border-top-width': '*' },
    },

    'bw-bottom': {
      _common: { 'border-bottom-style': 'solid' },
      0: { 'border-bottom-width': '0' },
      '*': { 'border-bottom-width': '*' },
    },

    'bw-left': {
      _common: { 'border-left-style': 'solid' },
      0: { 'border-left-width': '0' },
      '*': { 'border-left-width': '*' },
    },

    'bw-right': {
      _common: { 'border-right-style': 'solid' },
      0: { 'border-right-width': '0' },
      '*': { 'border-right-width': '*' },
    },

    link: {
      _common: {
        ...buttonCommonStyles,
        border: 'none',
        'text-decoration': 'underline',
        'background-color': 'transparent',
      },
    },

    btn: {
      _common: buttonCommonStyles,
    },

    'btn-outline': {
      _common: buttonCommonStyles,
    },

    'btn-size': {
      small: {
        'border-width': button.small.borderWidth,
        'border-radius': button.small.borderRadius,
        'font-size': button.small.fontSize,
        'font-weight': button.small.fontWeight,
        'line-height': button.small.lineHeight,
        'text-transform': button.small.textCase || 'none',
        'letter-spacing': button.small.letterSpacing || 'normal',
        padding: button.small.padding,
      },
      normal: {
        'border-width': button.normal.borderWidth,
        'border-radius': button.normal.borderRadius,
        'font-size': button.normal.fontSize,
        'font-weight': button.normal.fontWeight,
        'line-height': button.normal.lineHeight,
        'text-transform': button.normal.textCase || 'none',
        'letter-spacing': button.normal.letterSpacing || 'normal',
        padding: button.normal.padding,
      },
      medium: {
        'border-width': button.medium.borderWidth,
        'border-radius': button.medium.borderRadius,
        'font-size': button.medium.fontSize,
        'font-weight': button.medium.fontWeight,
        'line-height': button.medium.lineHeight,
        'text-transform': button.medium.textCase || 'none',
        'letter-spacing': button.medium.letterSpacing || 'normal',
        padding: button.medium.padding,
      },
      large: {
        'border-width': button.large.borderWidth,
        'border-radius': button.large.borderRadius,
        'font-size': button.large.fontSize,
        'font-weight': button.large.fontWeight,
        'line-height': button.large.lineHeight,
        'text-transform': button.large.textCase || 'none',
        'letter-spacing': button.large.letterSpacing || 'normal',
        padding: button.large.padding,
      },
    },

    // mix-blend-mode
    blend: {
      'color-burn': { 'mix-blend-mode': 'color-burn' },
      'color-dodge': { 'mix-blend-mode': 'color-dodge' },
      'hard-light': { 'mix-blend-mode': 'hard-light' },
      'soft-light': { 'mix-blend-mode': 'soft-light' },
      color: { 'mix-blend-mode': 'color' },
      darken: { 'mix-blend-mode': 'darken' },
      difference: { 'mix-blend-mode': 'difference' },
      exclusion: { 'mix-blend-mode': 'exclusion' },
      hue: { 'mix-blend-mode': 'hue' },
      inherit: { 'mix-blend-mode': 'inherit' },
      lighten: { 'mix-blend-mode': 'lighten' },
      luminosity: { 'mix-blend-mode': 'luminosity' },
      multiply: { 'mix-blend-mode': 'multiply' },
      normal: { 'mix-blend-mode': 'normal' },
      overlay: { 'mix-blend-mode': 'overlay' },
      saturation: { 'mix-blend-mode': 'saturation' },
      screen: { 'mix-blend-mode': 'screen' },
    },

    // backdrop blur
    'backdrop-blur': {
      0: { 'backdrop-filter': 'blur(0)' },
      '*': { 'backdrop-filter': 'blur(*)' },
    },

    // filter invert
    invert: {
      full: { filter: 'invert(1)' },
      none: { filter: 'invert(0)' },
      '*': { filter: 'invert(*)' },
    },

    grayscale: {
      full: { filter: 'grayscale(1)' },
      none: { filter: 'grayscale(0)' },
      '*': { filter: 'grayscale(*)' },
    },

    content: {
      '*': { content: '"*"' },
    },

    // element attribute
    attr: {
      '*': { content: 'attr(*)' },
    },

    // column-count
    'col-count': {
      1: { 'column-count': 1 },
      2: { 'column-count': 2 },
      3: { 'column-count': 3 },
      4: { 'column-count': 4 },
      5: { 'column-count': 5 },
      '*': { 'column-count': '*' },
    },

    // column-rule-width
    'col-bw': {
      _common: { 'column-rule-width': 'solid' },
      0: { 'column-rule-width': '0' },
      '*': { 'column-rule-width': '*' },
    },

    // column-span
    'col-span': {
      all: { 'column-span': 'all' },
      none: { 'column-span': 'none' },
    },

    // cursor
    cursor: {
      pointer: { cursor: 'pointer' },
      default: { cursor: 'default' },
      '*': { cursor: '*' },
    },

    // break-after
    'break-before': {
      yes: { 'break-before': 'column' },
      no: { 'break-before': 'avoid' },
    },

    // break-before
    'break-after': {
      yes: { 'break-after': 'column' },
      no: { 'break-after': 'avoid' },
    },

    // break-inside
    'break-inside': {
      yes: { 'break-inside': 'column' },
      no: { 'break-inside': 'avoid' },
    },

    // display
    d: {
      none: { display: 'none' },
      block: { display: 'block' },
      inline: { display: 'inline' },
      inblock: { display: 'inline-block' },
      flx: { display: 'flex' },
      inflx: { display: 'inline-flex' },
      table: { display: 'table' },
      trow: { display: 'table-row' },
      tcell: { display: 'table-cell' },
      litem: { display: 'list-item' },
    },

    // headings from 1 to 6
    fh: {
      _common: { 'font-weight': fontWeight.heading },
      1: {
        'font-size': fontSize.h1,
        'margin-bottom': spacer[5],
      },
      2: {
        'font-size': fontSize.h2,
        'margin-bottom': spacer[4],
      },
      3: {
        'font-size': fontSize.h3,
        'margin-bottom': spacer[3],
      },
      4: {
        'font-size': fontSize.h4,
        'margin-bottom': spacer[3],
      },
      5: {
        'font-size': fontSize.h5,
        'margin-bottom': spacer[3],
      },
      6: {
        'font-size': fontSize.h6,
        'margin-bottom': spacer[2],
      },
    },

    // pragraph from 1 to 6
    fp: {
      1: {
        'font-size': fontSize.p1,
        'margin-bottom': spacer[2],
      },
      2: {
        'font-size': fontSize.p2,
        'margin-bottom': spacer[2],
      },
      3: {
        'font-size': fontSize.p3,
        'margin-bottom': spacer[2],
      },
      4: {
        'font-size': fontSize.p4,
        'margin-bottom': spacer[1],
      },
      5: {
        'font-size': fontSize.p5,
        'margin-bottom': spacer[1],
      },
      6: {
        'font-size': fontSize.p6,
        'margin-bottom': spacer[1],
      },
    },

    // font-size
    fs: {
      inherit: { 'font-size': 'inherit' },
      h1: { 'font-size': fontSize.h1 },
      h2: { 'font-size': fontSize.h2 },
      h3: { 'font-size': fontSize.h3 },
      h4: { 'font-size': fontSize.h4 },
      h5: { 'font-size': fontSize.h5 },
      h6: { 'font-size': fontSize.h6 },
      p1: { 'font-size': fontSize.p1 },
      p2: { 'font-size': fontSize.p2 },
      p3: { 'font-size': fontSize.p3 },
      p4: { 'font-size': fontSize.p4 },
      p5: { 'font-size': fontSize.p5 },
      p6: { 'font-size': fontSize.p6 },
      i1: { 'font-size': fontSize.i1 },
      i2: { 'font-size': fontSize.i2 },
      i3: { 'font-size': fontSize.i3 },
      i4: { 'font-size': fontSize.i4 },
      i5: { 'font-size': fontSize.i5 },
      i6: { 'font-size': fontSize.i6 },
      '*': { 'font-size': '*' },
    },

    // font-weight
    fw: {
      light: { 'font-weight': fontWeight.light },
      regular: { 'font-weight': fontWeight.regular },
      normal: { 'font-weight': fontWeight.regular }, // alias
      medium: { 'font-weight': fontWeight.medium },
      semi: { 'font-weight': fontWeight.semi },
      bold: { 'font-weight': fontWeight.bold },
      extra: { 'font-weight': fontWeight.extra },
      heading: { 'font-weight': fontWeight.heading },
    },

    // font-style
    fi: {
      yes: { 'font-style': 'italic' },
      no: { 'font-style': 'normal' },
    },

    // flex-column align-self
    'flx-col-align-self': {
      'top-left': { 'justify-self': 'flex-start', 'align-self': 'flex-start' },
      'top-center': { 'justify-self': 'flex-start', 'align-self': 'center' },
      'top-right': { 'justify-self': 'flex-start', 'align-self': 'flex-end' },
      'center-left': { 'justify-self': 'center', 'align-self': 'flex-start' },
      'center-center': { 'justify-self': 'center', 'align-self': 'center' },
      'center-right': { 'justify-self': 'center', 'align-self': 'flex-end' },
      'bottom-left': { 'justify-self': 'flex-end', 'align-self': 'flex-start' },
      'bottom-center': { 'justify-self': 'flex-end', 'align-self': 'center' },
      'bottom-right': { 'justify-self': 'flex-end', 'align-self': 'flex-end' },
    },

    // flex-colum-align
    'flx-col-align': {
      _common: { display: 'flex', 'flex-direction': 'column' },
      'top-left': {
        'justify-content': 'flex-start',
        'align-items': 'flex-start',
      },
      'top-center': {
        'justify-content': 'flex-start',
        'align-items': 'center',
      },
      'top-right': {
        'justify-content': 'flex-start',
        'align-items': 'flex-end',
      },
      'center-left': {
        'justify-content': 'center',
        'align-items': 'flex-start',
      },
      'center-center': { 'justify-content': 'center', 'align-items': 'center' },
      'center-right': {
        'justify-content': 'center',
        'align-items': 'flex-end',
      },
      'bottom-left': {
        'justify-content': 'flex-end',
        'align-items': 'flex-start',
      },
      'bottom-center': {
        'justify-content': 'flex-end',
        'align-items': 'center',
      },
      'bottom-right': {
        'justify-content': 'flex-end',
        'align-items': 'flex-end',
      },
      'between-left': {
        'justify-content': 'space-between',
        'align-items': 'flex-start',
      },
      'between-center': {
        'justify-content': 'space-between',
        'align-items': 'center',
      },
      'between-right': {
        'justify-content': 'space-between',
        'align-items': 'flex-end',
      },
    },

    // flex-row align-self
    'flx-row-align-self': {
      none: { 'align-self': 'normal', 'justify-self': 'normal' },
      'top-left': { 'align-self': 'flex-start', 'justify-self': 'flex-start' },
      'top-center': { 'align-self': 'flex-start', 'justify-self': 'center' },
      'top-right': { 'align-self': 'flex-start', 'justify-self': 'flex-end' },
      'center-left': { 'align-self': 'center', 'justify-self': 'flex-start' },
      'center-center': { 'align-self': 'center', 'justify-self': 'center' },
      'center-right': { 'align-self': 'center', 'justify-self': 'flex-end' },
      'bottom-left': { 'align-self': 'flex-end', 'justify-self': 'flex-start' },
      'bottom-center': { 'align-self': 'flex-end', 'justify-self': 'center' },
      'bottom-right': { 'align-self': 'flex-end', 'justify-self': 'flex-end' },
    },

    // flex-row-align
    'flx-row-align': {
      _common: { display: 'flex', 'flex-direction': 'row' },
      'top-left': {
        'align-items': 'flex-start',
        'justify-content': 'flex-start',
      },
      'top-center': {
        'align-items': 'flex-start',
        'justify-content': 'center',
      },
      'top-right': {
        'align-items': 'flex-start',
        'justify-content': 'flex-end',
      },
      'top-between': {
        'align-items': 'flex-start',
        'justify-content': 'space-between',
      },
      'center-left': {
        'align-items': 'center',
        'justify-content': 'flex-start',
      },
      'center-center': { 'align-items': 'center', 'justify-content': 'center' },
      'center-right': {
        'align-items': 'center',
        'justify-content': 'flex-end',
      },
      'center-between': {
        'align-items': 'center',
        'justify-content': 'space-between',
      },
      'bottom-left': {
        'align-items': 'flex-end',
        'justify-content': 'flex-start',
      },
      'bottom-center': {
        'align-items': 'flex-end',
        'justify-content': 'center',
      },
      'bottom-right': {
        'align-items': 'flex-end',
        'justify-content': 'flex-end',
      },
      'bottom-between': {
        'align-items': 'flx-end',
        'justify-content': 'space-between',
      },
      'stretch-left': {
        'align-items': 'stretch',
        'justify-content': 'flex-start',
      },
      'stretch-center': {
        'align-items': 'stretch',
        'justify-content': 'center',
      },
      'stretch-right': {
        'align-items': 'stretch',
        'justify-content': 'flex-end',
      },
      'stretch-between': {
        'align-items': 'stretch',
        'justify-content': 'space-between',
      },
    },

    // flex-direction
    'flx-dir': {
      col: { 'flex-direction': 'column' },
      row: { 'flex-direction': 'row' },
      colrev: { 'flex-direction': 'column-reverse' },
      rowrev: { 'flex-direction': 'row-reverse' },
    },

    // justify-content
    'flx-justify-content': {
      center: { 'justify-content': 'center' },
      start: { 'justify-content': 'flex-start' },
      end: { 'justify-content': 'flex-end' },
      between: { 'justify-content': 'space-between' },
      around: { 'justify-content': 'space-around' },
    },

    // align-items
    'flx-align-items': {
      center: { 'align-items': 'center' },
      start: { 'align-items': 'flex-start' },
      end: { 'align-items': 'flex-end' },
    },

    // object-fit
    ofit: {
      none: { 'object-fit': 'none' },
      contain: { 'object-fit': 'contain' },
      cover: { 'object-fit': 'cover' },
      fill: { 'object-fit': 'fill' },
      scaledown: { 'object-fit': 'scale-down' },
    },

    // object-position
    opos: {
      none: { 'object-position': 'unset' },
      center: { 'object-position': 'center' },
      '*': { 'object-position': '*' },
    },

    // order
    'flx-order': {
      n1: { order: -1 },
      0: { order: 0 },
      1: { order: 1 },
      2: { order: 2 },
      3: { order: 3 },
      4: { order: 4 },
      5: { order: 5 },
      6: { order: 6 },
      7: { order: 7 },
      8: { order: 8 },
      9: { order: 9 },
      10: { order: 10 },
      11: { order: 11 },
      12: { order: 12 },
      '*': { order: '*' },
    },

    // flex-wrap
    'flx-wrap': {
      yes: { 'flex-wrap': 'wrap' },
      no: { 'flex-wrap': 'nowrap' },
      rev: { 'flex-wrap': 'wrap-reverse' },
    },

    // flex
    flx: {
      fill: { flex: '1 1 auto' },
      '*': { flex: '*' },
    },

    // flex-grow
    'flx-grow': {
      0: { 'flex-grow': '0' },
      1: { 'flex-grow': '1' },
    },

    // flex-shrink
    'flx-shrink': {
      0: { 'flex-shrink': '0' },
      1: { 'flex-shrink': '1' },
    },

    // flex-basis
    'flx-basis': {
      auto: { 'flex-basis': 'auto' },
    },

    // float
    float: {
      left: { float: 'left' },
      right: { float: 'right' },
      none: { float: 'none' },
    },

    'grid-row-temp': {
      1: { 'grid-template-rows': 'auto' },
      2: { 'grid-template-rows': 'auto auto' },
      '*': { 'grid-template-rows': '*' },
    },

    'grid-col-temp': {
      1: { 'grid-template-columns': 'auto' },
      2: { 'grid-template-columns': 'repeat(2, auto)' },
      3: { 'grid-template-columns': 'repeat(3, auto)' },
      4: { 'grid-template-columns': 'repeat(4, auto)' },
      5: { 'grid-template-columns': 'repeat(5, auto)' },
      6: { 'grid-template-columns': 'repeat(6, auto)' },
      7: { 'grid-template-columns': 'repeat(7, auto)' },
      8: { 'grid-template-columns': 'repeat(8, auto)' },
      9: { 'grid-template-columns': 'repeat(9, auto)' },
      10: { 'grid-template-columns': 'repeat(10, auto)' },
      11: { 'grid-template-columns': 'repeat(11, auto)' },
      12: { 'grid-template-columns': 'repeat(12, auto)' },
      '*': { 'grid-template-columns': '*' },
    },

    'grid-row-start': {
      '*': { 'grid-row-start': '*' },
    },

    'grid-row-end': {
      '*': { 'grid-row-end': '*' },
    },

    'grid-col-start': {
      '*': { 'grid-column-start': '*' },
    },

    'grid-col-end': {
      '*': { 'grid-column-end': '*' },
    },

    // list-style
    'list-style': {
      none: { 'list-style': 'none', margin: 0, padding: 0 },
      '*': { 'list-style': '*' },
    },

    // list-style-positiom
    'list-style-position': {
      inside: { 'list-style-position': 'inside' },
      outside: { 'list-style-position': 'outside' },
      '*': { 'list-style-position': '*' },
    },

    // linear-gradient
    'linear-gradient': {
      '*': { background: 'linear-gradient(*)' },
    },

    // line-height
    lh: {
      0: { 'line-height': 0 },
      1: { 'line-height': 1 },
      1.125: { 'line-height': 1.125 },
      1.25: { 'line-height': 1.25 },
      1.375: { 'line-height': 1.375 },
      1.5: { 'line-height': 1.5 },
      1.625: { 'line-height': 1.625 },
      1.75: { 'line-height': 1.75 },
      1.875: { 'line-height': 1.875 },
      2: { 'line-height': 2 },
      2.25: { 'line-height': 2.25 },
      2.5: { 'line-height': 2.5 },
      2.75: { 'line-height': 2.75 },
      3: { 'line-height': 3 },
      3.5: { 'line-height': 3.5 },
      4: { 'line-height': 4 },
      5: { 'line-height': 5 },
      '*': { 'line-height': '*' },
    },

    ls: {
      'n.2': { 'letter-spacing': '-.2rem' },
      'n.18': { 'letter-spacing': '-.18rem' },
      'n.16': { 'letter-spacing': '-.16rem' },
      'n.14': { 'letter-spacing': '-.14rem' },
      'n.12': { 'letter-spacing': '-.12rem' },
      'n.1': { 'letter-spacing': '-.1rem' },
      'n.08': { 'letter-spacing': '-.08rem' },
      'n.06': { 'letter-spacing': '-.06rem' },
      'n.04': { 'letter-spacing': '-.04rem' },
      'n.02': { 'letter-spacing': '-.02rem' },
      0: { 'letter-spacing': 0 },
      '.02': { 'letter-spacing': '.02rem' },
      '.04': { 'letter-spacing': '.04rem' },
      '.06': { 'letter-spacing': '.06rem' },
      '.08': { 'letter-spacing': '.08rem' },
      '.1': { 'letter-spacing': '.1rem' },
      '.12': { 'letter-spacing': '.12rem' },
      '.14': { 'letter-spacing': '.14rem' },
      '.16': { 'letter-spacing': '.16rem' },
      '.18': { 'letter-spacing': '.18rem' },
      '.2': { 'letter-spacing': '.2rem' },
      '.4': { 'letter-spacing': '.4rem' },
      '.6': { 'letter-spacing': '.6rem' },
      '.8': { 'letter-spacing': '.8rem' },
      1: { 'letter-spacing': '1rem' },
      2: { 'letter-spacing': '2rem' },
      '*': { 'letter-spacing': '*' },
    },

    // opacity
    opacity: {
      0: { opacity: 0 },
      10: { opacity: 0.1 },
      20: { opacity: 0.2 },
      30: { opacity: 0.3 },
      40: { opacity: 0.4 },
      50: { opacity: 0.5 },
      60: { opacity: 0.6 },
      70: { opacity: 0.7 },
      80: { opacity: 0.8 },
      90: { opacity: 0.9 },
      100: { opacity: 1 },
      '*': { opacity: '*' },
    },

    // outline
    outline: {
      none: { outline: 'none' },
      '*': { outline: '*' },
    },

    // outline-width
    ow: {
      _common: { 'outline-style': 'solid' },
      0: { 'outline-width': '0' },
      '*': { 'outline-width': '*' },
    },

    // outline-offset
    oo: {
      0: { 'outline-offset': '0' },
      '*': { 'outline-offset': '*' },
    },

    // position align
    'pos-align': {
      _common: {
        position: 'absolute',
      },
      none: {
        position: 'static',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        transform: 'none',
      },
      'top-left': {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: 0,
        transform: 'none',
      },
      'top-center': {
        bottom: 'auto',
        left: '50%',
        right: 'auto',
        top: 0,
        transform: 'translateX(-50%)',
      },
      'top-right': {
        bottom: 'auto',
        left: 'auto',
        right: 0,
        top: 0,
        transform: 'none',
      },
      'center-left': {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      'center-center': {
        bottom: 'auto',
        left: '50%',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
      'center-right': {
        bottom: 'auto',
        left: 'auto',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      },
      'bottom-left': {
        bottom: 0,
        left: 0,
        right: 'auto',
        top: 'auto',
        transform: 'none',
      },
      'bottom-center': {
        bottom: 0,
        left: '50%',
        right: 'auto',
        top: 'auto',
        transform: 'translateX(-50%)',
      },
      'bottom-right': {
        bottom: 0,
        left: 'auto',
        right: 0,
        top: 'auto',
        transform: 'none',
      },
      'bottom-stretch': {
        bottom: 0,
        left: 0,
        right: 0,
        top: 'auto',
        transform: 'none',
      },
      'top-stretch': {
        bottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        transform: 'none',
      },
    },

    // position overlay
    'pos-overlay': {
      _common: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      abs: { position: 'absolute' },
      fix: { position: 'fixed' },
    },

    // position overlay link
    'pos-overlay-link': {
      _common: {
        border: 'none',
        bottom: 0,
        cursor: 'pointer',
        'font-size': 0,
        left: 0,
        'line-height': 0,
        margin: 0,
        opacity: 0,
        overflow: 'hidden',
        padding: 0,
        right: 0,
        top: 0,
        'white-space': 'nowrap',
        'z-index': 1,
      },
      abs: { position: 'absolute' },
      fix: { position: 'fixed' },
    },

    // position
    pos: {
      abs: { position: 'absolute' },
      fix: { position: 'fixed' },
      rel: { position: 'relative' },
      static: { position: 'static' },
      sticky: { position: 'sticky' },
    },

    // pointer-events
    'pointer-events': {
      disabled: { 'pointer-events': 'none' },
      active: { 'pointer-events': 'auto' },
    },

    rtl: {
      yes: { direction: 'rtl' },
      no: { direction: 'ltr' },
    },

    // overflow
    scrollable: {
      _common: { 'flex-wrap': 'nowrap' },
      all: { overflow: 'auto' },
      visible: { overflow: 'visible' },
      none: { overflow: 'hidden', 'flex-wrap': 'wrap !important' },
      hidden: { overflow: 'hidden' },
      x: { 'overflow-x': 'auto', 'overflow-y': 'hidden' },
      y: { 'overflow-y': 'auto', 'overflow-x': 'hidden' },
    },

    // visiblity
    visible: {
      yes: { visibility: 'visible' },
      no: { visibility: 'hidden' },
    },

    // transition
    transition: {
      all: { transition: `all ${transition.duration} ${transition.timing}` },
      bgc: {
        transition: `background-color ${transition.duration} ${transition.timing}`,
      },
      fc: {
        transition: `color ${transition.duration} ${transition.timing}`,
      },
      w: { transition: `width ${transition.duration} ${transition.timing}` },
      h: {
        transition: `height ${transition.duration} ${transition.timing}`,
      },
      hmax: {
        transition: `max-height ${transition.duration} ${transition.timing}`,
      },
      transform: {
        transition: `transform ${transition.duration} ${transition.timing}`,
      },
      opacity: {
        transition: `opacity ${transition.duration} ${transition.timing}`,
      },
      none: { transition: 'none' },
      '*': { transition: '*' },
    },

    // transform rotate
    rotate: {
      n180: { transform: 'rotate(-180deg)' },
      n135: { transform: 'rotate(-135deg)' },
      n90: { transform: 'rotate(-90deg)' },
      n45: { transform: 'rotate(-45deg)' },
      0: { transform: 'rotate(0)' },
      45: { transform: 'rotate(45deg)' },
      90: { transform: 'rotate(90deg)' },
      135: { transform: 'rotate(135deg)' },
      180: { transform: 'rotate(180deg)' },
      '*': { transform: 'rotate(*)' },
    },

    // transform translate
    translate: {
      0: { transform: 'translate(0, 0)' },
      '*': { transform: 'translate(*)' },
    },

    'translate-x': {
      n50: { transform: 'translateX(-50%)' },
      n100: { transform: 'translateX(-100%)' },
      0: { transform: 'translateX(0)' },
      50: { transform: 'translateX(50%)' },
      100: { transform: 'translateX(100%)' },
      '*': { transform: 'translateX(*)' },
    },

    'translate-y': {
      n50: { transform: 'translateY(-50%)' },
      n100: { transform: 'translateY(-100%)' },
      0: { transform: 'translateY(0)' },
      50: { transform: 'translateY(50%)' },
      100: { transform: 'translateY(100%)' },
      '*': { transform: 'translateY(*)' },
    },

    'translate-z': {
      n100: { transform: 'translateZ(-100%)' },
      0: { transform: 'translateZ(0)' },
      100: { transform: 'translateZ(100%)' },
      '*': { transform: 'translateZ(*)' },
    },

    // transform scale
    scale: {
      default: { transform: 'scale(1)' },
      '*': { transform: 'scale(*)' },
    },

    'scale-x': {
      1: { transform: 'scaleX(1)' },
      n1: { transform: 'scaleX(-1)' },
      '*': { transform: 'scaleX(*)' },
    },

    // transform-origin
    'transform-o': {
      0: { 'transform-origin': '0 0' },
      '100-0': { 'transform-origin': '100% 0' },
    },

    // text-align
    'txt-align': {
      left: { 'text-align': 'left' },
      center: { 'text-align': 'center' },
      right: { 'text-align': 'right' },
      justify: { 'text-align': 'justify' },
    },

    // text-shadow
    'txt-shadow': {
      '*': { 'text-shadow': '*' },
    },

    // white-space
    'txt-wrap': {
      yes: { 'white-space': 'normal' },
      no: { 'white-space': 'nowrap' },
      '*': { 'white-space': '*' },
    },

    // text-transform
    'txt-case': {
      none: { 'text-transform': 'none' },
      lower: { 'text-transform': 'lowercase' },
      upper: { 'text-transform': 'uppercase' },
      title: { 'text-transform': 'capitalize' },
    },

    // ellipsis
    'txt-truncate': {
      yes: {
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
      },
      no: {
        overflow: 'initial',
        'text-overflow': 'initial',
        'white-space': 'wrap',
      },
    },

    'txt-underline': {
      yes: { 'text-decoration': 'underline' },
      no: { 'text-decoration': 'none' },
    },

    'txt-line-through': {
      yes: { 'text-decoration': 'line-through' },
      no: { 'text-decoration': 'none' },
    },

    'v-align': {
      none: { 'vertical-align': 'unset' },
      top: { 'vertical-align': 'top' },
      middle: { 'vertical-align': 'middle' },
      bottom: { 'vertical-align': 'bottom' },
      sub: { 'vertical-align': 'sub' },
      sup: { 'vertical-align': 'super' },
      '*': { 'vertical-align': '*' },
    },

    // stroke-width
    'stroke-width': {
      0: { 'stroke-width': 0 },
      1: { 'stroke-width': 1 },
      1.1: { 'stroke-width': 1.1 },
      1.2: { 'stroke-width': 1.2 },
      1.3: { 'stroke-width': 1.3 },
      1.4: { 'stroke-width': 1.4 },
      1.5: { 'stroke-width': 1.5 },
      1.6: { 'stroke-width': 1.6 },
      1.7: { 'stroke-width': 1.7 },
      1.8: { 'stroke-width': 1.8 },
      1.9: { 'stroke-width': 1.9 },
      2: { 'stroke-width': 2 },
      3: { 'stroke-width': 3 },
      4: { 'stroke-width': 4 },
      '*': { 'stroke-width': '*' },
    },

    // width
    w: {
      '100vw': { width: '100vw' },
      cover: {
        left: '50%',
        'margin-left': '-50vw',
        'margin-right': '-50vw',
        position: 'relative',
        right: '50%',
        width: '100vw',
      },
      auto: { width: 'auto' },
      0: { width: 0 },
      5: { width: '5%' },
      10: { width: '10%' },
      15: { width: '15%' },
      20: { width: '20%' },
      25: { width: '25%' },
      30: { width: '30%' },
      33: { width: '33%' },
      35: { width: '35%' },
      40: { width: '40%' },
      45: { width: '45%' },
      50: { width: '50%' },
      55: { width: '55%' },
      60: { width: '60%' },
      65: { width: '65%' },
      66: { width: '66%' },
      70: { width: '70%' },
      75: { width: '75%' },
      80: { width: '80%' },
      85: { width: '85%' },
      90: { width: '90%' },
      95: { width: '95%' },
      100: { width: '100%' },
      '*': { width: '*' },
    },

    // max-width
    wmax: {
      narrow: { 'max-width': maxWidth.sm },
      normal: { 'max-width': maxWidth.md },
      wide: { 'max-width': maxWidth.lg },
      vast: { 'max-width': maxWidth.xl },
      extra: { 'max-width': maxWidth.xxl },
      5: { 'max-width': '5%' },
      10: { 'max-width': '10%' },
      15: { 'max-width': '15%' },
      20: { 'max-width': '20%' },
      25: { 'max-width': '25%' },
      30: { 'max-width': '30%' },
      33: { 'max-width': '33%' },
      35: { 'max-width': '35%' },
      40: { 'max-width': '40%' },
      45: { 'max-width': '45%' },
      50: { 'max-width': '50%' },
      55: { 'max-width': '55%' },
      60: { 'max-width': '60%' },
      65: { 'max-width': '65%' },
      66: { 'max-width': '66%' },
      70: { 'max-width': '70%' },
      75: { 'max-width': '75%' },
      80: { 'max-width': '80%' },
      85: { 'max-width': '85%' },
      90: { 'max-width': '90%' },
      95: { 'max-width': '95%' },
      100: { 'max-width': '100%' },
      '*': { 'max-width': '*' },
    },

    // min-width
    wmin: {
      '100vw': { 'min-width': '100vw' },
      narrow: { 'min-width': maxWidth.sm },
      normal: { 'min-width': maxWidth.md },
      wide: { 'min-width': maxWidth.lg },
      vast: { 'min-width': maxWidth.xl },
      extra: { 'min-width': maxWidth.xxl },
      5: { 'min-width': '5%' },
      10: { 'min-width': '10%' },
      15: { 'min-width': '15%' },
      20: { 'min-width': '20%' },
      25: { 'min-width': '25%' },
      30: { 'min-width': '30%' },
      33: { 'min-width': '33%' },
      35: { 'min-width': '35%' },
      40: { 'min-width': '40%' },
      45: { 'min-width': '45%' },
      50: { 'min-width': '50%' },
      55: { 'min-width': '55%' },
      60: { 'min-width': '60%' },
      65: { 'min-width': '65%' },
      66: { 'min-width': '66%' },
      70: { 'min-width': '70%' },
      75: { 'min-width': '75%' },
      80: { 'min-width': '80%' },
      85: { 'min-width': '85%' },
      90: { 'min-width': '90%' },
      95: { 'min-width': '95%' },
      100: { 'min-width': '100%' },
      '*': { 'min-width': '*' },
    },

    // width calc
    wcalc: {
      '*': { width: 'calc(*)' },
    },

    // max-width calc
    wmaxcalc: {
      '*': { 'max-width': 'calc(*)' },
    },

    // min-width calc
    wmincalc: {
      '*': { 'min-width': 'calc(*)' },
    },

    // height
    h: {
      '100vh': { height: '100vh' },
      auto: { height: 'auto' },
      0: { height: 0 },
      100: { height: '100%' },
      '*': { height: '*' },
    },

    // max-height
    hmax: {
      '100vh': { 'max-height': '100vh' },
      none: { 'max-height': 'none' },
      100: { 'max-height': '100%' },
      0: { 'max-height': '0' },
      '*': { 'max-height': '*' },
    },

    // min-height
    hmin: {
      '100vh': { 'min-height': '100vh' },
      auto: { 'min-height': 'auto' },
      100: { 'min-height': '100%' },
      '*': { 'min-height': '*' },
    },

    // height calc
    hcalc: {
      '*': { height: 'calc(*)' },
    },

    // max-height calc
    hmaxcalc: {
      '*': { 'max-height': 'calc(*)' },
    },

    // min-height calc
    hmincalc: {
      '*': { 'min-height': 'calc(*)' },
    },

    // square
    square: {
      auto: { width: 'auto', height: 'auto' },
      0: { width: 0, height: 0 },
      '*': { width: '*', height: '*' },
    },

    // z-index
    z: {
      n: { 'z-index': -1 },
      0: { 'z-index': 0 },
      1: { 'z-index': 1 },
      3: { 'z-index': 3 },
      6: { 'z-index': 6 },
      9: { 'z-index': 9 },
      99: { 'z-index': 99 },
      999: { 'z-index': 999 },
      9999: { 'z-index': 9999 },
      '*': { 'z-index': '*' },
    },

    // scroll snap type
    'ss-type': {
      none: { 'scroll-snap-type': 'none' },
      both: { 'scroll-snap-type': 'both' },
    },

    // scroll snap align
    'ss-align': {
      none: { 'scroll-snap-align': 'none' },
      start: { 'scroll-snap-align': 'start' },
    },

    // scroll margin top
    'sm-top': {
      '*': { 'scroll-margin-top': '*' },
    },
  };
};

export const getMapleUtilityVariableMap = ({
  color,
  spacer,
  fontFamily,
}: IMapleVariableModel) => [
  { prefix: 'ff', map: fontFamily, props: ['font-family'] },
  { prefix: 'bgc', map: color, props: ['background-color'] },
  { prefix: 'bc', map: color, props: ['border-color'] },
  { prefix: 'bc-top', map: color, props: ['border-top-color'] },
  { prefix: 'bc-bottom', map: color, props: ['border-bottom-color'] },
  { prefix: 'bc-left', map: color, props: ['border-left-color'] },
  { prefix: 'bc-right', map: color, props: ['border-right-color'] },
  { prefix: 'col-bc', map: color, props: ['column-rule-color'] },
  { prefix: 'link', map: color, props: ['link'] },
  { prefix: 'btn', map: color, props: ['theme'] },
  { prefix: 'btn-outline', map: color, props: ['theme-outline'] },
  { prefix: 'alert', map: color, props: ['theme'] },
  { prefix: 'alert-outline', map: color, props: ['theme-outline'] },
  { prefix: 'stroke', map: color, props: ['stroke'] },
  { prefix: 'fc', map: color, props: ['color'] },
  { prefix: 'oc', map: color, props: ['outline-color'] },
  { prefix: 'p', map: spacer, props: ['padding'] },
  { prefix: 'pb', map: spacer, props: ['padding-bottom'] },
  { prefix: 'pl', map: spacer, props: ['padding-left'] },
  { prefix: 'pr', map: spacer, props: ['padding-right'] },
  { prefix: 'pt', map: spacer, props: ['padding-top'] },
  { prefix: 'px', map: spacer, props: ['padding-left', 'padding-right'] },
  { prefix: 'py', map: spacer, props: ['padding-top', 'padding-bottom'] },
  { prefix: 'm', map: spacer, props: ['margin'] },
  { prefix: 'mb', map: spacer, props: ['margin-bottom'] },
  { prefix: 'ml', map: spacer, props: ['margin-left'] },
  { prefix: 'mr', map: spacer, props: ['margin-right'] },
  { prefix: 'mt', map: spacer, props: ['margin-top'] },
  { prefix: 'mx', map: spacer, props: ['margin-left', 'margin-right'] },
  { prefix: 'my', map: spacer, props: ['margin-top', 'margin-bottom'] },
  { prefix: 'top', map: spacer, props: ['top'] },
  { prefix: 'left', map: spacer, props: ['left'] },
  { prefix: 'right', map: spacer, props: ['right'] },
  { prefix: 'bottom', map: spacer, props: ['bottom'] },
  { prefix: 'tobo', map: spacer, props: ['top', 'bottom'] },
  { prefix: 'leri', map: spacer, props: ['left', 'right'] },
  { prefix: 'lebo', map: spacer, props: ['left', 'bottom'] },
  {
    prefix: 'tblr',
    map: spacer,
    props: ['top', 'bottom', 'left', 'right'],
  },
  { prefix: 'tblr', map: spacer, props: ['top', 'bottom', 'left', 'right'] },
  { prefix: 'bw', map: spacer, props: ['border-width'] },
  { prefix: 'bw-bottom', map: spacer, props: ['border-bottom-width'] },
  { prefix: 'bw-top', map: spacer, props: ['border-top-width'] },
  { prefix: 'bw-left', map: spacer, props: ['border-left-width'] },
  { prefix: 'bw-right', map: spacer, props: ['border-right-width'] },
  { prefix: 'col-gap', map: spacer, props: ['column-gap'] },
];
