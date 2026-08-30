## Configuration

Maple accepts configuration via script query string parameters.

### Script Query String

```html
<script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js?refs&nomerge&md=680px&4xl=1920px"></script>
```

| Parameter              | Description                                   |
| ---------------------- | --------------------------------------------- |
| `refs`                 | Enable reference mode for better performance  |
| `nomerge`              | Disable merging of utility classes            |
| `nohybrid`             | Disable the hybrid dark mode generation.      |
| `important`            | Mark every generated declaration `!important` |
| `debug`                | Enable console warnings for silent failures   |
| `{breakpoint}={value}` | Override or add custom breakpoints            |

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

By default, Maple resolves conflicts between utility classes at runtime. If an element has multiple classes targeting the same generated property in the same context, Maple determines the winner from the class order, removes overridden classes from the element, and inserts only the surviving rules. See [Automatic Conflict Resolution](17-conflict-resolution.md) for the full model.

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

### Global Important Mode (`important`)

Maple generates its rules inside CSS cascade layers, and unlayered CSS always beats layered CSS. On a page with an existing unlayered stylesheet (a WordPress theme, a legacy CSS file), Maple utilities silently lose for any property that stylesheet already sets. The per-utility `!` prefix fixes this case by case, but prefixing every class is impractical when retrofitting Maple onto an existing site.

Add `important` to the script query string to mark every generated declaration `!important` globally:

```html
<script src="maple.js?important"></script>
```

The per-utility `!` prefix continues to work and produces the same output; you only stop needing it.

**When to use `important`:**

- Retrofitting Maple onto a site with existing unlayered CSS that you can't move into layers.

**When to avoid it:**

- Greenfield projects, or sites where all CSS lives in layers — the cascade already resolves correctly, and blanket `!important` makes any later per-element override harder.

### Debug Mode (`debug`)

By default, Maple stays silent when a class produces no styles — an invalid utility, a dropped merge conflict, or an ignored alias simply does nothing. Add `debug` to the script query string to surface these cases as `[maple]`-prefixed console warnings:

```html
<script src="maple.js?debug"></script>
```

**What debug mode reports:**

1. **Startup configuration**: The resolved options object is logged once at boot, including breakpoints — a mistyped flag (e.g. `?nomrege`) is treated as a breakpoint and becomes immediately visible here.
2. **Skipped classes**: A class that shows Maple intent but produces no rule is reported with the reason (unknown utility, no style declaration). Intent means the class resolved to a known utility key (e.g. the typo `bgc-`), or carries Maple syntax markers (contains `:` or `=`, or starts with `!` or `$`). Plain CSS classes like `btn-primary` stay silent.
3. **Merge rewrites**: When conflict resolution changes an element's class attribute, the full rewrite is logged — e.g. `merged: "pt-2 p-8" -> "p-8"`.
4. **Alias problems**: Unknown alias usage, invalid alias params, expansion depth limit hits (circular definitions), and alias definitions that arrive after the lock — a new or changed `--alias-*` definition on `<html>` after the initial markup is processed is ignored, and debug mode is the only signal.
5. **Cache evictions**: Internal parse caches evict their oldest entries when full; repeated eviction warnings suggest unbounded dynamic class generation.

Warnings raised while an element's classes are being processed — skipped classes, merge rewrites, alias problems — include the element as a second console argument, so you can click it in DevTools to locate the node.

**When to use `debug`:**

- During development, or when diagnosing "why isn't this class applying?" on any page.

**When to avoid it:**

- Production — the checks are skipped entirely when the flag is off, so leaving it out keeps the hot path free of debug work.

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
