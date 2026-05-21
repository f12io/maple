---
name: Maple CSS Engine
description: A variable-first, stack-agnostic runtime CSS engine for building responsive interfaces.
license: ROOT
metadata:
  author: f12.io
  version: '1.0.0'
---

# Maple CSS Skill

This guide provides instructions on how to write CSS using the Maple engine. Maple is a runtime CSS engine that generates styles on-demand based on class names.

- It relies heavily on CSS variables, fallback chains, and runtime composition.
- It is a stack-agnostic engine, meaning it can be used with any frontend framework (React, Vue, Angular, Next.js, Remix, Nuxt etc.) or backend-driven applications (WordPress, PHP, Django, Rails etc.).
- It does not require any build step or configuration.

## Quick Start

To style an application with Maple, all you need is to include the script below in the document head:

```html
<script src="https://unpkg.com/@f12io/maple/dist/maple.js"></script>
```

> [!IMPORTANT]
> Load Maple as a blocking script in the document head.
> Do not use `async`, `defer`, `type="module"`, or place the script at the end of the body.
>
> These options allow the browser to process and render DOM elements before Maple initializes, which can result in unstyled or partially styled content during the first paint.

## Core Concepts

1.  **Runtime Generation**: Styles are generated only when they appear in the DOM. No build step is required.
2.  **Variable-First**: Maple maps a class name to a **semantic fallback chain** of CSS variables. This means utilities don’t encode values — they express intent, and variables determine the result.
3.  **Atomic & Composition**: Classes are atomic (single purpose) but Maple has full CSS selector support in class names.
4.  **Automatic Conflict Resolution**: Maple treats the class attribute as an ordered style declaration. When multiple utilities target the same generated CSS property in the same context, the later utility wins and earlier conflicting utilities are removed from the element.

## Syntax Reference

Maple class names are composed of three parts:

**Format:** `{media-query}:{selector}:{utility}`

- `{media-query}`: Optional. Can be a breakpoint (`md:`, `lg:`) or a media query (`@dark:`, `@print:`).
- `{selector}`: Optional. Can be a parent selector (`^.state-active:`), a self-selector (`&:hover:`), or a child selector (`/span:`, `/>div:`).
- `{utility}`: The actual utility class.

### 1. Utilities

**Format:** `{property}-{value}` or `{property}={value}`.

- `{property}`: The CSS property to apply. All camelCase CSS properties are supported. Some properties have shorthand versions. See the list of shorthand versions below.
- `{value}`: The value to apply to the property. With `equal sign`, the value is treated as a literal string. With `hyphen`, the value is resolved to semantic fallback chain of CSS variables. The type of the property determines how the value is resolved. There are three types of properties: `color`, `number`, and `custom`.

#### 1. Color Property Resolution

A color property resolves to:

```css
.c-primary {
  color: oklch(
    from var(--c-primary, var(--color-primary, var(--primary, primary)))
      calc(
        l *
          var(
            --c-primary-l-scale,
            var(--primary-l-scale, var(--c-l-scale, var(--l-scale, 1)))
          )
      )
      calc(
        c *
          var(
            --c-primary-c-scale,
            var(--primary-c-scale, var(--c-c-scale, var(--c-scale, 1)))
          )
      )
      calc(
        h +
          var(
            --c-primary-h-rotate,
            var(--primary-h-rotate, var(--c-h-rotate, var(--h-rotate, 0)))
          )
      ) /
      alpha
  );
}
```

To make this css rule work, one of the following CSS variables should be defined:

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

#### 2. Number Property Resolution

The number properties having number values work out of the box. You don't need to define any CSS variables unless you want to override the default values. These properties resolve to:

```css
/* Spacing */
.p-4 {
  padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25))));
}

/* Time */
.tsdur-300 {
  transition-duration: var(--tsdur-300, var(--time-300, 300ms));
}

/* Angle */
.rot-15 {
  --tf-rot: rotate(var(--rot-15, var(--angle-15, 15deg)));
}

/* Unitless */
.z-4 {
  z-index: var(--z-4, 4);
}

/* Opacity has special handling */
.o-6 {
  opacity: 0.06;
}

.o-50 {
  opacity: 0.5;
}
```

This fallback chain allows you to manipulate the components locally, for example:

```html
<div class="lg:--spacer=0.5">
  <!-- All spacing will be doubled on large screens -->
</div>
```

However, number properties having string values require at least one fallback CSS variable to be defined. Otherwise, the browser will silently ignore the rule as it becomes invalid due to the string value. You can use string values as tokens to build your own design system. These properties resolve to:

```css
/* Spacing */
.p-md {
  padding: var(--p-md, var(--space-md, var(--md, md)));
}

/* Time */
.tsdur-fast {
  transition-duration: var(--tsdur-fast, var(--time-fast, var(--fast, fast)));
}

/* Angle */
.rot-lg {
  --tf-rot: rotate(var(--rot-lg, var(--angle-lg, var(--lg, lg))));
}

/* Unitless */
.z-max {
  z-index: var(--z-max, var(--max, max));
}

/* Opacity */
.o-half {
  opacity: var(--o-half, var(--half, half));
}
```

**Negative Values**

Maple supports two syntaxes for negative values:

**Prefix syntax**: Add `-` before the property to negate the entire resolved value.

```html
<div class="-m-4"></div>
```

```css
.-m-4 {
  margin: calc(
    var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1
  );
}
```

**Inline negative**: Use a negative number in the value directly.

```html
<div class="m--4"><!-- margin with -1rem --></div>
<div class="m--4_-5"><!-- margin: -1rem -1.25rem --></div>
<div class="m--4_-5px"><!-- margin: -1rem -5px --></div>
```

```css
.m--4 {
  margin: var(--m--4, var(--space--4, calc(-4rem * var(--spacer, 0.25))));
}
```

> [!TIP]
> Use prefix syntax (`-m-4`) when you want to negate a design token. Use inline negative (`m--4`) when you specifically need a negative spacer value that can still be overridden via CSS variables.

#### 3. Unit Shorthand Resolution

Absolute and relative units have shorthand sytax for 1 unit. For example:

```css
/* Absolute */
.w-px {
  width: 1px;
}

/* Relative */
.w-rem {
  width: 1rem;
}
```

The units below are supported for `1` shorthand:

- Absolute: `px, cm, mm, in, pt, pc, Q`
- Relative: `rem, em, ch, ex, cap, ic, lh, rlh, fr`

There are also shorthands for covering the viewport or container:

```css
/* w-% class resolves to: */
.w-\% {
  width: 100%;
}

.h-vh {
  height: 100vh;
}
```

Following units are supported for `cover` shorthand:

`%, vh, vw, vmin, vmax, vi, vb, dvh, dvw, dvmin, dvmax, svh, svw, svmin, svmax, lvh, lvw, lvmin, lvmax, cqw, cqh, cqi, cqb, cqmin, cqmax`

#### 4. Custom Property Resolution

Any property that is not a color or number is considered as `custom`. They all follow the same resolution logic as follows:

```css
/* Font Family */
.ff-main {
  font-family: var(--ff-main, var(--main, main));
}

/* Opacity */
.o-half {
  opacity: var(--o-half, var(--half, half));
}
```

#### 5. Alias Resolution

Aliases expand to one or more Maple utility classes before normal parsing and merge conflict checks run.

Maple includes built-in aliases for common utilities. They can be used directly, or with `@`:

```html
<!--Both examples apply `display: flex` -->
<div class="fx"></div>
<div class="@fx"></div>
```

You can define custom aliases on the root `<html>` element using `--alias-{name}=...`. Custom aliases must be used with `@`.

```html
<html class="--alias-truncate=of=hidden;tof=ellipsis;ws=nowrap">
  <span class="@truncate w-40"> Long text that should truncate </span>
</html>
```

Use `;` to separate multiple classes inside an alias.

```html
<html class="--alias-focus-ring=olw-2px;olst=solid;olc=currentColor;oloff-2">
  <button class="@focus-ring">Focusable control</button>
</html>
```

Alias definitions are collected only from `<html>` and definitions on other elements are ignored. If the same custom alias is defined more than once on `<html>`, the later definition wins.

Aliases are not reactive. If you change an alias definition on `<html>` after elements using that alias have already been processed, Maple does not automatically revisit those existing alias usages. Treat aliases as root-level configuration for reusable utility shortcuts. For live changes, use CSS variables instead.

> [!TIP]
> Aliases work best when they follow utility-first logic: multiple declarations doing one clear job, like `antialiased` or `truncate`. Avoid using aliases as component-sized CSS classes for buttons, cards, or panels; extract those patterns into components or templates instead.

Alias definitions must be plain root classes. If you combine `--alias-*` with a media query or selector, Maple treats it like a normal CSS custom property utility:

```html
<!-- Invalid alias usage. They will resolve to "--alias-focus-ring" css variable. -->
<div class="md:--alias-focus-ring=olw-2px"></div>
<div class="&:hover:--alias-focus-ring=olw-2px"></div>
```

However, the classes inside an alias definition may include their own media queries and selectors. When you use the alias with an additional media query or selector, Maple composes the usage context with each expanded alias member:

```html
<html
  class="--alias-focus-ring=@supports=[outline:1px_solid_currentColor]:&:focus-visible:olw-2px;&:focus-visible:olst=solid;&:focus-visible:olc=currentColor"
>
  <button class="@focus-ring"></button>
  <button class="@md:@focus-ring"></button>
  <button class="&:not(:disabled):@focus-ring"></button>
</html>
```

In this example, `@md:@focus-ring` applies the whole alias at the `md` viewport breakpoint while preserving the alias member's own `@supports` and `&:focus-visible` contexts. `&:not(:disabled):@focus-ring` also composes safely with the alias focus selector.

User-defined aliases do not hijack normal utility names. If you define `--alias-fx=d-grid`, then `@fx` uses your alias, while bare `fx` still uses Maple's built-in flex alias.

Alias usage works with media queries and selectors:

```html
<html class="--alias-focus-ring=olw-2px;olst=solid;olc=currentColor">
  <button class="md:@focus-ring"></button>
  <button class="@md:@focus-ring"></button>
  <button class="&:focus-visible:@focus-ring"></button>
</html>
```

The `@` before a media query belongs to Maple's media-query syntax. The `@` before an alias name belongs to alias usage. For example, `@md:@focus-ring` means "apply the `@focus-ring` alias at the viewport `md` breakpoint."

Because aliases expand before merge checks, later classes override earlier alias members as expected:

```html
<html class="--alias-focus-ring=olw-2px;olst=solid;olc=currentColor">
  <button class="@focus-ring olw-4px"></button>
  <!-- before merge: olw-2px olst=solid olc=currentColor olw-4px -->
  <!-- after merge: @focus-ring olw-4px -->
</html>
```

Maple keeps the alias class when at least one expanded utility inside the alias still applies. In this example, `olw-4px` overrides the alias's `olw-2px`, but the alias is kept because its outline style and color utilities still apply.

Alias-generated selectors are intentionally low-specificity. This lets a direct utility on the same element override an individual alias member even if the alias rule is generated later. For example, `fxrow-cc jc=space-between` keeps both classes, but `jc=space-between` wins for `justify-content`.

Built-in aliases include:

| Alias         | Expands To                                                        |
| ------------- | ----------------------------------------------------------------- |
| `abs`         | `pos=absolute`                                                    |
| `fixed`       | `pos=fixed`                                                       |
| `rel`         | `pos=relative`                                                    |
| `sticky`      | `pos=sticky`                                                      |
| `static`      | `pos=static`                                                      |
| `iblock`      | `d=inline-block`                                                  |
| `ifx`         | `d=inline-flex`                                                   |
| `fx`          | `d=flex`                                                          |
| `gr`          | `d=grid`                                                          |
| `block`       | `d=block`                                                         |
| `none`        | `d=none`                                                          |
| `table`       | `d=table`                                                         |
| `inline`      | `d=inline`                                                        |
| `hidden`      | `v=hidden`                                                        |
| `visible`     | `v=visible`                                                       |
| `br`          | `brw-px;brst=solid`                                               |
| `brt`         | `brtw-px;brtst=solid`                                             |
| `brr`         | `brrw-px;brrst=solid`                                             |
| `brb`         | `brbw-px;brbst=solid`                                             |
| `brl`         | `brlw-px;brlst=solid`                                             |
| `brx`         | `borderInlineWidth-px;borderInlineStyle=solid`                    |
| `brxs`        | `borderInlineStartWidth-px;borderInlineStartStyle=solid`          |
| `brxe`        | `borderInlineEndWidth-px;borderInlineEndStyle=solid`              |
| `bry`         | `borderBlockWidth-px;borderBlockStyle=solid`                      |
| `brys`        | `borderBlockStartWidth-px;borderBlockStartStyle=solid`            |
| `brye`        | `borderBlockEndWidth-px;borderBlockEndStyle=solid`                |
| `cnt`         | `cnt=inline-size`                                                 |
| `antialiased` | `-webkitFontSmoothing=antialiased;-mozOsxFontSmoothing=grayscale` |
| `truncate`    | `of=hidden;tof=ellipsis;ws=nowrap`                                |

> [!NOTE]
> Animation aliases (like `fade-in`) and flex layout aliases (like `fxrow-cc`) are documented in their respective sections: [Working with Animations](#10-working-with-animations) and [Flex Layout Shortcuts](#11-flex-layout-shortcuts).

> [!TIP]
> Adding `antialiased` to the `<body>` element is a good practice for sharper, more consistent font rendering across browsers.

#### 6. Reserved Values

When you use following values to create fallback chain from class names, Maple treats them as literal strings: `initial, inherit, unset, revert, revert-layer, none, auto, transparent, currentColor, solid, dashed, dotted, double, groove, ridge, inset, outset`

```css
.bgimg-none {
  background-image: none;
}

.fs-inherit {
  font-size: inherit;
}

.w-auto {
  width: auto;
}
```

#### 7. Setting Values Directly

When you need to bypass Maple's fallback chain and use a value directly, use the equal sign `=` or bracket `[]` syntax.

**Equal sign syntax**: Use `=` instead of `-` to pass the value directly without variable resolution.

```html
<div class="bgc=red"><!-- background-color: red --></div>
<div class="w=100px"><!-- width: 100px --></div>
<div class="br=1px_solid_black"><!-- border: 1px solid black --></div>
```

**Bracket syntax**: Use `[value]` within the class for inline custom values, useful when you need special characters.

```html
<div class="bgimg-url|[https://example.com/image.jpg]">
  <!-- background-image: url(https://example.com/image.jpg) -->
</div>

<div class="m-4_[calc(100%_-_20px)]">
  <!-- margin: 1rem calc(100% - 20px) -->
</div>
```

> [!TIP]
> Use equal sign syntax for simple values. Use bracket syntax when your value contains special characters like `:` (colon is a delimiter). Even with equal sign, brackets may be needed: `bgimg=[url(https://example.com/image.jpg)]`.

**Special Character Handling**

Maple uses reverse scanning to detect reserved delimiters (`:`, `()`, `-`, etc.). Single quotes, double quotes, and brackets control parsing depth—content inside them is treated as a single value.

The key difference:

- **Brackets `[]`** are removed from the output
- **Quotes `'...'` or `"..."`** are preserved in the output

```html
<div class="bgimg=[url(https://example.com/image.jpg)]">
  <!-- background-image: url(https://example.com/image.jpg); -->
</div>

<div class="bgimg=url('https://example.com/image.jpg')">
  <!-- background-image: url('https://example.com/image.jpg'); -->
</div>

<div class="@supports=[backdrop-filter:blur(1px)]:bdblur-4">
  <!-- Brackets protect the colon in the @supports query -->
  <!-- @supports (backdrop-filter:blur(1px)) { .selector { backdrop-filter: blur(16px); } } -->
</div>
```

#### 8. Important Modifier

Maple supports `!important` via two syntaxes:

**Prefix syntax** (recommended): Add `!` at the beginning of the class name.

```html
<div class="!bgc-red">
  <!-- background-color: var(--bgc-red, fallback chain...) !important -->
</div>

<div class="!bgc=red">
  <!-- background-color: red !important -->
</div>

<div class="!@md:^:rtl:bgc=red">
  <!-- @media (min-width: 768px) { .selector { background-color: red !important } } -->
</div>
```

**Suffix syntax**: Append `_!important` at the end of the value.

```html
<div class="bgc-red_!important">
  <!-- background-color: var(--bgc-red, fallback chain...) !important -->
</div>

<div class="bgc=red_!important">
  <!-- background-color: red !important -->
</div>

<div class="@md:^:rtl:bgc=red_!important">
  <!-- @media (min-width: 768px) { .selector { background-color: red !important } } -->
</div>
```

#### 9. Dynamic Values

For values that change frequently (like scroll position, mouse coordinates, or sliders), generating unique classes for every value can pollute the CSSOM and cause performance issues. Maple solves this with **Dynamic Classes**.

Prefix any class with `$$` to mark it as dynamic. Dynamic classes:

- Are written to a special ephemeral CSS layer.
- Do not pollute the main stylesheet.
- Are automatically cleared and replaced on the next update cycle.

This is perfect for integrating JS-driven values with Maple's utility system without generating infinite garbage rules.

```javascript
/* Example: using a slider to update CSS variables dynamically */
const slider = document.getElementById('slider');
const preview = document.getElementById('preview');

// Input event: Frequent updates use $$ (Dynamic)
slider.addEventListener('input', (e) => {
  const val = e.target.value;

  // These classes are transient and cleared automatically on next frame/update
  preview.classList.add(`$$--p-spacer=${val}`, `$$--g-spacer=${val}`);
});

// Change event: Final value uses standard class (Persistent)
slider.addEventListener('change', (e) => {
  const val = e.target.value;

  // These are standard static classes
  preview.classList.add(`--p-spacer=${val}`, `--g-spacer=${val}`);
});
```

### 2. Selectors

**Format:** Any css selector is valid before utility classes. However Maple introduces 3 delimiters to allow the elements manage their own styles.

- `^` for parent-state
- `&` for self
- `/` for child

After these delimiters, you can use any css selector. For example:

```html
<div class="^.state-active:bgc-red">
  <!-- My background is red when I'm in a parent having state-active class -->
</div>

<div class="^.card:hover:bgc-red">
  <!-- My background is red when I'm in a parent having card class and it's hovered -->
</div>

<div class="&:hover:bgc-red">
  <!-- My background is red when I'm hovered -->
</div>

<div class="&[data-active='true']:bgc-red">
  <!-- My background is red when I have data-active attribute -->
</div>

<div class="/span:bgc-red">
  <span>
    <!-- My background is red -->
  </span>
</div>

<div class="/+span:bgc-red">
  <!-- If my next sibling is a span, set its background to red -->
</div>
```

You can combine these delimiters to create more complex selectors.

```html
<div class="^.state-active&:hover/span:bgc-red">
  <span>
    <!-- My background is red when my parent is in a parent having state-active class and my parent is hovered -->
  </span>
</div>
```

Instead of space character, you can use underscore `_` to select children.

```html
<div class="^.card_.card-header&:before:content='🙂'">
  <!-- I will be happy when I'm in a card-header element which is also in a card element -->
</div>
```

As said earlier you can use all kind of selectors, even `:not` and `:has`

```html
<div class="^.card:not([class*='p-']):p-4">
  <!-- I have padding when I'm in a card element which doesn't have any padding class -->
</div>

<div class="^.card:has(>.featured):bgc-red">
  <!-- My background is red when I'm in a card which has a direct child with featured class -->
</div>
```

> [!IMPORTANT]
> Parent and self selectors are superior for managing element states without leaking styles. They allow you to build truly isolated components. However, the child selector should be used if only you have no control on the children. Otherwise, it will be against the utility-first philosophy and you might easily end up with a mess.

**Selector Helpers**

Maple provides a few helpers to make selector usage even more concise.

- `:rtl` for `[dir='rtl']`
- `:ltr` for `[dir='ltr']`
- `:odd` for `:nth-child(odd)`
- `:even` for `:nth-child(even)`

```html
<div class="^:rtl:pr-2">
  <!-- I have padding-right when I'm in a rtl parent -->
</div>

<div class="&:odd:bgc-red">
  <!-- My background is red when I'm an odd child -->
</div>

<div class="&:even:bgc-blue">
  <!-- My background is blue when I'm an even child -->
</div>
```

### 3. Media Queries

Maple is a container query first CSS engine. This means that by default, all media queries are container queries. You can use `@` symbol to define a viewport media query.

**Format:** `{prefix}{modifier}{query}{operator}{value}`

- `{prefix}`: Optional. `@` for viewport media queries (`@media`). Default is container query (`@container`).
- `{modifier}`: Optional. `not-` to negate the query.
- `{query}`: The specific media query key (e.g., `md`, `dark`, `mnw`, `style`).
- `{container-name}`: Optional. For container queries, specify the container name in parentheses before the colon or operator, e.g., `md(sidebar)`.
- `{operator}`: Optional. `=` for equality, `!=` for inequality.
- `{value}`: Optional. The value for the query.

#### 1. Container Breakpoints

Use predefined breakpoints directly.

- `xs` for `min-width: 480px`
- `sm` for `min-width: 640px`
- `md` for `min-width: 768px`
- `lg` for `min-width: 1024px`
- `xl` for `min-width: 1280px`
- `2xl` for `min-width: 1536px`

```html
<div class="md:bgc-red">
  <!-- My background is red when I'm in a container which width is equal or greater than 768px -->
</div>

<div class="lg:bgc-blue">
  <!-- My background is blue when I'm in a container which width is equal or greater than 1024px -->
</div>

<div class="md(sidebar):bgc-green">
  <!-- My background is green when I'm in a container which width is equal or greater than 768px and it's name is sidebar -->
</div>
```

> [!IMPORTANT]
> Container queries won't work out of the box because a container query looks for the nearest ancestor that has a defined containment context.
>
> You must convert a parent element into a container by setting the `container-type` property. In Maple, you can do this easily with the `cnt` (container) utility. However, you should not add this class to the `<body>` or `<html>` elements. Instead, you should wrap your application in an element having `cnt` class.

```html
<body>
  <div class="cnt">
    <!-- Application supporting container queries -->
  </div>
</body>
```

In the application, you can define as many containers as you want, even with different names. The children's container queries will work according to the nearest matching container with that name.

```html
<body>
  <div class="cnt">
    <div class="cnt=sidebar">
      <div class="md(sidebar):bgc-green">
        <!-- My background is green when sidebar's width is equal or greater than 768px -->
      </div>
    </div>
  </div>
</body>
```

#### 2. Viewport Breakpoints

The same predefined breakpoints used for container queries are also available for viewport media queries. To target the viewport you need to add `@` prefix to breakpoint.

```html
<div class="@md:bgc-red">
  <!-- My background is red when the viewport width is equal or greater than 768px -->
</div>

<div class="@lg:bgc-blue">
  <!-- My background is blue when the viewport width is equal or greater than 1024px -->
</div>
```

#### 3. Breakpoint Configuration

Maple script accepts breakpoint configuration via query string.

```html
<html>
  <head>
    <script src="https://unpkg.com/@f12io/maple/dist/maple.js?md=680px&4xl=1920px"></script>
  </head>

  <body>
    <!-- Now default md is overridden and a new breakpoint 4xl is added -->

    <div class="@md:bgc-red">
      <!-- My background is red when the viewport width is equal or greater than 680px -->
    </div>

    <div class="@4xl:bgc-blue">
      <!-- My background is blue when the viewport width is equal or greater than 1920px -->
    </div>
  </body>
</html>
```

#### 4. Dimensions

You can write specific width or height constraints with following keys:

- `mnw` for `min-width`
- `mxw` for `max-width`
- `mnh` for `min-height`
- `mxh` for `max-height`

```html
<div class="mnw=300px:bgc-red">
  <!-- My background is red when I'm in a container which width is equal or greater than 300px -->
</div>

<div class="@mxh=800px:bgc-red">
  <!-- My background is red when the viewport height is less than 800px -->
</div>

<div class="mnw!=500px:bgc-red">
  <!-- My background is red when I'm in a container which width is less than 500px -->
</div>

<div class="not-mnw=500px:bgc-red">
  <!-- My background is red when I'm in a container which width is less than 500px -->
</div>
```

> [!TIP]
> When using `mxw` or `mxh` with a predefined breakpoint (e.g., `mxw-md`), Maple generates a `not (min-width: ...)` query, effectively targeting the range below that breakpoint.

```html
<div class="mxw-md:bgc-red">
  <!-- My background is red when I'm in a container which width is less than 768px -->
</div>

<div class="@mxw-md:bgc-red">
  <!-- My background is red when the viewport width is less than 768px -->
</div>
```

#### 5. Orientation

You can use `landscape` and `portrait` keys to target the orientation of the viewport or container.

```html
<div class="landscape:bgc-red">
  <!-- My background is red when I'm in a container which orientation is landscape -->
</div>

<div class="landscape(sidebar):bgc-red">
  <!-- My background is red when I'm in a container called sidebar which orientation is landscape -->
</div>

<div class="portrait:bgc-red">
  <!-- My background is red when I'm in a container which orientation is portrait -->
</div>

<div class="portrait(sidebar):bgc-red">
  <!-- My background is red when I'm in a container called sidebar which orientation is portrait -->
</div>

<div class="@landscape:bgc-red">
  <!-- My background is red when the viewport orientation is landscape -->
</div>

<div class="@portrait:bgc-red">
  <!-- My background is red when the viewport orientation is portrait" -->
</div>
```

#### 6. Color Scheme

You can use `@dark` and `@light` keys to target the user's preferred color scheme. Maple employs a unique **"Hybrid" Dark Mode Architecture** that automatically supports both system preferences and manual toggles without writing extra CSS.

```html
<div class="@dark:bgc-black @dark:c-white">
  <!-- My background is black and text is white in dark mode -->
</div>

<div class="@light:bgc-white @light:c-black">
  <!-- My background is white and text is black in light mode -->
</div>

<div class="@not-dark:bgc-white">
  <!-- My background is white when user does not prefer dark mode -->
</div>
```

**How it works:**

When you use `@dark:`, Maple generates two CSS rules:

1.  **System Preference Rule**: Targets `@media (prefers-color-scheme: dark)`. It includes a guard `:root:not(.light)` to allow manual overriding.
2.  **Manual Override Rule**: Targets `.dark` class on the `:root` element.

This means you can rely on the user's system preference by default. If you need to force a mode, simply add the `dark` or `light` class to the `<html>` element.

- **System Mode** (Default): No class on `<html>`. Follows OS setting.
- **Force Dark**: `<html class="dark">`. Ignores system preference.
- **Force Light**: `<html class="light">`. Ignores system preference.

> [!TIP]
> You can disable this hybrid behavior by adding `nohybrid` to the script query string. In that case, `@dark` will only generate `@media (prefers-color-scheme: dark)` rule.

#### 7. Reduced Motion

You can use `motion-reduce` and `motion-safe` keys to target the user's motion preferences. These are viewport-only queries.

```html
<div class="@motion-reduce:tsdur-0">
  <!-- My transition duration is 0 when user prefers reduced motion -->
</div>

<div class="@motion-safe:tsdur-300">
  <!-- My transition duration is 300ms when user has no motion preference -->
</div>
```

#### 8. Display Modes

You can use display mode shortcuts to target specific display contexts. These are viewport-only queries.

- `browser` for `display-mode: browser`
- `standalone` for `display-mode: standalone`
- `fullscreen` for `display-mode: fullscreen`
- `pip` for `display-mode: picture-in-picture`

```html
<div class="@standalone:p-4">
  <!-- I have padding when the app is in standalone mode (PWA) -->
</div>

<div class="@fullscreen:bgc-black">
  <!-- My background is black when the app is in fullscreen mode -->
</div>

<div class="@pip:o-80">
  <!-- My opacity is 0.8 when the app is in picture-in-picture mode -->
</div>

<div class="@browser:none @standalone:block">
  <!-- I'm hidden in browser but visible when installed as PWA -->
</div>
```

You can also use the explicit `display-mode=value` syntax:

```html
<div class="@display-mode=fullscreen:bgc-black">
  <!-- My background is black when the app is in fullscreen mode -->
</div>
```

#### 9. @supports Queries

You can use `@supports` to check for CSS feature support. These are viewport-only queries.

**Direct utility check**: The `@supports` key without a value checks if the browser supports the utility being applied.

```html
<div class="@supports:bdblur-4 bgc-white/30">
  <!-- Apply backdrop blur if browser supports it -->
</div>

<div class="@supports:rows=subgrid">
  <!-- Use subgrid if browser supports it -->
</div>
```

**Custom query**: Use `@supports=[query]` to check for any CSS feature support.

```html
<div class="@supports=[backdrop-filter:blur(1px)]:bdblur-4 bgc-black/50">
  <!-- Apply backdrop blur with fallback if browser supports it -->
</div>

<div class="@supports=[container-type:inline-size]:cnt">
  <!-- Enable container queries if browser supports them -->
</div>

<div class="@supports=[selector(:has(*))]:^.card:has(.error):bgc-red">
  <!-- Use :has() selector if browser supports it -->
</div>
```

#### 10. Container Style Queries

You can use `style=` to query the computed style of a container. Style queries only work with container queries.

```html
<div class="cnt --theme=dark">
  <div class="style=[--theme:dark]:bgc-gray-900 style=[--theme:dark]:c-white">
    <!-- Dark theme styles applied when container has --theme:dark -->
  </div>
</div>

<div class="cnt=card --variant=outlined">
  <div
    class="style(card)=[--variant:outlined]:br style(card)=[--variant:outlined]:brc-gray-300"
  >
    <!-- Outlined card variant with border styles -->
  </div>
</div>

<div class="cnt --is-expanded=true">
  <div
    class="style=[--is-expanded:true]:h-auto not-style=[--is-expanded:true]:h-0"
  >
    <!-- Toggle height based on --is-expanded state -->
  </div>
</div>
```

#### 11. Container Scroll-State Queries

You can query the scroll state of a container using `stuck=`, `scrollable=`, and `snapped=` keys. These only work with container queries.

**Stuck**: Query whether an element is stuck due to `position: sticky`.

```html
<div class="stuck=top:bgc-red">
  <!-- My background is red when I'm stuck to the top -->
</div>

<div class="stuck=bottom:bgc-blue">
  <!-- My background is blue when I'm stuck to the bottom -->
</div>
```

**Scrollable**: Query whether a container is scrollable in a given direction.

```html
<div class="scrollable=top:bgc-red">
  <!-- My background is red when I'm scrollable from the top -->
</div>

<div class="scrollable=bottom:bgc-blue">
  <!-- My background is blue when I'm scrollable from the bottom -->
</div>
```

**Snapped**: Query whether an element is snapped to a scroll snap position.

```html
<div class="snapped=x:bgc-red">
  <!-- My background is red when I'm snapped on the x-axis -->
</div>

<div class="snapped=y:bgc-blue">
  <!-- My background is blue when I'm snapped on the y-axis -->
</div>

<div class="snapped(snap-container)=y:bgc-green">
  <!-- My background is green when I'm snapped on the y-axis in the snap-container -->
</div>
```

#### 12. Custom Media Queries

You can write any custom media query using the `key=value` format. This works for both viewport and container queries.

```html
<div class="@prefers-contrast=more:c-black">
  <!-- My text is black when user prefers more contrast -->
</div>

<div class="@not-prefers-contrast=more:c-gray">
  <!-- My text is gray when user does NOT prefer more contrast -->
</div>
```

#### 13. Static Fallback Queries

Any unrecognized media query falls back to a static media query. This is useful for targeting specific media types.

```html
<div class="@print:none">
  <!-- I'm hidden when printing -->
</div>

<div class="@not-print:block">
  <!-- I'm visible when NOT printing -->
</div>

<div class="@screen:block">
  <!-- I'm visible on screen -->
</div>
```

#### 14. Nested Queries

You can combine multiple media queries by chaining them with colons. Maple will nest the queries in order of priority.

```html
<div class="@md:@dark:bgc-gray-900">
  <!-- My background is gray-900 on medium screens in dark mode -->
</div>

<div class="@print:md:none">
  <!-- I'm hidden when printing on containers wider than 768px -->
</div>

<div class="md:@xl:o-0">
  <!-- My opacity is 0 when container is >= 768px AND viewport is >= 1280px -->
</div>

<div class="@supports=[opacity:0]:@dark:@md:o-0">
  <!-- Complex nested query: supports opacity + dark mode + medium viewport -->
</div>
```

> [!TIP]
> When nesting queries, Maple automatically determines the order based on query type priority. The query with the **highest priority becomes the outermost wrapper**, and others are nested inside in their original order.
>
> **Priority order (lowest to highest):**
>
> 1. `base` - No media query
> 2. `mnw` - Min-width breakpoints
> 3. `mxw` - Max-width breakpoints
> 4. `mnh` - Min-height breakpoints
> 5. `mxh` - Max-height breakpoints
> 6. `orientation` - Landscape/portrait
> 7. `style` - Container style queries
> 8. `scroll` - Container scroll-state queries
> 9. `light` - Prefers light mode
> 10. `dark` - Prefers dark mode
> 11. `prefers` - User preferences (color-scheme, reduced-motion)
> 12. `supports` - Feature detection
> 13. `static` - Static media types (print, screen)
>
> Additionally, viewport queries (`@media`) get a slight priority boost over container queries (`@container`) of the same type.

## Usage Guide

This section provides practical examples for common styling scenarios using Maple.

### 1. Borders

Maple provides flexible border utilities with shorthand and directional control.

#### Border Shorthand

```html
<!-- Simple border with browser's default color -->
<div class="br">
  <!-- 1px solid border -->
</div>

<!--  Border with custom color -->
<div class="br brc-primary">
  <!-- 1px solid border with primary color -->
</div>

<div class="br brc-silver">
  <!-- 1px solid border with silver color -->
</div>

<!-- Border with width -->
<div class="br-2px_solid">
  <!-- 2px solid border -->
</div>

<!-- Full custom border -->
<div class="br=1px_solid_black">
  <!-- 1px solid black -->
</div>
```

#### Border Width, Style, and Color

```html
<div class="brw-2px"><!-- border-width: 2px --></div>
<div class="brst-dashed"><!-- border-style: dashed --></div>
<div class="brc-gray-300"><!-- border-color with shade --></div>
<div class="brc-red/50"><!-- 50% opacity red border --></div>
```

#### Directional Borders

```html
<div class="brt-px"><!-- border-top: 1px --></div>
<div class="brb-2px_solid_gray"><!-- border-bottom --></div>
<div class="brl-px brr-px"><!-- left and right borders --></div>
```

#### Border Radius

```html
<div class="rad-4"><!-- spacing-based radius (1rem) --></div>
<div class="rad-lg"><!-- variable-based radius --></div>
<div class="rad-%"><!-- 100% (circle) --></div>
```

> [!TIP]
> Compose borders by combining structure and color: `br brc-primary` for full border, `brt brc-gray-200` for top-only. This separation lets you reuse color classes across different border directions without repeating width and style.

### 2. Transforms

Maple provides composable transform utilities that work together. Multiple transforms are automatically combined.

#### Scale

Scale elements uniformly or along specific axes.

```html
<!-- Uniform scale -->
<div class="scale-1.5"><!-- 1.5x scale --></div>
<div class="scale-0.8"><!-- 80% scale --></div>

<!-- Negative scale (flip) -->
<div class="-scale-1"><!-- Flip horizontally --></div>

<!-- Two-axis scale -->
<div class="scale-1_-1"><!-- Scale X normal, flip Y --></div>

<!-- Custom value -->
<div class="scale=1.2"><!-- Direct 1.2x scale --></div>
```

#### Rotate

Rotate elements with degree values (default unit is deg).

```html
<!-- Basic rotation -->
<div class="rot-45"><!-- 45deg --></div>
<div class="-rot-90"><!-- -90deg --></div>

<!-- With explicit units -->
<div class="rot-0.5turn"><!-- Half turn --></div>
<div class="rot-3.14rad"><!-- Radians --></div>
```

#### Translate

Move elements using spacing values.

```html
<!-- Spacing-based translate -->
<div class="tl-4"><!-- Move by 1rem (4 * 0.25) --></div>
<div class="-tl-8"><!-- Move -2rem --></div>

<!-- Percentage translate -->
<div class="tl-%"><!-- Move 100% --></div>
<div class="-tl-%"><!-- Move -100% --></div>

<!-- Two-axis translate -->
<div class="tl-4_8"><!-- X: 1rem, Y: 2rem --></div>
<div class="tl-50%_-50%"><!-- X: 50%, Y: -50% --></div>
```

#### Skew

Skew elements with angle values.

```html
<div class="skew-10"><!-- 10deg --></div>
<div class="skew-10_20"><!-- X: 10deg, Y: 20deg --></div>
```

#### Combining Transforms

Multiple transform classes combine automatically.

```html
<div class="scale-1.1 rot-5 tl-2">
  <!-- Scaled, rotated, and translated -->
</div>
```

### 3. Transitions

Maple provides flexible transition utilities with property, duration, delay, and timing function components.

#### Simple Transitions

```html
<!-- Duration only (ms) -->
<div class="ts-300"><!-- 300ms transition --></div>

<!-- Duration and delay -->
<div class="ts-300_100"><!-- 300ms duration, 100ms delay --></div>

<!-- Duration and property -->
<div class="ts-300_bgc"><!-- 300ms on background-color --></div>

<!-- Full transition -->
<div class="ts-300_100_bgc_ease">
  <!-- 300ms duration, 100ms delay, background-color, ease timing -->
</div>
```

#### Multiple Transitions

Use commas to define multiple transitions.

```html
<div class="ts-300_bgc_ease,200_c">
  <!-- background-color: 300ms ease, color: 200ms -->
</div>
```

#### Individual Properties

```html
<div class="tsdur-300"><!-- transition-duration: 300ms --></div>
<div class="tsdel-100"><!-- transition-delay: 100ms --></div>
<div class="tsprop-bgc"><!-- transition-property: background-color --></div>
<div class="tstf-ease"><!-- transition-timing-function: ease --></div>
```

#### Will-Change

Optimize performance by hinting which properties will change.

```html
<div class="wc-bgc"><!-- will-change: background-color --></div>
<div class="wc-bgc,c,tl"><!-- Multiple properties --></div>
```

### 4. Filters

Apply visual effects to elements. Filter classes compose automatically.

#### Blur

```html
<div class="blur-4"><!-- Blur with spacing value (1rem) --></div>
<div class="blur-px"><!-- 1px blur --></div>
<div class="blur-8px"><!-- 8px blur --></div>
```

#### Brightness, Contrast, Saturation

```html
<div class="brightness-1.2"><!-- 120% brightness --></div>
<div class="contrast-0.8"><!-- 80% contrast --></div>
<div class="saturate-1.5"><!-- 150% saturation --></div>
```

#### Grayscale, Sepia, Invert

```html
<div class="grayscale-1"><!-- Full grayscale --></div>
<div class="sepia-0.5"><!-- 50% sepia --></div>
<div class="invert-1"><!-- Full invert --></div>
```

#### Hue Rotate

```html
<div class="hue-90"><!-- Rotate hue 90 degrees --></div>
<div class="-hue-45"><!-- Rotate hue -45 degrees --></div>
```

#### Drop Shadow

```html
<!-- With preset variable -->
<div class="dshadow-lg"><!-- Large drop shadow --></div>

<!-- Inline values -->
<div class="dshadow-0px_4px_8px_black/20">
  <!-- 0 4px 8px with 20% opacity black -->
</div>

<!-- Multiple shadows -->
<div class="dshadow-sm,lg"><!-- Stacked shadows --></div>
```

### 5. Backdrop Filters

Apply filter effects to the area behind an element (glassmorphism).

```html
<div class="bdblur-4 bgc-white/30">
  <!-- Frosted glass effect -->
</div>

<div class="bdblur-6 bdsaturate-1.5">
  <!-- Blur and enhanced saturation -->
</div>
```

> [!TIP]
> All filter functions (`blur`, `brightness`, `contrast`, `saturate`, `grayscale`, `sepia`, `invert`, `hue`) work with the `bd` prefix for backdrop filters.

### 6. Gradients

Maple uses a distinctive pipe syntax `|` for gradient color stops.

#### Linear Gradients

```html
<!-- Two colors -->
<div class="bgimg-linear|red|blue"><!-- Red to blue --></div>

<!-- With direction -->
<div class="bgimg-linear|to_right|red|blue">
  <!-- Horizontal gradient -->
</div>

<!-- With color stops -->
<div class="bgimg-linear|to_bottom|primary_0|transparent_%">
  <!-- primary at 0%, transparent at 100% -->
</div>

<!-- With transparency -->
<div class="bgimg-linear|to_right|primary/50|secondary/80">
  <!-- 50% and 80% alpha -->
</div>

<!-- Repeating linear -->
<div class="bgimg-rlinear|45deg|red_0|blue_10%">
  <!-- Repeating stripe pattern -->
</div>
```

#### Radial Gradients

```html
<!-- Basic radial -->
<div class="bgimg-radial|red|blue"><!-- Center to edge --></div>

<!-- With shape -->
<div class="bgimg-radial|circle|red|transparent"><!-- Circular --></div>

<!-- With position -->
<div class="bgimg-radial|circle_at_top|white|transparent">
  <!-- From top center -->
</div>

<!-- Repeating radial -->
<div class="bgimg-rradial|circle|red_0|blue_10%">
  <!-- Repeating circular pattern -->
</div>
```

#### Conic Gradients

```html
<div class="bgimg-conic|red|yellow|green|blue|red">
  <!-- Rainbow wheel -->
</div>

<div class="bgimg-conic|from_45deg|primary|secondary">
  <!-- Starting at 45 degrees -->
</div>

<!-- Repeating conic -->
<div class="bgimg-rconic|red_0|blue_10deg">
  <!-- Repeating pie slices -->
</div>
```

#### Multiple Gradients

Combine gradients with commas.

```html
<div
  class="bgimg-linear|to_top|transparent|black/50,radial|circle|white/20|transparent"
>
  <!-- Overlay effect -->
</div>
```

#### Complex Gradients

Create intricate patterns by combining color stops with position and repeat settings.

```html
<!-- Checkerboard pattern -->
<div
  class="bg-conic|#fff_0.25turn|#000_0.25turn_0.5turn|#fff_0.5turn_0.75turn|#000_0.75turn__top_left/25%_25%_repeat"
>
  <!-- Conic gradient with position, size, and repeat -->
</div>
```

#### Background Images with URL

```html
<!-- Absolute URL, because the url contains colon, we need to wrap it with brackets -->
<div class="bgimg-url|[https://example.com/image.jpg]"></div>

<!-- Relative path -->
<div class="bgimg-url|/images/hero.jpg"></div>

<!-- With position and repeat -->
<div class="bg-url|/images/pattern.png__center/cover_no-repeat"></div>
```

> [!TIP]
> The double underscore `__` separates the gradient/image from background shorthand properties. The format is `image__position/size_repeat`. Use `_` for spaces within values (e.g., `center/cover_no-repeat` becomes `center/cover no-repeat`).

### 7. Shadows

Maple supports box shadows, text shadows, and drop shadows with color integration.

#### Box Shadow

```html
<!-- Preset variable -->
<div class="bshadow-lg"><!-- Large shadow --></div>

<!-- Inline definition -->
<div class="bshadow-0px_4px_12px_black/15">
  <!-- 0 4px 12px with 15% black -->
</div>

<!-- Inset shadow -->
<div class="bshadow-0px_2px_4px_inset_gray">
  <!-- Inner shadow -->
</div>

<!-- Multiple shadows -->
<div class="bshadow-sm_primary/10,lg_primary/5">
  <!-- Layered shadows -->
</div>
```

#### Text Shadow

```html
<div class="tshadow-0px_2px_4px_black/30">
  <!-- Text shadow with blur -->
</div>
```

> [!TIP]
> Define shadow variables like `--shadow-sm=0_2px_4px` or `--bshadow-lg=0_8px_24px` containing only position and blur. Then use classes like `bshadow-sm_primary/10` to apply different colors per element, creating consistent shadow shapes with varying brand colors.

### 8. Grid Layout

Smart grid utilities for responsive layouts.

#### Grid Template Columns

```html
<!-- Equal columns -->
<div class="cols-3"><!-- 3 equal responsive columns --></div>

<!-- Fractional columns -->
<div class="cols-1/2/1"><!-- 1fr 2fr 1fr --></div>

<!-- Mixed units -->
<div class="cols-1/4_fr_20">
  <!-- 25%, 1fr, 5rem (20 * 0.25) -->
</div>

<!-- Custom repeat -->
<div class="cols=repeat(auto-fit,minmax(300px,1fr))">
  <!-- Responsive grid -->
</div>
```

#### Grid Template Rows

```html
<div class="rows-2"><!-- 2 equal rows --></div>
<div class="rows-auto_fr_auto"><!-- Header, content, footer --></div>
```

#### Grid Column/Row Span

```html
<div class="col-2"><!-- Span 2 columns --></div>
<div class="row-3"><!-- Span 3 rows --></div>

<!-- Explicit start/end -->
<div class="col=1/-1"><!-- Full width --></div>
<div class="row=2/4"><!-- Row 2 to 4 --></div>
```

#### Grid Areas

```html
<!-- Named areas -->
<div class="areas='header_header'_'sidebar_main'_'footer_footer'"></div>

<!-- Place in area -->
<div class="area=header"><!-- Place in header area --></div>
```

> [!TIP]
> Maple's slash syntax is context-aware: standalone slashes create fractional columns (`cols-1/2` → `1fr 2fr`), while slashes separated by underscores resolve to percentages (`cols-1/2_1/4` → `50% 25%`).

### 9. CSS Variables

Define and use CSS variables directly in class names.

#### Defining Variables

```html
<!-- Simple variable -->
<div class="--primary=blue"></div>

<!-- Complex values -->
<div class="--gradient=linear-gradient(to_right,red,blue)"></div>

<!-- Using other variables -->
<div class="--accent=var(--primary)"></div>
```

#### Root-Level Variables

Add variables to the `<html>` element to make them globally available—no CSS file required.

```html
<html
  class="--primary=blue --secondary=green --spacing=4 @dark:--primary=lightblue"
>
  <!-- All children can use these variables -->
</html>
```

> [!NOTE]
> For **SPAs**, defining variables on `<html>` eliminates the need for external CSS. For **MPAs**, an external CSS file may be more efficient as it gets cached across page navigation.

#### Scoped Variables

Variables can be combined with selectors and media queries.

```html
<div class="--primary=blue @dark:--primary=lightblue">
  <div class="bgc-primary">
    <!-- Blue in light mode, lightblue in dark mode -->
  </div>
</div>
```

#### State-Based Variables

```html
<div class="--bg=gray-100 &:hover:--bg=gray-200">
  <div class="bgc-bg ts-200_bgc">
    <!-- Smooth hover transition -->
  </div>
</div>
```

> [!TIP]
> Unlike traditional CSS frameworks, Maple lets you define scoped CSS variables as utility classes—complete with selectors, media queries, and container queries. This enables component-level theming directly in HTML: `--accent=blue @dark:--accent=cyan md:--accent=purple`.

### 10. Working with Animations

Maple provides utilities for every CSS animation property. The `anim-*` utility also supports animation shorthand values: Maple splits shorthand tokens on `_`, classifies each token, and serializes the result as the CSS `animation` property.

For convenience, include `keyframes.css` when you want to use Maple's built-in animation names. The serializer only writes animation declarations; the keyframes themselves must still exist in CSS.

#### Setup

```html
<head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/@f12io/maple/dist/keyframes.css"
  />
  <script src="https://unpkg.com/@f12io/maple/dist/maple.js"></script>
</head>
```

#### Animation Utilities

```html
<!-- Built-in alias: expands to anim-fade-in_600_ease-out_forwards -->
<div class="fade-in">Fades in over 600ms</div>

<!-- Built-in alias: expands to anim-spin_1000_linear_infinite -->
<div class="spin">⟳</div>

<!-- Custom animation with name, duration, timing function, delay, fill mode -->
<div class="anim-fade-in-up_500_ease-out_200_both">Custom animation</div>

<!-- Hover-triggered animation -->
<div class="&:hover:shake">Shakes on hover</div>
```

#### Animation Shorthand Parsing

In `anim-*`, separate shorthand tokens with `_`.

```html
<div class="anim-fade-in_600_ease-out_forwards"></div>
<div class="anim-spin_1000_linear_infinite"></div>
<div class="anim-fade-in_300_ease-out_forwards,spin_1000_linear_infinite"></div>
```

Maple classifies shorthand tokens in this order:

| Token Type           | Serialized As               | Examples                                                    |
| -------------------- | --------------------------- | ----------------------------------------------------------- |
| Timing function      | `animation-timing-function` | `linear`, `ease-out`, `steps(4)`, `cubic-bezier(0,0,0.2,1)` |
| Direction            | `animation-direction`       | `normal`, `reverse`, `alternate`, `alternate-reverse`       |
| Fill mode            | `animation-fill-mode`       | `none`, `forwards`, `backwards`, `both`                     |
| Play state           | `animation-play-state`      | `running`, `paused`                                         |
| `infinite`           | `animation-iteration-count` | `infinite`                                                  |
| First numeric token  | `animation-duration`        | `600`, `1s`, `250ms`                                        |
| Second numeric token | `animation-delay`           | `200`, `0.15s`                                              |
| Later numeric tokens | `animation-iteration-count` | `3`                                                         |
| Any other token      | `animation-name`            | `fade-in`, `spin`, `custom-loader`                          |

Numeric duration and delay values use Maple's default time unit, so `600` serializes as `600ms`. Use explicit units when needed, such as `1s` or `250ms`.

#### Animation Properties

| Utility    | Property                  | Example Values                    |
| ---------- | ------------------------- | --------------------------------- |
| `anim`     | animation                 | `anim-fade-in`                    |
| `animname` | animation-name            | `animname-spin`                   |
| `animdur`  | animation-duration        | `animdur-600` (600ms)             |
| `animdel`  | animation-delay           | `animdel-200` (200ms)             |
| `animtf`   | animation-timing-function | `animtf-ease-in-out`              |
| `animic`   | animation-iteration-count | `animic-infinite`, `animic-3`     |
| `animdir`  | animation-direction       | `animdir-alternate`               |
| `animfm`   | animation-fill-mode       | `animfm-forwards`, `animfm-both`  |
| `animps`   | animation-play-state      | `animps-paused`, `animps-running` |

#### Customizing Animations

When `anim-*` contains an animation name, Maple can wrap shorthand sub-values with animation-specific CSS variable fallbacks.

```css
var(--animdur-fade-in, var(--animdur, var(--animdur-600, var(--time-600, 600ms))))
var(--animdel-fade-in, var(--animdel, var(--animdel-0, var(--time-0, 0ms))))
var(--animtf-fade-in, var(--animtf, var(--animtf-ease-out, var(--ease-out, ease-out))))
var(--animic-fade-in, var(--animic, var(--animic-infinite, var(--infinite, infinite))))
var(--animdir-fade-in, var(--animdir, var(--animdir-alternate, var(--alternate, alternate))))
var(--animfm-fade-in, var(--animfm, var(--animfm-forwards, var(--forwards, forwards))))
var(--animps-fade-in, var(--animps, var(--animps-running, var(--running, running))))
```

This means you can customize preset defaults with variables, or override individual properties with normal animation utilities:

```html
<!-- Customize animation-specific defaults -->
<html
  class="--animdur=200ms --animdur-fade-in=500ms --animdel-fade-in=100ms --animdur-spin=2s"
>
  <div class="fade-in">Slow fade</div>

  <!-- Override one property on a specific element -->
  <div class="fade-in animdur-200">Fast fade just for this element</div>

  <!-- Customize keyframe behavior exposed by keyframes.css -->
  <div class="--fade-distance=96px fade-in-up">Fades from further</div>
  <div class="--slide-distance=96px slide-in-up">Slides from further</div>
  <div class="--pulse-opacity=0.1 pulse">Deeper pulse</div>
</html>
```

You can also define custom animation aliases on `<html>`:

```html
<html class="--alias-enter=anim-fade-in-up_500_ease-out_both">
  <div class="@enter">Custom enter animation</div>
</html>
```

#### Creating Custom Keyframes

You can define custom keyframes in standard CSS (via a `<style>` block or external stylesheet) and then reference them by name in Maple's `anim-*` utilities.

```html
<style>
  @keyframes slide-intro {
    from {
      opacity: 0;
      transform: translateY(var(--slide-y, 10px));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<!-- Use directly in an element -->
<div class="anim-slide-intro_500_ease-out">Hello World</div>

<!-- Or define an alias for cleaner markup -->
<html class="--alias-intro=anim-slide-intro_500_ease-out">
  <div class="@intro">Better World</div>
</html>
```

> [!TIP]
> Use CSS variables with fallbacks in your keyframes (e.g., `var(--name, default)`) to make them highly reusable. This allows you to tweak the animation behavior per-element without defining new keyframes.

#### Built-in Animation Aliases

The following table lists built-in animation aliases. These can be used directly (e.g., `fade-in`) or with an `@` prefix (e.g., `@fade-in`).

| Animation         | Description                 | Variables                                                                    | Expands To                                           |
| ----------------- | --------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| `fade-in`         | Fade from transparent       | `--fade-from-opacity`, `--fade-to-opacity`                                   | `anim-fade-in_600_ease-out_forwards`                 |
| `fade-out`        | Fade to transparent         | `--fade-from-opacity`, `--fade-to-opacity`                                   | `anim-fade-out_200_ease-in_forwards`                 |
| `fade-in-up`      | Fade in from below          | `--fade-distance` (default: 48px), `--fade-scale-from` (default: 0.98)       | `anim-fade-in-up_600_ease-out_forwards`              |
| `fade-in-down`    | Fade in from above          | `--fade-distance`, `--fade-scale-from`                                       | `anim-fade-in-down_600_ease-out_forwards`            |
| `fade-in-left`    | Fade in from right          | `--fade-distance`, `--fade-scale-from`                                       | `anim-fade-in-left_600_ease-out_forwards`            |
| `fade-in-right`   | Fade in from left           | `--fade-distance`, `--fade-scale-from`                                       | `anim-fade-in-right_600_ease-out_forwards`           |
| `fade-out-up`     | Fade out toward top         | `--fade-distance`, `--fade-scale-to` (default: 0.98)                         | `anim-fade-out-up_200_ease-in_forwards`              |
| `fade-out-down`   | Fade out toward bottom      | `--fade-distance`, `--fade-scale-to`                                         | `anim-fade-out-down_200_ease-in_forwards`            |
| `fade-out-left`   | Fade out toward left        | `--fade-distance`, `--fade-scale-to`                                         | `anim-fade-out-left_200_ease-in_forwards`            |
| `fade-out-right`  | Fade out toward right       | `--fade-distance`, `--fade-scale-to`                                         | `anim-fade-out-right_200_ease-in_forwards`           |
| `scale-in`        | Scale up while fading in    | `--scale-from` (default: 0.96), `--scale-from-opacity`, `--scale-to-opacity` | `anim-scale-in_600_ease-out_forwards`                |
| `scale-out`       | Scale down while fading out | `--scale-to` (default: 0.96), `--scale-from-opacity`, `--scale-to-opacity`   | `anim-scale-out_200_ease-in_forwards`                |
| `slide-in-up`     | Slide in from below         | `--slide-distance`                                                           | `anim-slide-in-up_600_ease-out_forwards`             |
| `slide-in-down`   | Slide in from above         | `--slide-distance`                                                           | `anim-slide-in-down_600_ease-out_forwards`           |
| `slide-in-left`   | Slide in from right         | `--slide-distance`                                                           | `anim-slide-in-left_600_ease-out_forwards`           |
| `slide-in-right`  | Slide in from left          | `--slide-distance`                                                           | `anim-slide-in-right_600_ease-out_forwards`          |
| `slide-out-up`    | Slide out toward top        | `--slide-distance`                                                           | `anim-slide-out-up_200_ease-in_forwards`             |
| `slide-out-down`  | Slide out toward bottom     | `--slide-distance`                                                           | `anim-slide-out-down_200_ease-in_forwards`           |
| `slide-out-left`  | Slide out toward left       | `--slide-distance`                                                           | `anim-slide-out-left_200_ease-in_forwards`           |
| `slide-out-right` | Slide out toward right      | `--slide-distance`                                                           | `anim-slide-out-right_200_ease-in_forwards`          |
| `spin`            | Continuous rotation         | -                                                                            | `anim-spin_1000_linear_infinite`                     |
| `ping`            | Radar ping effect           | `--ping-scale` (default: 2)                                                  | `anim-ping_1000_cubic-bezier(0,0,0.2,1)_infinite`    |
| `pulse`           | Fade in/out loop            | `--pulse-opacity` (default: 0.5)                                             | `anim-pulse_2000_cubic-bezier(0.4,0,0.6,1)_infinite` |
| `bounce`          | Bouncing motion             | `--bounce-distance` (default: 25%)                                           | `anim-bounce_1000_infinite`                          |
| `shake`           | Horizontal shake            | `--shake-distance` (default: 10px)                                           | `anim-shake_800_ease-in-out`                         |
| `wiggle`          | Rotational wiggle           | `--wiggle-angle` (default: 6deg)                                             | `anim-wiggle_400_ease-in-out`                        |

Built-in one-shot aliases use `forwards` so the element keeps the final keyframe after the animation finishes. Use `animfm-both` or an explicit `_both` shorthand only when delayed animations should also apply their first keyframe before they start.

### 11. Flex Layout Shortcuts

Maple provides compact flex layout shortcuts using 2-letter position codes.

#### Position Codes

| Letter | Value         |
| ------ | ------------- |
| `s`    | flex-start    |
| `c`    | center        |
| `e`    | flex-end      |
| `h`    | stretch       |
| `w`    | space-between |

#### Container Shortcuts

| Shortcut      | Description        | Example                      |
| ------------- | ------------------ | ---------------------------- |
| `fxrow-{vh}`  | flex row           | `fxrow-cc` (center-center)   |
| `fxcol-{vh}`  | flex column        | `fxcol-ss` (start-start)     |
| `ifxrow-{vh}` | inline-flex row    | `ifxrow-cw` (center-between) |
| `ifxcol-{vh}` | inline-flex column | `ifxcol-ee` (end-end)        |

#### Self Shortcuts

| Shortcut         | Description             | Example        |
| ---------------- | ----------------------- | -------------- |
| `fxrowself-{vh}` | self position in row    | `fxrowself-cc` |
| `fxcolself-{vh}` | self position in column | `fxcolself-ss` |

#### Examples

```html
<!-- Centered content -->
<div class="fxrow-cc">Horizontally and vertically centered</div>

<!-- Header with logo left, nav right -->
<header class="fxrow-cw">
  <div>Logo</div>
  <nav>Links</nav>
</header>

<!-- Vertical stack, items at top-left -->
<div class="fxcol-ss g-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive layout -->
<div class="fxcol-ss md:fxrow-cw">
  <div>Stacked on mobile, row on tablet</div>
</div>

<!-- Self-positioning within flex parent -->
<div class="fxrow-ss">
  <div>Top-left</div>
  <div class="fxrowself-ee">Bottom-right override</div>
</div>
```

### 12. Combining Features

Maple's power comes from combining utilities for complex effects.

#### Responsive Card with Hover

```html
<div
  class="
  bgc-white
  p-4 md:p-6
  rad-8
  bshadow-sm
  &:hover:bshadow-lg
  ts-200
  @dark:bgc-gray-800
"
>
  <!-- Card content -->
</div>
```

#### Glassmorphism Panel

```html
<div
  class="
  bgc-white/10
  bdblur-4
  bdsaturate-1.2
  br brc-white/20
  rad-16
  p-6
"
>
  <!-- Frosted glass content -->
</div>
```

#### Animated Button

```html
<button
  class="
  bgc-primary c-white
  px-6 py-3 rad-8
  ts-150_all_ease
  &:hover:bgc-primary-600
  &:hover:scale-1.02
  &:active:scale-0.98
"
>
  Click Me
</button>
```

#### Hero Section with Gradient Overlay

```html
<div
  class="
  rel mnh-vh
  bgimg-url|/images/hero.jpg__center/cover
"
>
  <div
    class="
    abs inset-0
    bgimg-linear|to_top|black/80|transparent
  "
  ></div>
  <div class="rel z-1 c-white p-8">
    <!-- Hero content -->
  </div>
</div>
```

#### Responsive Navigation

```html
<nav
  class="
  fx ai=center jc=between
  p-4 md:px-8
  bgc-white @dark:bgc-gray-900
  bshadow-sm
  stuck=top:bshadow-lg
  ts-200
"
>
  <!-- Nav content -->
</nav>
```

## Automatic Conflict Resolution

Atomic CSS makes styling easy to compose, but composition creates an ordering problem. A component may provide `p-4`, a caller may add `p-8`, a state branch may add `@md:p-6`, and an alias may expand to several utilities at once. If all of those classes remain in the DOM, the final visual result depends on CSS generation order, selector specificity, stylesheet layer order, and framework string-concatenation habits. That makes class strings harder to reason about than they appear.

In Tailwind and similar build-time utility systems, the common solution is a JavaScript helper such as `cn`, usually implemented with `clsx` for conditional class construction and `tailwind-merge` for conflict removal:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

That pattern works well inside JavaScript component code because every class list can be routed through one function before it reaches the DOM. It is less natural outside that paradigm. Server-rendered templates, CMS markup, WordPress themes, PHP, Rails, Django, static HTML, third-party widgets, and DOM mutations created after hydration do not automatically pass through a React-style helper. Each stack needs its own convention, and any missed class string can keep stale conflicts alive.

Maple moves that responsibility into the CSS engine. Whenever Maple processes an element, it reads the element's actual `class` attribute, parses each utility, and generates a conflict key from the emitted CSS property and its context. Later utilities win. Earlier utilities that would write the same property in the same media query and selector context are removed from the element's class attribute.

```html
<div class="p-4 p-8"></div>
<!-- Maple normalizes this to: class="p-8" -->

<div class="@md:p-4 @md:p-8"></div>
<!-- Maple normalizes this to: class="@md:p-8" -->

<div class="p-4 @md:p-8"></div>
<!-- Kept: the base context and @md context do not conflict. -->
```

This has two important effects:

- The DOM becomes the source of truth. You can append classes from templates, framework bindings, CMS fields, server-rendered markup, or direct DOM APIs, and Maple resolves the final class list after those classes exist on the element.
- The mental model stays local. When two utilities write the same thing in the same context, the one on the right is the one that survives.

Maple's merge model is property-aware rather than string-only:

- Exact duplicates collapse to the last occurrence: `p-4 p-4` becomes `p-4`.
- Shorthand utilities override earlier covered longhands, but earlier shorthands can still be refined by later longhands: `mx-4 m-6` becomes `m-6`, while `m-6 mx-4` stays `m-6 mx-4`.
- Original property names and abbreviations share the same conflict space: `p-4 padding-6` becomes `padding-6`.
- Media queries and selectors are part of the conflict key: `p-4 @md:p-4` stays as-is, while `&:hover:p-4 &:hover:p-8` becomes `&:hover:p-8`.
- Arbitrary values, custom values, and CSS variables still follow class order: `h-[10px] h-[20px]` becomes `h-[20px]`, and `--tone-factor=1 --tone-factor=2` becomes `--tone-factor=2`.
- Important utilities conflict with other important utilities, and they suppress earlier normal utilities for the same property: `!p-3 !p-4` becomes `!p-4`, `p-3 !p-4` becomes `!p-4`, and `!p-3 p-4` stays `!p-3 p-4`.
- Composable CSS features are merged by component, not by the final serialized property. For example, transform and filter utilities such as `tl-4 rot-45` or `blur-4 brightness-100` can coexist, while `tl-4 tl-8` resolves to `tl-8`.
- Aliases expand before merge checks. If `@focus-ring` expands to `olw-2px;olst=solid;olc=currentColor`, then `@focus-ring olw-4px` keeps `@focus-ring olw-4px` because the alias still contributes outline style and color, but its `olw-2px` member is overridden by `olw-4px`.

Maple also handles CSS shorthand relationships carefully. A later broad shorthand can remove earlier covered utilities, but Maple avoids false positives for properties that share a prefix without actually overriding each other. For example, `br-px rad-px`, `fx-1 fxdir=row`, `of=hidden ofwr=anywhere`, and `cols-1 col-2` are kept because those pairs target distinct CSS behavior.

This changes the usual utility-class architecture. React applications using Maple do not need a `cn`-style merge helper for conflict resolution. They may still use helpers for conditional string construction, variants, or ergonomics, but correctness no longer depends on funneling every class through a JavaScript merge function. The same conflict resolution applies in non-JavaScript-first environments, where adding a package-level class merging convention would otherwise be difficult or impossible without extra runtime code.

If you want Maple to generate styles without editing class attributes, enable [`nomerge` mode](#nomerge-mode-nomerge). Use it only when you deliberately want to preserve every class exactly as written and are comfortable managing conflicts yourself.

## Configuration

Maple accepts configuration via script query string parameters.

### Script Query String

```html
<script src="https://unpkg.com/@f12io/maple/dist/maple.js?refs&nomerge&md=680px&4xl=1920px"></script>
```

| Parameter              | Description                                  |
| ---------------------- | -------------------------------------------- |
| `refs`                 | Enable reference mode for better performance |
| `nomerge`              | Disable merging of utility classes           |
| `nohybrid`             | Disable the hybrid dark mode generation.     |
| `{breakpoint}={value}` | Override or add custom breakpoints           |

### Custom Breakpoints

Override default breakpoints or add new ones:

```html
<script src="maple.js?sm=480px&md=680px&lg=960px&xl=1200px&4xl=1920px"></script>
```

Now you can use your custom breakpoints:

```html
<div class="@4xl:cols-4"><!-- 4 columns at 1920px+ --></div>
```

### Nomerge Mode (`nomerge`)

By default, Maple resolves conflicts between utility classes at runtime. If an element has multiple classes targeting the same generated property in the same context, Maple determines the winner from the class order, removes overridden classes from the element, and inserts only the surviving rules. See [Automatic Conflict Resolution](#automatic-conflict-resolution) for the full model.

You can disable this behavior by adding `nomerge` to the script query string:

```html
<script src="maple.js?nomerge"></script>
```

**Effects of `nomerge` mode:**

1.  **No DOM Cleanup**: Maple will not modify the `class` attribute of elements. All utility classes remain in the DOM.
2.  **No Conflict Pruning**: Maple skips conflict calculation. If a class list contains competing utilities, you are responsible for making the final cascade predictable.
3.  **Performance Boost**: Skips the overhead of conflict calculation and DOM manipulation, resulting in faster initial rendering.

**When to use `nomerge`:**

- When you are sure your class lists don't contain conflicting utilities.
- When preserving the exact class attribute is more important than automatic cleanup.

### Reference Mode (`refs`)

By default, Maple generates full fallback chains for every utility class. This is especially impactful for colors, which use complex `oklch` calculations:

```css
/* Without refs - this entire calculation repeats for every color utility */
.c-red {
  color: oklch(
    from var(--c-red, var(--color-red, var(--red, red)))
      calc(
        l *
          var(
            --c-red-l-scale,
            var(--red-l-scale, var(--c-l-scale, var(--l-scale, 1)))
          )
      )
      calc(
        c *
          var(
            --c-red-c-scale,
            var(--red-c-scale, var(--c-c-scale, var(--c-scale, 1)))
          )
      )
      calc(
        h +
          var(
            --c-red-h-rotate,
            var(--red-h-rotate, var(--c-h-rotate, var(--h-rotate, 0)))
          )
      ) /
      alpha
  );
}
```

With `refs` enabled, Maple caches these calculations in global reference variables:

```css
/* With refs - calculated once, referenced everywhere */
:root {
  --ref-c-red: oklch(from var(--c-red, ...) calc(...) calc(...) calc(...));
}
.c-red {
  color: var(--ref-c-red);
}
.bgc-red {
  background-color: var(--ref-bgc-red);
}
```

**Benefits of `refs` mode:**

- Faster Maple CSS generation (once generated, it's cached in JavaScript)
- Smaller CSS output (complex color formulas defined once)
- Faster browser rendering for large pages with many color utilities

**Trade-offs of `refs` mode:**

- Loses local scoping—you cannot override `--c-red` on a specific element since all utilities reference the global `--ref-c-red`
- **DevTools slowdown**: Browser DevTools lists all `:root` variables for every selected element, navigating between variables becomes sluggish in large applications with many ref definitions

### When to Use `refs`

| Scenario                                | Recommendation                   |
| --------------------------------------- | -------------------------------- |
| Large applications with many utilities  | Enable `refs` for performance    |
| Design systems with consistent tokens   | Enable `refs`                    |
| Need local CSS variable overrides       | Disable `refs` or use `$` prefix |
| Component libraries with scoped theming | Disable `refs`                   |

### The `$` Prefix (Local Override)

When `refs` is enabled, prefix a class with `$` to skip the reference cache and generate the full fallback chain:

```html
<script src="maple.js?refs"></script>

<div class="p-4"><!-- Uses var(--ref-p-4) --></div>

<div class="$p-4 --p-4=2rem">
  <!-- Uses full fallback chain, allowing local --p-4 override -->
</div>
```

This gives you the best of both worlds: global performance with `refs`, plus local scoping when needed.

## Best Practices

These practices align with Maple's philosophy and modern frontend development principles.

### Prefer Semantic Tokens Over Arbitrary Values

Maple's variable-first architecture shines when you use semantic tokens that can be overridden contextually.

```html
<!-- ✅ Good: Semantic tokens, themeable -->
<div class="bgc-primary-200 c-primary-700 p-4 rad-lg"></div>

<!-- ⚠️ Avoid: Arbitrary values, not themeable -->
<div class="bgc=#3b82f6 c=white p=16px rad=8px"></div>
```

Define your tokens once and let Maple's fallback chain do the work:

```html
<html
  class="--primary=blue --on-primary=white --spacer=0.35 --rad-lg=12px"
></html>
```

### Compose Locally, Extract Components

Compose utilities directly when a pattern is local to one element. When the same class combination appears repeatedly, move it into a component, template, or helper so the behavior has one owner.

### Use Aliases for Utility-Like Jobs

Reserve aliases for utility-first shortcuts: multiple declarations that perform one clear styling job. They are a good fit for behaviors like text truncation, font smoothing, or focus rings, not for component-sized button or card recipes.

```html
<!-- ✅ Good: Alias for one utility-like job -->
<html class="--alias-truncate=of=hidden;tof=ellipsis;ws=nowrap">
  <body>
    <span class="@truncate w-40">Long text that should truncate</span>
  </body>
</html>

<!-- ⚠️ Avoid: Component-sized aliases like @button or @card -->
```

### Use Scoped Variables for Component Theming

Instead of creating component variants via props or separate classes, scope variables locally:

```html
<!-- ✅ Good: Scoped theming via variables -->
<div class="--accent=teal">
  <button class="bgc-accent-500 c-white">Teal Button</button>
</div>

<div class="--accent=purple">
  <button class="bgc-accent-500 c-white">Purple Button</button>
</div>
```

This creates truly portable components that adapt to their context.

### Bound Runtime Values

Maple generates styles on-demand, but dynamic runtime values can cause CSSOM growth:

```html
<!-- ⚠️ Risky: Dynamic user input -->
<div class="w=${userInput}px"></div>

<!-- ✅ Safe: Constrained to known numeric scale values -->
<div class="w-${[32, 48, 64][sizeIndex] ?? 48}"></div>

<!-- ✅ Safe: Ephemeral CSS layer with $$ prefix -->
<div class="$$tl-x=\${scrollPos}px"></div>
```

> [!TIP]
> If you cannot avoid dynamic values (e.g., scroll position, mouse coordinates), use **Dynamic Classes** by prefixing them with `$$`. This prevents CSSOM pollution by writing styles to an ephemeral layer. See [Dynamic Values](#9-dynamic-values).

### Use Selectors Responsibly

Maple's selector power (`^`, `&`, `/`) enables component encapsulation, but overuse creates complexity:

```html
<!-- ✅ Good: Clear contextual adaptation -->
<button class="^.card:c-gray-700 ^.nav:c-white">Adaptive Button</button>

<!-- ⚠️ Avoid: Over-nested selectors -->
<div class="^.sidebar:not(.collapsed)&:hover/.icon:scale-1.2"></div>
```

If a selector chain becomes hard to read, consider restructuring your component hierarchy.

> [!IMPORTANT]
> Parent (`^`) and self (`&`) selectors are great for isolated components. However, the child selector (`/`) should only be used when you have no control over the children (e.g., CMS output, markdown). Otherwise, it goes against the utility-first philosophy.

### Prefer Container Queries

Maple is **container query first**—breakpoints without `@` target the nearest container, not the viewport. Use `@` prefix for viewport media queries.

```html
<!-- Container query (targets nearest .cnt ancestor) -->
<section class="cnt">
  <div class="sm:cols-2"><!-- 2 cols when container >= sm --></div>
</section>

<!-- Viewport query (requires @ prefix) -->
<div class="@md:cols-3"><!-- 3 cols when viewport >= md --></div>
```

> [!IMPORTANT]
> Add `cnt` to the nearest parent container you want to query. Do not put it on `html` or `body`; wrap your application or component area instead.

### Prefer Native CSS Features Over JavaScript

Use scroll-state queries for sticky element behavior instead of JavaScript scroll listeners:

```html
<!-- ✅ Good: Pure CSS sticky detection -->
<nav class="stuck=top:bshadow-lg ts-200">Navigation</nav>

<!-- ⚠️ Avoid: JavaScript scroll listeners -->
<nav class="^.scrolled:bshadow-lg"><!-- Requires JS to add .scrolled --></nav>
```

### Leverage Color Manipulation

Use Maple's OKLCH color system instead of defining multiple color variants:

```html
<!-- ✅ Good: Derive variants from base color -->
<button
  class="bgc-primary-500 &:hover:bgc-primary-600 &:active:bgc-primary-700"
></button>

<!-- ⚠️ Avoid: Defining separate colors for each state -->
<html class="--primary-hover=#2563eb --primary-active=#1d4ed8"></html>
```

The `-600`, `-700` suffixes adjust lightness automatically in OKLCH space.

Keep tone and alpha values on a small, consistent scale such as steps of 5 or 10.

For advanced color manipulation, use these CSS variables:

| Variable     | Effect                     | Default |
| ------------ | -------------------------- | ------- |
| `--l-scale`  | Scale lightness (0-∞)      | `1`     |
| `--l-shift`  | Scale tone shift intensity | `1`     |
| `--c-scale`  | Scale saturation (0-∞)     | `1`     |
| `--h-rotate` | Shift hue (degrees)        | `0`     |

These variables follow a fallback chain for fine-grained control:

```
--{property}-{color}-{key}  →  Property + color specific (e.g., --bgc-red-l-scale)
--{color}-{key}             →  Color specific (e.g., --red-l-scale)
--{property}-{key}          →  Property specific (e.g., --bgc-l-scale)
--{key}                     →  Global (e.g., --l-scale)
```

There are also two global curve controls for tone generation:

| Variable         | Effect                               | Default |
| ---------------- | ------------------------------------ | ------- |
| `--l-edge-shift` | Dampen lightness shift near extremes | `0.5`   |
| `--c-curve`      | Reduce chroma for extreme tones      | `0.5`   |

```html
<!-- Desaturate colors in a section -->
<div class="--c-scale=0.5">
  <div class="bgc-primary"><!-- Muted primary --></div>
</div>

<!-- Shift hue for color themes -->
<div class="--bgc-blue-h-rotate=30">
  <div class="bgc-blue"><!-- Shifted towards cyan --></div>
</div>

<!-- Boost lightness for light mode -->
<div class="--c-l-scale=1.2">
  <div class="c-gray"><!-- Lighter gray text --></div>
</div>
```

> [!TIP]
> In dark mode, you can set `--l-shift: -0.7` to invert the tone scale — tones below 500 become darker while tones above 500 become lighter. This is useful for maintaining visual hierarchy when switching color schemes.

### Use Reference Mode Deliberately

The `refs` option can reduce generated CSS and speed up large pages by caching fallback chains in global reference variables. Use it for broad design-system pages, but avoid it for component libraries that depend heavily on local variable overrides.

```html
<!-- refs caches repeated fallback chains globally -->
<script src="maple.js?refs"></script>

<!-- Use $ when a local override must bypass the reference cache -->
<div class="$p-4 --p-4=2rem"></div>
```

### Use `!important` Sparingly

The `!` prefix is powerful but should be reserved for true overrides:

```html
<!-- ✅ Good: Override third-party styles -->
<div class="!m-0"><!-- Reset unwanted margin --></div>

<!-- ⚠️ Avoid: Using !important as default -->
<div class="!p-4 !bgc-white !c-black"></div>
```

### Building Component Libraries with Maple

#### Self Selector for Component Variants

Use the self selector (`&`) to define variants that respond to classes on the element itself:

```html
<!-- Button with all variants defined via self selector, can be used in Angular, Vue or React without any props -->
<button
  class="
    ifx ai=center jc=center g-2
    ws=nowrap rad-md fs-sm fw-500
    ts-150_bgc,150_c
    &:focus-visible:ol-2px &:focus-visible:olc-primary
    &:disabled:ptr=none &:disabled:o-50

    bgc-primary c-primary &:hover:bgc-primary-400

    &.destructive:bgc-destructive
    &.destructive:c-destructive
    &.destructive:hover:bgc-destructive-400

    &.outline:br &.outline:brc-primary
    &.outline:bgc-body
    &.outline:hover:bgc-accent
    &.outline:hover:c-accent

    h-9 px-4 py-2
    &.sm:h-8 &.sm:px-3 &.sm:fs-xs
    &.lg:h-10 &.lg:px-8
  "
>
  Click me
</button>
```

#### Usage (Zero JavaScript for Styling)

```tsx
// All Maple classes defined as a constant
const baseClasses = `
  ifx ai=center jc=center g-2
  ws=nowrap rad-md fs-sm fw-500
  ts-150_bgc,150_c
  &:focus-visible:ol-2px &:focus-visible:olc-primary
  &:disabled:ptr=none &:disabled:o-50

  bgc-primary c-primary &:hover:bgc-primary-400

  &.destructive:bgc-destructive &.destructive:c-destructive
  &.destructive:hover:bgc-destructive-400

  &.outline:br &.outline:brc-primary &.outline:bgc-body
  &.outline:hover:bgc-accent &.outline:hover:c-accent

  &.secondary:bgc-secondary &.secondary:c-secondary
  &.secondary:hover:bgc-secondary/80

  &.ghost:bgc-transparent
  &.ghost:hover:bgc-accent &.ghost:hover:c-accent

  &.link:bgc-transparent &.link:c-primary
  &.link:textUnderlineOffset-4px &.link:hover:tdeco-underline

  h-9 px-4 py-2
  &.sm:h-8 &.sm:px-3 &.sm:fs-xs
  &.lg:h-10 &.lg:px-8
  &.icon:square-9
`;

// React component - just forwards classes
function Button({ className, children, ...props }) {
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Usage
<Button>Default</Button>
<Button className="destructive">Delete</Button>
<Button className="outline lg">Large Outline</Button>
<Button className="ghost sm">Small Ghost</Button>
<Button className="icon"><Icon /></Button>
```

#### Key Insight

The self selector (`&.variant:`) reads classes from the element itself. This means:

- `&.ghost:bgc-transparent` → Applies when the button has class `ghost`
- `&.lg:h-10` → Applies when the button has class `lg`
- `&.destructive:hover:bgc-red-400` → Hover state for destructive variant

Multiple classes combine naturally: `<Button className="outline lg" />` applies all matching styles.

> [!TIP]
> Define your design tokens as CSS variables (`--bgc-primary`, `--c-primary`, `--brc-primary`, etc.) and reference them in utilities. The same component works across different themes without any code changes.

## Abbreviations Reference

Maple uses abbreviations for CSS properties. If a property is not listed, use its camelCase version (e.g., `scrollBehavior`).

### Layout & Display

| Abbreviation | Property   |
| ------------ | ---------- |
| `d`          | display    |
| `pos`        | position   |
| `t`          | top        |
| `r`          | right      |
| `b`          | bottom     |
| `l`          | left       |
| `z`          | zIndex     |
| `of`         | overflow   |
| `ofx`        | overflowX  |
| `ofy`        | overflowY  |
| `v`          | visibility |

### Flexbox

| Abbreviation | Property       |
| ------------ | -------------- |
| `fx`         | flex           |
| `fxb`        | flexBasis      |
| `fxdir`      | flexDirection  |
| `fxf`        | flexFlow       |
| `fxg`        | flexGrow       |
| `fxs`        | flexShrink     |
| `fxwr`       | flexWrap       |
| `ai`         | alignItems     |
| `ac`         | alignContent   |
| `as`         | alignSelf      |
| `jc`         | justifyContent |
| `ji`         | justifyItems   |
| `js`         | justifySelf    |

### Grid

| Abbreviation | Property            |
| ------------ | ------------------- |
| `gr`         | grid                |
| `grt`        | gridTemplate        |
| `cols`       | gridTemplateColumns |
| `rows`       | gridTemplateRows    |
| `areas`      | gridTemplateAreas   |
| `col`        | gridColumn          |
| `row`        | gridRow             |
| `area`       | gridArea            |
| `g`          | gap                 |
| `gx`         | columnGap           |
| `gy`         | rowGap              |

### Spacing

| Abbreviation | Property           |
| ------------ | ------------------ |
| `m`          | margin             |
| `mt`         | marginTop          |
| `mr`         | marginRight        |
| `mb`         | marginBottom       |
| `ml`         | marginLeft         |
| `mx`         | marginInline       |
| `my`         | marginBlock        |
| `ms`         | marginInlineStart  |
| `me`         | marginInlineEnd    |
| `p`          | padding            |
| `pt`         | paddingTop         |
| `pr`         | paddingRight       |
| `pb`         | paddingBottom      |
| `pl`         | paddingLeft        |
| `px`         | paddingInline      |
| `py`         | paddingBlock       |
| `ps`         | paddingInlineStart |
| `pe`         | paddingInlineEnd   |

### Sizing

| Abbreviation | Property    |
| ------------ | ----------- |
| `w`          | width       |
| `h`          | height      |
| `mnw`        | minWidth    |
| `mnh`        | minHeight   |
| `mxw`        | maxWidth    |
| `mxh`        | maxHeight   |
| `ar`         | aspectRatio |

### Typography

| Abbreviation | Property       |
| ------------ | -------------- |
| `c`          | color          |
| `f`          | font           |
| `ff`         | fontFamily     |
| `fs`         | fontSize       |
| `fw`         | fontWeight     |
| `fst`        | fontStyle      |
| `lh`         | lineHeight     |
| `ls`         | letterSpacing  |
| `ta`         | textAlign      |
| `tdeco`      | textDecoration |
| `ttf`        | textTransform  |
| `tof`        | textOverflow   |
| `twr`        | textWrap       |
| `tshadow`    | textShadow     |
| `ws`         | whiteSpace     |

### Background

| Abbreviation | Property           |
| ------------ | ------------------ |
| `bg`         | background         |
| `bgc`        | backgroundColor    |
| `bgimg`      | backgroundImage    |
| `bgpos`      | backgroundPosition |
| `bgs`        | backgroundSize     |
| `bgr`        | backgroundRepeat   |
| `bgclip`     | backgroundClip     |
| `bgo`        | backgroundOrigin   |

### Border

| Abbreviation | Property                |
| ------------ | ----------------------- |
| `br`         | border                  |
| `brw`        | borderWidth             |
| `brst`       | borderStyle             |
| `brc`        | borderColor             |
| `brt`        | borderTop               |
| `brr`        | borderRight             |
| `brb`        | borderBottom            |
| `brl`        | borderLeft              |
| `rad`        | borderRadius            |
| `brtlrad`    | borderTopLeftRadius     |
| `brtrrad`    | borderTopRightRadius    |
| `brblrad`    | borderBottomLeftRadius  |
| `brbrrad`    | borderBottomRightRadius |

### Effects

| Abbreviation | Property       |
| ------------ | -------------- |
| `bshadow`    | boxShadow      |
| `o`          | opacity        |
| `bdf`        | backdropFilter |
| `mixblend`   | mixBlendMode   |

### Transform

| Abbreviation | Property        |
| ------------ | --------------- |
| `tf`         | transform       |
| `tfo`        | transformOrigin |
| `tfst`       | transformStyle  |
| `tfbox`      | transformBox    |
| `tl`         | translate       |

### Transition & Animation

| Abbreviation | Property                 |
| ------------ | ------------------------ |
| `ts`         | transition               |
| `tsprop`     | transitionProperty       |
| `tsdur`      | transitionDuration       |
| `tsdel`      | transitionDelay          |
| `tstf`       | transitionTimingFunction |
| `anim`       | animation                |
| `animname`   | animationName            |
| `animdur`    | animationDuration        |
| `animdel`    | animationDelay           |
| `animtf`     | animationTimingFunction  |
| `animdir`    | animationDirection       |
| `animic`     | animationIterationCount  |
| `animfm`     | animationFillMode        |
| `animps`     | animationPlayState       |

### Outline

| Abbreviation | Property      |
| ------------ | ------------- |
| `ol`         | outline       |
| `olw`        | outlineWidth  |
| `olst`       | outlineStyle  |
| `olc`        | outlineColor  |
| `oloff`      | outlineOffset |

### Other

| Abbreviation | Property      |
| ------------ | ------------- |
| `cnt`        | container     |
| `wc`         | willChange    |
| `ptr`        | pointerEvents |
| `dir`        | direction     |
