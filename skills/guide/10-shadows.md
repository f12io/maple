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

### Variable Slots

Every slot accepts a `$name` token, so a theme can hold the offsets, the blur, the tone and the alpha as plain numbers on `<html>` while each slot keeps its spacer chain or tone formula in the rule:

```html
<html
  class="--elev-x=0 --elev-y=1 --elev-blur=3 --tone-elev=950 --alpha-elev=15"
>
  <div
    class="bshadow-$elev-x_$elev-y_$elev-blur_0_body-$tone-elev/$alpha-elev"
  ></div>
</html>
```

See [Variable Magnitudes](utilities/10-variable-magnitudes.md).
