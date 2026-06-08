---
name: Maple CSS Engine
description: A variable-first, stack-agnostic runtime CSS engine for building responsive interfaces.
license: ROOT - https://rootsrc.org
metadata:
  author: f12.io
  version: '2.0.0'
---

# Maple CSS Skill

This is the entry point for AI assistants using Maple. Maple is a variable-first, stack-agnostic runtime CSS engine.

Do not guess Maple classes from Tailwind, Bootstrap, UnoCSS, or other utility systems. When writing Maple classes, first read the relevant reference file below and follow the syntax documented there.

## Reference Files

- Overview, quick start, and core concepts: [guide/01-overview.md](guide/01-overview.md)
- Syntax reference and utilities: [guide/02-utilities.md](guide/02-utilities.md)
- Selectors: [guide/03-selectors.md](guide/03-selectors.md)
- Media queries: [guide/04-media-queries.md](guide/04-media-queries.md)
- Usage guide introduction: [guide/00-usage-guide.md](guide/00-usage-guide.md)
- Borders: [guide/05-borders.md](guide/05-borders.md)
- Transforms: [guide/06-transforms.md](guide/06-transforms.md)
- Transitions: [guide/07-transitions.md](guide/07-transitions.md)
- Filters: [guide/08-filters.md](guide/08-filters.md)
- Gradients: [guide/09-gradients.md](guide/09-gradients.md)
- Shadows: [guide/10-shadows.md](guide/10-shadows.md)
- Grid layout: [guide/11-grid-layout.md](guide/11-grid-layout.md)
- CSS variables: [guide/12-css-variables.md](guide/12-css-variables.md)
- Animations: [guide/13-animations.md](guide/13-animations.md)
- Flex layout: [guide/14-flex-layout.md](guide/14-flex-layout.md)
- Combining features: [guide/15-combining-features.md](guide/15-combining-features.md)
- Automatic conflict resolution: [guide/16-conflict-resolution.md](guide/16-conflict-resolution.md)
- Configuration, refs, nomerge, and breakpoints: [guide/17-configuration.md](guide/17-configuration.md)
- Abbreviations reference: [guide/18-abbreviations-reference.md](guide/18-abbreviations-reference.md)
- Advanced installation: [guide/19-advanced-installation.md](guide/19-advanced-installation.md)

If an abbreviation exists in the abbreviations reference, Maple can also use the camelCase version of that CSS property.

## Required Workflow

1. Identify the Maple feature needed for the user request.
2. Read the relevant reference file before writing classes for that feature.
3. Use only documented Maple syntax.
4. If a semantic token is used, make sure it is already defined in the surrounding code or define it with Maple CSS variable utilities.
5. Prefer documented Maple utilities and examples over invented class names.

## Core Syntax Reminder

Maple class names are composed as:

```txt
{media-query}:{selector}:{utility}
```

The media query and selector parts are optional. Utilities can use token resolution, literal values, bracket values, CSS variable utilities, aliases, important modifiers, dynamic values, and feature-specific serializers as documented in the reference files.

The utility consists of a property name and a value separated by a hyphen or equal sign. All camelCase CSS properties are supported (e.g. `accentColor`). Some properties have shorthand versions (e.g. `bgc` for `backgroundColor`). See the list of shorthand versions in [guide/18-abbreviations-reference.md](guide/18-abbreviations-reference.md). If a property does not have a shorthand version, use the camelCase version of that property.

## Best Practices

### Prefer Semantic Tokens

Maple's architecture shines when you use tokens that express intent rather than hard-coded values. This keeps your design themeable, easier to audit, and consistent across components.

```html
<!-- ✅ Good: Semantic tokens, themeable -->
<div class="bgc-primary-200 c-primary-700 p-4 rad-lg"></div>

<!-- ⚠️ Avoid: Arbitrary values, not themeable -->
<div class="bgc=#3b82f6 c=white p=16px rad=8px"></div>
```

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

### Use Scoped Variables

Scope variables locally for contextual theming. This keeps components portable: the component can keep the same utility classes while the parent decides the actual token values.

```html
<div class="--accent=teal">
  <button class="bgc-accent-500 c-white">Teal Button</button>
</div>

<div class="--accent=purple">
  <button class="bgc-accent-500 c-white">Purple Button</button>
</div>
```

### Use Selectors Responsibly

Parent (`^`) and self (`&`) selectors are excellent for encapsulation. However, the child selector (`/`) should only be used when you have no control over the children, such as CMS output or Markdown. If a selector chain becomes hard to read, consider restructuring the component instead. See the [Selectors](03-selectors.md) section for details.

### Prefer Container Queries

Breakpoints in Maple are **container query first** by default. This allows you to build components that are truly responsive to their available space, regardless of the viewport size.

```html
<!-- Container query: responds to nearest .cnt ancestor -->
<section class="cnt">
  <div class="md:cols-2"></div>
</section>

<!-- Viewport query: responds to browser width -->
<div class="@md:cols-3"></div>
```

Add `cnt` to the nearest parent container you want to query. Do not put it on `html` or `body`; wrap your application or component area instead.

### Prefer Native CSS Features

Use Maple's support for native CSS capabilities before reaching for JavaScript. Scroll-state, support, media, and container queries often express state more clearly and avoid extra event listeners.

```html
<!-- ✅ Good: Pure CSS sticky state -->
<nav class="stuck=top:bshadow-lg ts-200">Navigation</nav>

<!-- ⚠️ Avoid: JavaScript-managed class for the same state -->
<nav class="^.scrolled:bshadow-lg">Navigation</nav>
```

### Leverage Color Manipulation

Instead of defining separate hex codes for hover or active states, use Maple's tone suffixes (`-600`, `-700`, etc.) to derive variants from the base color in OKLCH space. Keep tone and alpha values on a small, consistent scale such as steps of 5 or 10.

```html
<!-- Tones are calculated relative to the base color -->
<button
  class="bgc-primary-500 &:hover:bgc-primary-600 &:active:bgc-primary-700"
>
  Interactive Button
</button>
```

### Dynamic Runtime Values

Avoid generating unique classes for every possible runtime value (like a slider or mouse position). Instead, use high-frequency updates with [Dynamic Classes](utilities/09-dynamic-values.md) (`$$`) or constrain values to a known set of tokens. Do not pass unsanitized user input directly into class names.

```html
<!-- ⚠️ Risky: Unbounded CSSOM growth and unsafe input -->
<div class="w=${userInput}px"></div>

<!-- ✅ Safe: Bound to known numeric scale values -->
<div class="w-${[32, 48, 64][sizeIndex] ?? 48}"></div>

<!-- ✅ Safe: Ephemeral CSS layer with $$ prefix -->
<div
```
