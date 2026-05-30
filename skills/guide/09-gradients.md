## Gradients

Maple uses a distinctive pipe syntax `|` for gradient color stops.

### Linear Gradients

```html
<!-- Two colors -->
<div class="bgimg-linear|red|blue"><!-- Red to blue --></div>

<!-- With direction -->
<div class="bgimg-linear|to_right|red|blue">
  <!-- Horizontal gradient -->
</div>

<!-- With color stops -->
<div class="bgimg-linear|to_bottom|primary_0|transparent_%">
  <!-- primary at 0%, transparent at 100% -->
</div>

<!-- With transparency -->
<div class="bgimg-linear|to_right|primary/50|secondary/80">
  <!-- 50% and 80% alpha -->
</div>

<!-- Repeating linear -->
<div class="bgimg-rlinear|45deg|red_0|blue_10%">
  <!-- Repeating stripe pattern -->
</div>
```

### Radial Gradients

```html
<!-- Basic radial -->
<div class="bgimg-radial|red|blue"><!-- Center to edge --></div>

<!-- With shape -->
<div class="bgimg-radial|circle|red|transparent"><!-- Circular --></div>

<!-- With position -->
<div class="bgimg-radial|circle_at_top|white|transparent">
  <!-- From top center -->
</div>

<!-- Repeating radial -->
<div class="bgimg-rradial|circle|red_0|blue_10%">
  <!-- Repeating circular pattern -->
</div>
```

### Conic Gradients

```html
<div class="bgimg-conic|red|yellow|green|blue|red">
  <!-- Rainbow wheel -->
</div>

<div class="bgimg-conic|from_45deg|primary|secondary">
  <!-- Starting at 45 degrees -->
</div>

<!-- Repeating conic -->
<div class="bgimg-rconic|red_0|blue_10deg">
  <!-- Repeating pie slices -->
</div>
```

### Multiple Gradients

Combine gradients with commas.

```html
<div
  class="bgimg-linear|to_top|transparent|black/50,radial|circle|white/20|transparent"
>
  <!-- Overlay effect -->
</div>
```

### Complex Gradients

Create intricate patterns by combining color stops with position and repeat settings.

```html
<!-- Checkerboard pattern -->
<div
  class="bg-conic|#fff_0.25turn|#000_0.25turn_0.5turn|#fff_0.5turn_0.75turn|#000_0.75turn__top_left/25%_25%_repeat"
>
  <!-- Conic gradient with position, size, and repeat -->
</div>
```

### Background Images with URL

```html
<!-- Absolute URL, because the url contains colon, we need to wrap it with brackets -->
<div class="bgimg-url|[https://example.com/image.jpg]"></div>

<!-- Relative path -->
<div class="bgimg-url|/images/hero.jpg"></div>

<!-- With position and repeat -->
<div class="bg-url|/images/pattern.png__center/cover_no-repeat"></div>
```

> [!TIP]
> The double underscore `__` separates the gradient/image from background shorthand properties. The format is `image__position/size_repeat`. Use `_` for spaces within values (e.g., `center/cover_no-repeat` becomes `center/cover no-repeat`).
