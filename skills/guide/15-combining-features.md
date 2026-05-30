## Combining Features

Maple's power comes from combining utilities for complex effects.

### Responsive Card with Hover

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

### Glassmorphism Panel

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

### Animated Button

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

### Hero Section with Gradient Overlay

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

### Responsive Navigation

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
