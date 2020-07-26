export interface MapleVariableModel {
  breakpoint: any;
  color: any;
  fontFamily: any;
  fontSize: any;
  fontWeight: any;
  maxWidth: any;
  spacer: any;
  button: MapleVariableButtonModel;
  alert: MapleVariableAlertModel;
  transition: MapleVariableTransitionModel;
  isRtl?: boolean;
}

export interface MapleVariableSizeModel {
  borderWidth: string;
  borderRadius: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  padding: string;
  letterSpacing: string;
  textCase: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface MapleVariableButtonModel {
  transitionDuration: string;
  transitionTiming: string;
  outlineWidth: string;
  outlineOffset: string;
  small: MapleVariableSizeModel;
  normal: MapleVariableSizeModel;
  medium: MapleVariableSizeModel;
  large: MapleVariableSizeModel;
}

export interface MapleVariableAlertModel {
  small: MapleVariableSizeModel;
  normal: MapleVariableSizeModel;
  medium: MapleVariableSizeModel;
  large: MapleVariableSizeModel;
}

export interface MapleVariableTransitionModel {
  duration: string;
  timing: string;
}
