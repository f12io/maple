import { MapleVariableAlertModel } from '../types/variables.model';
import { MAPLE_VAR_FONT_SIZE } from './font-size';
import { MAPLE_VAR_FONT_WEIGHT } from './font-weight';
import { MAPLE_VAR_SPACER } from './spacer';

export const MAPLE_VAR_ALERT: MapleVariableAlertModel = {
  small: {
    borderWidth: '1px',
    borderRadius: '0',
    textCase: 'none',
    letterSpacing: 'normal',
    lineHeight: 1,
    fontSize: MAPLE_VAR_FONT_SIZE.p4,
    fontWeight: MAPLE_VAR_FONT_WEIGHT.regular,
    padding: `${MAPLE_VAR_SPACER[1]} ${MAPLE_VAR_SPACER[2]}`,
  },
  normal: {
    borderWidth: '1px',
    borderRadius: '0',
    textCase: 'none',
    letterSpacing: 'normal',
    lineHeight: 1,
    fontSize: MAPLE_VAR_FONT_SIZE.p3,
    fontWeight: MAPLE_VAR_FONT_WEIGHT.regular,
    padding: `${MAPLE_VAR_SPACER[2]} ${MAPLE_VAR_SPACER[3]}`,
  },
  medium: {
    borderWidth: '1px',
    borderRadius: '0',
    textCase: 'none',
    letterSpacing: 'normal',
    lineHeight: 1,
    fontSize: MAPLE_VAR_FONT_SIZE.p1,
    fontWeight: MAPLE_VAR_FONT_WEIGHT.regular,
    padding: `${MAPLE_VAR_SPACER[4]} ${MAPLE_VAR_SPACER[5]}`,
  },
  large: {
    borderWidth: '1px',
    borderRadius: '0',
    textCase: 'none',
    letterSpacing: 'normal',
    lineHeight: 1,
    fontSize: MAPLE_VAR_FONT_SIZE.h5,
    fontWeight: MAPLE_VAR_FONT_WEIGHT.regular,
    padding: `${MAPLE_VAR_SPACER[5]} ${MAPLE_VAR_SPACER[6]}`,
  },
};
