## Configuration

Maple accepts configuration via script query string parameters.

### Script Query String

```html
<script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js?refs&nomerge&md=680px&4xl=1920px"></script>
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
