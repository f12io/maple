## CSS Variables

Define and use CSS variables directly in class names.

### Defining Variables

```html
<!-- Simple variable -->
<div class="--primary=blue"></div>

<!-- Complex values -->
<div class="--gradient=linear-gradient(to_right,red,blue)"></div>

<!-- Using other variables -->
<div class="--accent=var(--primary)"></div>
```

> [!IMPORTANT]
> A variable holds a raw CSS value and reaches the stylesheet as written, so Maple's shade notation does not resolve inside one: `--brand=blue-300` produces the invalid declaration `--brand: blue-300`. Keep the color in the variable and put the shade on the utility that reads it—`--brand=blue` with `bgc-brand-300`—or write the color out in full: `--brand=oklch(0.62_0.19_260)`.

### Variables as Magnitudes

The other way round also works: a variable can hold the **number** of a token, and the utility reads it with `$name`. `--tone=300` with `bgc-brand-$tone` equals `bgc-brand-300`; `--display=11` with `fs-$display` equals `fs-11`. The formula stays in the rule, so local `--spacer` and `--l-shift` overrides keep applying. See [Variable Magnitudes](utilities/10-variable-magnitudes.md).

```html
<html class="--brand=blue --tone=300 --display=11">
  <h1 class="bgc-brand-$tone fs-$display"></h1>
</html>
```

### Root-Level Variables

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

### Scoped Variables

Variables can be combined with selectors and media queries.

```html
<div class="--primary=blue @dark:--primary=lightblue">
  <div class="bgc-primary">
    <!-- Blue in light mode, lightblue in dark mode -->
  </div>
</div>
```

### State-Based Variables

```html
<div class="--bg=gray &:hover:--bg=slategray">
  <div class="bgc-bg-100 ts-200_bgc">
    <!-- Smooth hover transition -->
  </div>
</div>
```

> [!TIP]
> Unlike traditional CSS frameworks, Maple lets you define scoped CSS variables as utility classes—complete with selectors, media queries, and container queries. This enables component-level theming directly in HTML: `--accent=blue @dark:--accent=cyan md:--accent=purple`.
