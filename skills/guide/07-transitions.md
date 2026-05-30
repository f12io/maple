## Transitions

Maple provides flexible transition utilities with property, duration, delay, and timing function components.

### Simple Transitions

```html
<!-- Duration only (ms) -->
<div class="ts-300"><!-- 300ms transition --></div>

<!-- Duration and delay -->
<div class="ts-300_100"><!-- 300ms duration, 100ms delay --></div>

<!-- Duration and property -->
<div class="ts-300_bgc"><!-- 300ms on background-color --></div>

<!-- Full transition -->
<div class="ts-300_100_bgc_ease">
  <!-- 300ms duration, 100ms delay, background-color, ease timing -->
</div>
```

### Multiple Transitions

Use commas to define multiple transitions.

```html
<div class="ts-300_bgc_ease,200_c">
  <!-- background-color: 300ms ease, color: 200ms -->
</div>
```

### Individual Properties

```html
<div class="tsdur-300"><!-- transition-duration: 300ms --></div>
<div class="tsdel-100"><!-- transition-delay: 100ms --></div>
<div class="tsprop-bgc"><!-- transition-property: background-color --></div>
<div class="tstf-ease"><!-- transition-timing-function: ease --></div>
```

### Will-Change

Optimize performance by hinting which properties will change.

```html
<div class="wc-bgc"><!-- will-change: background-color --></div>
<div class="wc-bgc,c,tl"><!-- Multiple properties --></div>
```
