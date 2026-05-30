## Borders

Maple provides flexible border utilities with shorthand and directional control.

### Border Shorthand

```html
<!-- Simple border with browser's default color -->
<div class="br">
  <!-- 1px solid border -->
</div>

<!--  Border with custom color -->
<div class="br brc-primary">
  <!-- 1px solid border with primary color -->
</div>

<div class="br brc-silver">
  <!-- 1px solid border with silver color -->
</div>

<!-- Border with width -->
<div class="br-2px_solid">
  <!-- 2px solid border -->
</div>

<!-- Full custom border -->
<div class="br=1px_solid_black">
  <!-- 1px solid black -->
</div>
```

### Border Width, Style, and Color

```html
<div class="brw-2px"><!-- border-width: 2px --></div>
<div class="brst-dashed"><!-- border-style: dashed --></div>
<div class="brc-gray-300"><!-- border-color with shade --></div>
<div class="brc-red/50"><!-- 50% opacity red border --></div>
```

### Directional Borders

```html
<div class="brt-px"><!-- border-top: 1px --></div>
<div class="brb-2px_solid_gray"><!-- border-bottom --></div>
<div class="brl-px brr-px"><!-- left and right borders --></div>
```

### Border Radius

```html
<div class="rad-4"><!-- spacing-based radius (1rem) --></div>
<div class="rad-lg"><!-- variable-based radius --></div>
<div class="rad-%"><!-- 100% (circle) --></div>
```

> [!TIP]
> Compose borders by combining structure and color: `br brc-primary` for full border, `brt brc-gray-200` for top-only. This separation lets you reuse color classes across different border directions without repeating width and style.
