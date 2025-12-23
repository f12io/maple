import { resolveColor } from '../../helpers/color-resolver';
import { resolveFraction } from '../../helpers/fraction.helper';
import { predefinedUtilityMap } from './predefined-utility-map';
import maple from './property-extraction';

const axisMap: any = {
  x: (key: string, value: string, isImportant: boolean) => ({
    [`${key}-left`]: value + (isImportant ? '!important' : ''),
    [`${key}-right`]: value + (isImportant ? '!important' : ''),
  }),
  y: (key: string, value: string, isImportant: boolean) => ({
    [`${key}-bottom`]: value + (isImportant ? '!important' : ''),
    [`${key}-top`]: value + (isImportant ? '!important' : ''),
  }),
  '': (key: string | string[], value: string, isImportant: boolean) =>
    Array.isArray(key)
      ? key.reduce((acc, k) => {
          acc[k] = value + (isImportant ? '!important' : '');
          return acc;
        }, {} as any)
      : {
          [key]: value + (isImportant ? '!important' : ''),
        },
};

export const mapleMatcher = (className: string) => {
  let { utility, axis, sign, operator, value } = getProperty(className) || {
    sign: 1,
    axis: '',
    operator: '-',
    value: '',
  };
  const isImportant = value.endsWith('!');
  if (isImportant) {
    value = value.slice(0, -1);
  }
  if (!utility || !value) {
    return null;
  }
  const shortKey = maple.properties.shortMap?.[utility];
  const data = maple.properties.utilityMap?.[shortKey || utility];
  let generatedValue: string | null = '';
  if (data.rel === 'd') {
    generatedValue = generateDimensionValues(
      sign,
      utility,
      data.key,
      operator,
      value
    );
  } else if (data.rel === 'c') {
    generatedValue = generateColorValues(operator, value);
  } else if (data.rel === 'trnsf') {
    return generateTransformValues(
      sign,
      data.key as string,
      utility,
      operator,
      value
    );
  } else {
    const val = generateOtherValues(data.key, utility, operator, value);
    if (val && typeof val === 'object') {
      return val;
    }
    generatedValue = val as string;
  }
  return generatedValue
    ? axisMap?.[axis](data.key, generatedValue, isImportant)
    : null;
};

function getProperty(input: string): {
  sign: -1 | 1;
  operator: '-' | '=';
  utility: string;
  axis: 'x' | 'y' | '';
  value: string;
} | null {
  // Step 1: Get the part after the last colon
  // Example: "md:hover:bg-blue-500" -> "bg-blue-500"
  const lastColonIndex = input.lastIndexOf(':');
  let core = lastColonIndex !== -1 ? input.slice(lastColonIndex + 1) : input;
  let sign: 1 | -1 = 1;
  // Step 2: Handle the optional leading negative sign
  if (core.startsWith('-')) {
    core = core.slice(1);
    sign = -1;
  }

  // Step 3: Find the separator (- or =)
  // We need to find where the value starts to isolate the property
  const separatorIndex = core.search(/[-=]/);
  if (separatorIndex === -1) return null;
  const operator = core.charAt(separatorIndex) as '-' | '=';
  let candidate = core.slice(0, separatorIndex);
  const value = core.slice(separatorIndex + 1, core.length);
  const shorthands = maple.properties.shortMap;
  // Step 4: Handle the optional 'x' or 'y' suffix
  // If "bgx" is the candidate but only "bg" is in the Set, we strip the 'x'
  if (!shorthands[candidate]) {
    const lastChar = candidate.slice(-1);
    if (lastChar === 'x' || lastChar === 'y') {
      const stripped = candidate.slice(0, -1);
      if (shorthands[stripped]) {
        return { utility: stripped, axis: lastChar, sign, operator, value };
      }
    }
    return null; // Not found in lookup table
  }

  return { utility: candidate, axis: '', sign, operator, value };
}

function generateDimensionValues(
  sign: -1 | 1,
  utility: string,
  key: string | string[],
  operator: string,
  value: string,
  unit: string = 'rem'
) {
  if (operator === '=') {
    return value;
  }
  const fraction = resolveFraction(value);
  if (utility.match(/^(gtc|gtr)$/)) {
    return `repeat(var(--${key}-${value
      .replace(/\s/g, '_')
      .replace(/([^a-zA-Z0-9_-])/g, '\\$1')}, ${
      fraction || value
    }), minmax(0, 1fr))`;
  }
  if (operator !== '=' && value.match(/^([d|l|s]?)vw|vh|%/g)) {
    return `100${value}`;
  }
  const numVal = Number(value);
  const uti = value.replace(/\s/g, '_').replace(/([^a-zA-Z0-9_-])/g, '\\$1');
  const val = fraction
    ? fraction
    : isNaN(numVal)
    ? `var(--${Array.isArray(key) ? utility : key}-${uti}, var(--base-${uti}))`
    : `var(--${Array.isArray(key) ? utility : key}-${uti}, var(--base-${uti}, ${
        isNaN(numVal)
          ? value
          : Number(value) * (unit === 'rem' ? 0.25 : 1) + unit
      }))`;
  return sign === -1 ? `calc(${val} * -1)` : val;
}

function generateColorValues(operator: string, value: string) {
  return operator === '=' ? value : resolveColor(value);
}

function generateOtherValues(
  key: string | string[],
  utility: string,
  operator: string,
  value: string
) {
  return operator === '='
    ? predefinedUtilityMap[utility]?.apply
      ? predefinedUtilityMap[utility]?.apply(value)
      : value
    : `var(--${key}-${value.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}, ${
        predefinedUtilityMap[utility]?.apply
          ? predefinedUtilityMap[utility]?.apply(value)
          : value
      })`;
}

const trnsfMap: any = {
  transform: {
    value: 'var(--rotate-x,)var(--rotate-y,)var(--skew-x,)var(--skew-y,)',
    generator: (utility: string, axis: string, value: string) =>
      `${utility}${(axis || '').toUpperCase()}(${value})`,
    unit: 'deg',
  },
  translate: {
    value: 'var(--translate-x,)var(--translate-y,)',
    generator: (utility: string, axis: string, value: string) => value,
  },
  scale: {
    value: 'var(--scale-x,)var(--scale-y,)',
    generator: (utility: string, axis: string, value: string) => value,
    unit: '',
  },
};

function generateTransformValues(
  sign: -1 | 1,
  key: string,
  utility: string,
  operator: string,
  value: string
) {
  const [_, axis, val] = value.match(/([xyz])?-?(.+)/) || [];
  const variable = generateDimensionValues(
    sign,
    utility,
    utility,
    operator,
    val,
    trnsfMap[key].unit ?? 'rem'
  );

  return {
    ...(axis
      ? {
          [`--${utility}-${axis}`]: trnsfMap[key].generator(
            utility,
            axis,
            variable
          ),
        }
      : {
          [`--${utility}-x`]: trnsfMap[key].generator(utility, 'x', variable),
          [`--${utility}-y`]: trnsfMap[key].generator(utility, 'y', variable),
        }),
    [key]: trnsfMap[key]?.value + (axis === 'z' ? `var(--${utility}-z,)` : ''),
  };
}
