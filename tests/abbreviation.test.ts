import { describe, expect, it } from 'vitest';
import { PRECALCULATED_PROP_ABBREVIATIONS } from '../src/generated/precalculated-prop-abbreviations';

/**
 * Abbreviation Stability Tests
 *
 * ⚠️ IMPORTANT: These tests ensure abbreviation stability.
 * Changing an abbreviation will break every project using the old one.
 * Abbreviation changes are discouraged in Maple.
 *
 * If a test fails, it means an abbreviation has changed.
 * DO NOT update the test to match the new abbreviation without careful consideration.
 */
describe('Precalculated Property Abbreviations', () => {
  // Alignment
  it('ac → alignContent', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ac).toBe('alignContent');
  });

  it('ai → alignItems', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ai).toBe('alignItems');
  });

  it('as → alignSelf', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.as).toBe('alignSelf');
  });

  // Animation
  it('anim → animation', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.anim).toBe('animation');
  });

  it('animcomp → animationComposition', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animcomp).toBe(
      'animationComposition',
    );
  });

  it('animdel → animationDelay', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animdel).toBe('animationDelay');
  });

  it('animdir → animationDirection', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animdir).toBe('animationDirection');
  });

  it('animdur → animationDuration', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animdur).toBe('animationDuration');
  });

  it('animfm → animationFillMode', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animfm).toBe('animationFillMode');
  });

  it('animic → animationIterationCount', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animic).toBe(
      'animationIterationCount',
    );
  });

  it('animname → animationName', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animname).toBe('animationName');
  });

  it('animps → animationPlayState', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animps).toBe('animationPlayState');
  });

  it('animrange → animationRange', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animrange).toBe('animationRange');
  });

  it('animrangeend → animationRangeEnd', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animrangeend).toBe(
      'animationRangeEnd',
    );
  });

  it('animrangestart → animationRangeStart', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animrangestart).toBe(
      'animationRangeStart',
    );
  });

  it('animtf → animationTimingFunction', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.animtf).toBe(
      'animationTimingFunction',
    );
  });

  // Aspect Ratio
  it('ar → aspectRatio', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ar).toBe('aspectRatio');
  });

  // Backdrop Filter
  it('bdf → backdropFilter', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bdf).toBe('backdropFilter');
  });

  // Background
  it('bg → background', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bg).toBe('background');
  });

  it('bgattach → backgroundAttachment', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgattach).toBe(
      'backgroundAttachment',
    );
  });

  it('bgblend → backgroundBlendMode', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgblend).toBe(
      'backgroundBlendMode',
    );
  });

  it('bgclip → backgroundClip', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgclip).toBe('backgroundClip');
  });

  it('bgc → backgroundColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgc).toBe('backgroundColor');
  });

  it('bgimg → backgroundImage', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgimg).toBe('backgroundImage');
  });

  it('bgo → backgroundOrigin', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgo).toBe('backgroundOrigin');
  });

  it('bgpos → backgroundPosition', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgpos).toBe('backgroundPosition');
  });

  it('bgposx → backgroundPositionX', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgposx).toBe('backgroundPositionX');
  });

  it('bgposy → backgroundPositionY', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgposy).toBe('backgroundPositionY');
  });

  it('bgr → backgroundRepeat', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgr).toBe('backgroundRepeat');
  });

  it('bgs → backgroundSize', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bgs).toBe('backgroundSize');
  });

  // Border
  it('br → border', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.br).toBe('border');
  });

  it('brb → borderBottom', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brb).toBe('borderBottom');
  });

  it('brbc → borderBottomColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brbc).toBe('borderBottomColor');
  });

  it('brblrad → borderBottomLeftRadius', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brblrad).toBe(
      'borderBottomLeftRadius',
    );
  });

  it('brbrrad → borderBottomRightRadius', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brbrrad).toBe(
      'borderBottomRightRadius',
    );
  });

  it('brbst → borderBottomStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brbst).toBe('borderBottomStyle');
  });

  it('brbw → borderBottomWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brbw).toBe('borderBottomWidth');
  });

  it('brc → borderColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brc).toBe('borderColor');
  });

  it('brimg → borderImage', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brimg).toBe('borderImage');
  });

  it('brimgw → borderImageWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brimgw).toBe('borderImageWidth');
  });

  it('brl → borderLeft', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brl).toBe('borderLeft');
  });

  it('brlc → borderLeftColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brlc).toBe('borderLeftColor');
  });

  it('brlst → borderLeftStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brlst).toBe('borderLeftStyle');
  });

  it('brlw → borderLeftWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brlw).toBe('borderLeftWidth');
  });

  it('rad → borderRadius', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.rad).toBe('borderRadius');
  });

  it('brr → borderRight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brr).toBe('borderRight');
  });

  it('brrc → borderRightColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brrc).toBe('borderRightColor');
  });

  it('brrst → borderRightStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brrst).toBe('borderRightStyle');
  });

  it('brrw → borderRightWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brrw).toBe('borderRightWidth');
  });

  it('brst → borderStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brst).toBe('borderStyle');
  });

  it('brt → borderTop', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brt).toBe('borderTop');
  });

  it('brtc → borderTopColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brtc).toBe('borderTopColor');
  });

  it('brtlrad → borderTopLeftRadius', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brtlrad).toBe(
      'borderTopLeftRadius',
    );
  });

  it('brtrrad → borderTopRightRadius', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brtrrad).toBe(
      'borderTopRightRadius',
    );
  });

  it('brtst → borderTopStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brtst).toBe('borderTopStyle');
  });

  it('brtw → borderTopWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brtw).toBe('borderTopWidth');
  });

  it('brw → borderWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.brw).toBe('borderWidth');
  });

  // Position
  it('b → bottom', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.b).toBe('bottom');
  });

  // Box Shadow
  it('bshadow → boxShadow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.bshadow).toBe('boxShadow');
  });

  // Color
  it('c → color', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.c).toBe('color');
  });

  // Gap
  it('gx → columnGap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.gx).toBe('columnGap');
  });

  // Container
  it('cnt → container', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.cnt).toBe('container');
  });

  // SVG
  it('vecd → d', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.vecd).toBe('d');
  });

  // Direction
  it('dir → direction', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.dir).toBe('direction');
  });

  // Display
  it('d → display', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.d).toBe('display');
  });

  // Flex
  it('fx → flex', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fx).toBe('flex');
  });

  it('fxb → flexBasis', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fxb).toBe('flexBasis');
  });

  it('fxdir → flexDirection', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fxdir).toBe('flexDirection');
  });

  it('fxf → flexFlow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fxf).toBe('flexFlow');
  });

  it('fxg → flexGrow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fxg).toBe('flexGrow');
  });

  it('fxs → flexShrink', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fxs).toBe('flexShrink');
  });

  it('fxwr → flexWrap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fxwr).toBe('flexWrap');
  });

  // Font
  it('f → font', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.f).toBe('font');
  });

  it('fd → fontDisplay', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fd).toBe('fontDisplay');
  });

  it('ff → fontFamily', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ff).toBe('fontFamily');
  });

  it('fs → fontSize', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fs).toBe('fontSize');
  });

  it('fst → fontStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fst).toBe('fontStyle');
  });

  it('fw → fontWeight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.fw).toBe('fontWeight');
  });

  // Gap
  it('g → gap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.g).toBe('gap');
  });

  // Grid
  it('gr → grid', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.gr).toBe('grid');
  });

  it('area → gridArea', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.area).toBe('gridArea');
  });

  it('col → gridColumn', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.col).toBe('gridColumn');
  });

  it('grg → gridGap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.grg).toBe('gridGap');
  });

  it('row → gridRow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.row).toBe('gridRow');
  });

  it('grt → gridTemplate', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.grt).toBe('gridTemplate');
  });

  it('areas → gridTemplateAreas', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.areas).toBe('gridTemplateAreas');
  });

  it('cols → gridTemplateColumns', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.cols).toBe('gridTemplateColumns');
  });

  it('rows → gridTemplateRows', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.rows).toBe('gridTemplateRows');
  });

  // Height
  it('h → height', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.h).toBe('height');
  });

  // Justify
  it('jc → justifyContent', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.jc).toBe('justifyContent');
  });

  it('ji → justifyItems', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ji).toBe('justifyItems');
  });

  it('js → justifySelf', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.js).toBe('justifySelf');
  });

  // Position
  it('l → left', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.l).toBe('left');
  });

  // Letter Spacing
  it('ls → letterSpacing', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ls).toBe('letterSpacing');
  });

  // Line Height
  it('lh → lineHeight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.lh).toBe('lineHeight');
  });

  // Margin
  it('m → margin', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.m).toBe('margin');
  });

  it('my → marginBlock', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.my).toBe('marginBlock');
  });

  it('mbe → marginBlockEnd', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mbe).toBe('marginBlockEnd');
  });

  it('mbs → marginBlockStart', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mbs).toBe('marginBlockStart');
  });

  it('mb → marginBottom', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mb).toBe('marginBottom');
  });

  it('mx → marginInline', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mx).toBe('marginInline');
  });

  it('me → marginInlineEnd', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.me).toBe('marginInlineEnd');
  });

  it('ms → marginInlineStart', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ms).toBe('marginInlineStart');
  });

  it('ml → marginLeft', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ml).toBe('marginLeft');
  });

  it('mr → marginRight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mr).toBe('marginRight');
  });

  it('mt → marginTop', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mt).toBe('marginTop');
  });

  // Max/Min Dimensions
  it('mxh → maxHeight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mxh).toBe('maxHeight');
  });

  it('mxw → maxWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mxw).toBe('maxWidth');
  });

  it('mnh → minHeight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mnh).toBe('minHeight');
  });

  it('mnw → minWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mnw).toBe('minWidth');
  });

  // Mix Blend Mode
  it('mixblend → mixBlendMode', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.mixblend).toBe('mixBlendMode');
  });

  // Opacity
  it('o → opacity', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.o).toBe('opacity');
  });

  // Outline
  it('ol → outline', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ol).toBe('outline');
  });

  it('olc → outlineColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.olc).toBe('outlineColor');
  });

  it('oloff → outlineOffset', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.oloff).toBe('outlineOffset');
  });

  it('olst → outlineStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.olst).toBe('outlineStyle');
  });

  it('olw → outlineWidth', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.olw).toBe('outlineWidth');
  });

  // Overflow
  it('of → overflow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.of).toBe('overflow');
  });

  it('ofwr → overflowWrap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ofwr).toBe('overflowWrap');
  });

  it('ofx → overflowX', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ofx).toBe('overflowX');
  });

  it('ofy → overflowY', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ofy).toBe('overflowY');
  });

  // Padding
  it('p → padding', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.p).toBe('padding');
  });

  it('py → paddingBlock', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.py).toBe('paddingBlock');
  });

  it('pbe → paddingBlockEnd', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pbe).toBe('paddingBlockEnd');
  });

  it('pbs → paddingBlockStart', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pbs).toBe('paddingBlockStart');
  });

  it('pb → paddingBottom', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pb).toBe('paddingBottom');
  });

  it('px → paddingInline', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.px).toBe('paddingInline');
  });

  it('pe → paddingInlineEnd', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pe).toBe('paddingInlineEnd');
  });

  it('ps → paddingInlineStart', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ps).toBe('paddingInlineStart');
  });

  it('pl → paddingLeft', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pl).toBe('paddingLeft');
  });

  it('pr → paddingRight', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pr).toBe('paddingRight');
  });

  it('pt → paddingTop', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pt).toBe('paddingTop');
  });

  // Pointer Events
  it('ptr → pointerEvents', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ptr).toBe('pointerEvents');
  });

  // Position
  it('pos → position', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.pos).toBe('position');
  });

  it('posv → positionVisibility', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.posv).toBe('positionVisibility');
  });

  // SVG
  it('vecr → r', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.vecr).toBe('r');
  });

  // Position
  it('r → right', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.r).toBe('right');
  });

  // Row Gap
  it('gy → rowGap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.gy).toBe('rowGap');
  });

  // Text
  it('ta → textAlign', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ta).toBe('textAlign');
  });

  it('tdeco → textDecoration', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tdeco).toBe('textDecoration');
  });

  it('tdecoc → textDecorationColor', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tdecoc).toBe('textDecorationColor');
  });

  it('tdecost → textDecorationStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tdecost).toBe(
      'textDecorationStyle',
    );
  });

  it('tof → textOverflow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tof).toBe('textOverflow');
  });

  it('tshadow → textShadow', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tshadow).toBe('textShadow');
  });

  it('ttf → textTransform', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ttf).toBe('textTransform');
  });

  it('twr → textWrap', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.twr).toBe('textWrap');
  });

  it('twrmod → textWrapMode', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.twrmod).toBe('textWrapMode');
  });

  it('twrst → textWrapStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.twrst).toBe('textWrapStyle');
  });

  // Position
  it('t → top', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.t).toBe('top');
  });

  // Transform
  it('tf → transform', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tf).toBe('transform');
  });

  it('tfbox → transformBox', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tfbox).toBe('transformBox');
  });

  it('tfo → transformOrigin', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tfo).toBe('transformOrigin');
  });

  it('tfst → transformStyle', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tfst).toBe('transformStyle');
  });

  // Transition
  it('ts → transition', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ts).toBe('transition');
  });

  it('tsbeh → transitionBehavior', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tsbeh).toBe('transitionBehavior');
  });

  it('tsdel → transitionDelay', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tsdel).toBe('transitionDelay');
  });

  it('tsdur → transitionDuration', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tsdur).toBe('transitionDuration');
  });

  it('tsprop → transitionProperty', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tsprop).toBe('transitionProperty');
  });

  it('tstf → transitionTimingFunction', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tstf).toBe(
      'transitionTimingFunction',
    );
  });

  // Translate
  it('tl → translate', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.tl).toBe('translate');
  });

  // Visibility
  it('v → visibility', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.v).toBe('visibility');
  });

  // White Space
  it('ws → whiteSpace', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.ws).toBe('whiteSpace');
  });

  // Width
  it('w → width', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.w).toBe('width');
  });

  // Will Change
  it('wc → willChange', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.wc).toBe('willChange');
  });

  // Z-Index
  it('z → zIndex', () => {
    expect(PRECALCULATED_PROP_ABBREVIATIONS.z).toBe('zIndex');
  });

  // Ensure no abbreviations are removed
  it('should have exactly 167 abbreviations', () => {
    expect(Object.keys(PRECALCULATED_PROP_ABBREVIATIONS).length).toBe(173);
  });
});
