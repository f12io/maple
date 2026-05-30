## Transforms

Maple provides composable transform utilities that work together. Multiple transforms are automatically combined.

### Scale

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

### Rotate

Rotate elements with degree values (default unit is deg).

```html
<!-- Basic rotation -->
<div class="rot-45"><!-- 45deg --></div>
<div class="-rot-90"><!-- -90deg --></div>

<!-- With explicit units -->
<div class="rot-0.5turn"><!-- Half turn --></div>
<div class="rot-3.14rad"><!-- Radians --></div>
```

### Translate

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

### Skew

Skew elements with angle values.

```html
<div class="skew-10"><!-- 10deg --></div>
<div class="skew-10_20"><!-- X: 10deg, Y: 20deg --></div>
```

### Combining Transforms

Multiple transform classes combine automatically.

```html
<div class="scale-1.1 rot-5 tl-2">
  <!-- Scaled, rotated, and translated -->
</div>
```
