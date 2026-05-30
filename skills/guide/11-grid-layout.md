## Grid Layout

Smart grid utilities for responsive layouts.

### Grid Template Columns

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

### Grid Template Rows

```html
<div class="rows-2"><!-- 2 equal rows --></div>
<div class="rows-auto_fr_auto"><!-- Header, content, footer --></div>
```

### Grid Column/Row Span

```html
<div class="col-2"><!-- Span 2 columns --></div>
<div class="row-3"><!-- Span 3 rows --></div>

<!-- Explicit start/end -->
<div class="col=1/-1"><!-- Full width --></div>
<div class="row=2/4"><!-- Row 2 to 4 --></div>
```

### Grid Areas

```html
<!-- Named areas -->
<div class="areas='header_header'_'sidebar_main'_'footer_footer'"></div>

<!-- Place in area -->
<div class="area=header"><!-- Place in header area --></div>
```

> [!TIP]
> Maple's slash syntax is context-aware: standalone slashes create fractional columns (`cols-1/2` → `1fr 2fr`), while slashes separated by underscores resolve to percentages (`cols-1/2_1/4` → `50% 25%`).
