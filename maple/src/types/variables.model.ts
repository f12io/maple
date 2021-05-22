export interface IMapleVariableModel {
  breakpoint?: any;
  color?: any;
  fontFamily?: any;
  fontSize?: any;
  fontWeight?: any;
  maxWidth?: any;
  spacer?: any;
  button?: IMapleVariableButtonModel;
  alert?: IMapleVariableAlertModel;
  transition?: MapleVariableTransitionModel;
  isRtl?: boolean;
}

export interface IMapleVariableSizeModel {
  borderWidth: string;
  borderRadius: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  padding: string;
  letterSpacing: string;
  textCase: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface IMapleVariableButtonModel {
  transitionDuration: string;
  transitionTiming: string;
  outlineWidth: string;
  outlineOffset: string;
  small: IMapleVariableSizeModel;
  normal: IMapleVariableSizeModel;
  medium: IMapleVariableSizeModel;
  large: IMapleVariableSizeModel;
}

export interface IMapleVariableAlertModel {
  small: IMapleVariableSizeModel;
  normal: IMapleVariableSizeModel;
  medium: IMapleVariableSizeModel;
  large: IMapleVariableSizeModel;
}

export interface MapleVariableTransitionModel {
  duration: string;
  timing: string;
}
