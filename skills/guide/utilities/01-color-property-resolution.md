#### 1. Color Property Resolution

To make a color utility class (e.g. `c-primary-500`), one of the following CSS variables should be defined:

- Color Name Chain:
  - `--c-primary`: `c`refers to shorthand of `color` property. Each property first looks for a CSS variable prefixed with its name. For example, `bgc-primary` will create `--bgc-primary` in the resolution.
  - `--color-primary`: The first fallback is the type of the property. If `--c-primary` is not defined, the browser will look for `--color-primary`.
  - `--primary`: The second fallback is the name of the value itself as a CSS variable. If `--color-primary` is not defined, the browser will look for `--primary`.
  - `primary`: The third fallback is the value itself. If `--primary` is not defined, the browser will use `primary` as the value. In this case, as `primary` is not a valid color, the browser will silently ignore the resolved style. You can use named CSS colors that browsers support, e.g. `c-red`, `bgc-cornflowerblue`, `brc-silver`, `bg-lime` etc.

You can also manipulate the color values in OKLCH space by defining one ofthe following CSS variables in the fallback chain:

- Lightness Scale Chain (`l-scale`):
  - `--c-primary-l-scale`: Prefixed with property and value.
  - `--primary-l-scale`: 1. fallback, prefixed with value.
  - `--c-l-scale`: 2. fallback, prefixed with property.
  - `--l-scale`: 3. fallback, no prefix.
  - `1`: 4. fallback, default value
- Lightness Shift Chain (`l-shift`):
  - `--c-primary-l-shift`: Prefixed with property and value.
  - `--primary-l-shift`: 1. fallback, prefixed with value.
  - `--c-l-shift`: 2. fallback, prefixed with property.
  - `--l-shift`: 3. fallback, no prefix.
  - `1`: 4. fallback, default value
- Chroma Scale Chain (`c-scale`):
  - `--c-primary-c-scale`: Prefixed with property and value.
  - `--primary-c-scale`: 1. fallback, prefixed with value.
  - `--c-c-scale`: 2. fallback, prefixed with property.
  - `--c-scale`: 3. fallback, no prefix.
  - `1`: 4. fallback, default value
- Hue Rotate Chain (`h-rotate`):
  - `--c-primary-h-rotate`: Prefixed with property and value.
  - `--primary-h-rotate`: 1. fallback, prefixed with value.
  - `--c-h-rotate`: 2. fallback, prefixed with property.
  - `--h-rotate`: 3. fallback, no prefix.
  - `0`: 4. fallback, default value

When tone variations are used (e.g., `c-primary-200`), there are also two global curve controls:

- `--l-edge-shift`: Controls the dampening curve of lightness scaling toward extremes, `0.5` by default.
- `--c-curve`: Controls the curve of the chroma reduction for extreme tones, `0.5` by default.

This fallback chain and color system allows you to create colors without defining them explicitly:

```html
<div
  class="--bgc-primary=oklch(0.98_0.02_20) --c-primary=oklch(0.2_0.05_20) @dark:--bgc-l-scale=0.2 @dark:--c-l-scale=100"
>
  <div class="bgc-primary c-primary"></div>
</div>
```

You can generate a wide range of tones from any base color by appending a numeric suffix `-{number}` to the color name. For example, `c-primary-200` will create a lighter tone of `c-primary`. Any number is valid like `c-primary-42` or `c-primary-999`. The calculation happen natively in the browser and is relative to the 500 as mid-tone:

- **Tones < 500**: Move the color toward white (lighter).
- **Tones > 500**: Move the color toward black (darker).

|              |            |                             |
| ------------ | ---------- | --------------------------- |
| **Class**    | **Effect** | **Logic**                   |
| `c-blue-100` | **Tint**   | Significantly lighter.      |
| `c-blue-500` | **Base**   | The same color as `c-blue`. |
| `c-blue-900` | **Shade**  | Significantly darker.       |

You can change the transparency of the color by appending a numeric suffix `/{number}` to the color name. For example, `c-primary/68` will set the alpha value of `c-primary` to `68%`. Any number between 0 and 100 is valid.

You can also combine the tone and transparency suffixes: `c-primary-232/68` will create a lighter tone of `c-primary` with an alpha value of `68%`.

> [!IMPORTANT]
> Although Maple supports any number for tones and transparency, it is recommended to use numbers divisible to `5` or `10` to keep your design system consistent and organized.

> [!IMPORTANT]
> The 500 tone represents a mathematically aligned midpoint, rather than the exact starting color. For example, c-navy (no tone) uses the raw base color as-is, while c-navy-500 applies the shading formula, so they are not equivalent.
