## Best Practices

These practices align with Maple's philosophy of speed, encapsulation, and variable-first design. Following them ensures your codebase remains maintainable and performant.

### Prefer Semantic Tokens

Maple's architecture shines when you use tokens that express intent rather than hard-coded values. This keeps your design themeable, easier to audit, and consistent across components.

```html
<!-- ✅ Good: Semantic tokens, themeable -->
<div class="bgc-primary-200 c-primary-700 p-4 rad-lg"></div>

<!-- ⚠️ Avoid: Arbitrary values, not themeable -->
<div class="bgc=#3b82f6 c=white p=16px rad=8px"></div>
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

### Dynamic Runtime Values

Avoid generating unique classes for every possible runtime value (like a slider or mouse position). Instead, use high-frequency updates with [Dynamic Classes](utilities/09-dynamic-values.md) (`$$`) or constrain values to a known set of tokens. Do not pass unsanitized user input directly into class names.

```html
<!-- ⚠️ Risky: Unbounded CSSOM growth and unsafe input -->
<div class="w=${userInput}px"></div>

<!-- ✅ Safe: Bound to known numeric scale values -->
<div class="w-${[32, 48, 64][sizeIndex] ?? 48}"></div>

<!-- ✅ Safe: Ephemeral CSS layer with $$ prefix -->
<div class="$$tl-x=${scrollPos}px"></div>
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

### Set Static Values Directly

By default, Maple utilities generate CSS variables so you can easily override them later. However, some CSS properties are purely structural and never need to be themed—for example, `overflow: hidden`.

Generating variable chains for these static values is a waste of performance. You can skip this by using the equal sign (`=`) or bracket (`[]`) syntax. Writing `of=hidden` instead of `of-hidden` outputs the value directly, resulting in cleaner and faster CSS.

```html
<!-- ✅ Static structural values don't need theming -->
<div class="of=hidden fw=500"></div>

<!-- ⚠️ Generates unnecessary fallback chains for static keywords -->
<div class="of-hidden fw-500"></div>
```

### Use Reference Mode Deliberately

The `refs` option can reduce generated CSS and speed up large pages by caching fallback chains in global reference variables. Use it for broad design-system pages, but avoid it for component libraries that depend heavily on local variable overrides. See [Reference Mode](18-configuration.md) for details.

```html
<!-- refs caches repeated fallback chains globally -->
<script src="maple.js?refs"></script>

<!-- Use $ when a local override must bypass the reference cache -->
<div class="$p-4 --p-4=2rem"></div>
```
