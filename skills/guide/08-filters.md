## Filters

Apply visual effects to elements. Filter classes compose automatically.

### Blur

```html
<div class="blur-4"><!-- Blur with spacing value (1rem) --></div>
<div class="blur-px"><!-- 1px blur --></div>
<div class="blur-8px"><!-- 8px blur --></div>
```

### Brightness, Contrast, Saturation

```html
<div class="brightness-1.2"><!-- 120% brightness --></div>
<div class="contrast-0.8"><!-- 80% contrast --></div>
<div class="saturate-1.5"><!-- 150% saturation --></div>
```

### Grayscale, Sepia, Invert

```html
<div class="grayscale-1"><!-- Full grayscale --></div>
<div class="sepia-0.5"><!-- 50% sepia --></div>
<div class="invert-1"><!-- Full invert --></div>
```

### Hue Rotate

```html
<div class="hue-90"><!-- Rotate hue 90 degrees --></div>
<div class="-hue-45"><!-- Rotate hue -45 degrees --></div>
```

### Drop Shadow

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
