// tslint:disable: no-bitwise
export class MapleColorHelper {
  public static getContrastColor(hexColor: string): string {
    if (!hexColor) {
      return '';
    }
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }

  public static alpha2hex(alpha: string): string {
    alpha = ((1 << 8) + Math.round(parseFloat(alpha) * 255))
      .toString(16)
      .slice(1);
    return alpha === 'ff' ? '' : alpha;
  }

  public static hex8(hex: string, opacity: number = 1): string {
    return `#${MapleColorHelper.hex2Short(
      hex.replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => '#' + r + r + g + g + b + b,
      ) + MapleColorHelper.alpha2hex(opacity.toString()),
    )}`;
  }

  public static hex2Short(hex: string): string {
    if (hex.length > 6) {
      const hexArr = hex.replace('#', '').split('');
      return hexArr[0] === hexArr[1] &&
        hexArr[2] === hexArr[3] &&
        hexArr[4] === hexArr[5] &&
        hexArr[6] === hexArr[7]
        ? hexArr[0] + hexArr[2] + hexArr[4] + (hexArr[6] || '')
        : hexArr.join('');
    }
    return hex;
  }

  public static generateAlphaColors(color: any): string {
    Object.keys(color)
      .filter((key) => color[key].charAt(0) === '#' && key !== 'transparent')
      .forEach((key) => {
        [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].forEach((opacity) => {
          color[`${key}-${opacity * 100}`] = MapleColorHelper.hex8(
            color[key],
            opacity,
          );
        });
      });
    return color;
  }
}
