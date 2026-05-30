## Shadows

Maple supports box shadows, text shadows, and drop shadows with color integration.

### Box Shadow

```html
<!-- Preset variable -->
<div class="bshadow-lg"><!-- Large shadow --></div>

<!-- Inline definition -->
<div class="bshadow-0px_4px_12px_black/15">
  <!-- 0 4px 12px with 15% black -->
</div>

<!-- Inset shadow -->
<div class="bshadow-0px_2px_4px_inset_gray">
  <!-- Inner shadow -->
</div>

<!-- Multiple shadows -->
<div class="bshadow-sm_primary/10,lg_primary/5">
  <!-- Layered shadows -->
</div>
```

### Text Shadow

```html
<div class="tshadow-0px_2px_4px_black/30">
  <!-- Text shadow with blur -->
</div>
```

> [!TIP]
> Define shadow variables like `--shadow-sm=0_2px_4px` or `--bshadow-lg=0_8px_24px` containing only position and blur. Then use classes like `bshadow-sm_primary/10` to apply different colors per element, creating consistent shadow shapes with varying brand colors.
