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
<div class="--bg=gray-100 &:hover:--bg=gray-200">
  <div class="bgc-bg ts-200_bgc">
    <!-- Smooth hover transition -->
  </div>
</div>
```

> [!TIP]
> Unlike traditional CSS frameworks, Maple lets you define scoped CSS variables as utility classes—complete with selectors, media queries, and container queries. This enables component-level theming directly in HTML: `--accent=blue @dark:--accent=cyan md:--accent=purple`.
