#### 10. Variable Magnitudes (`$name`) and Sums (`a+b`)

Two small additions to the number and color grammar let a theme hold plain numbers on `<html>` while the engine keeps its formulas in the rule:

- `$name` puts a CSS variable in the **magnitude slot** of a formula — the tone of a color, the alpha, the factor of a spacing number.
- `a+b` sums two number tokens in one value, each resolved by its own rule.

```html
<html class="--tone-stroke=900 --stroke=0.5 --stroke-px=0px --display=11">
  <button class="brc-body-$tone-stroke brw-$stroke+stroke-px fs-$display">
    <!-- reads its tone, weight and size from the theme -->
  </button>
</html>
```

##### A plain token holds a value; `$name` holds a magnitude

Maple's plain tokens are already variable-first: `brw-a` resolves to `var(--brw-a, var(--space-a, var(--a, a)))`, and the variable holds the **final CSS value** (`2px`). That is enough for keyword and length properties, and nothing changes there.

`$name` is for the three places where the number has to sit **inside** a formula rather than replace the whole value: a tone position, an alpha percentage, a factor on the spacer chain. The variable holds the number an author would write in a class (`--display=11`, as in `fs-11`), and the engine emits the formula around it in the rule:

```
brw-a    →  border-width: var(--brw-a, var(--space-a, var(--a, a)))
brw-$a   →  border-width: calc(var(--a) * 1rem * var(--brw-spacer, var(--br-spacer, var(--spacer, 0.25))))
```

This matters because a custom property resolves its own `var()` references on the element that declares it. A variable on `<html>` holding `calc(0.5rem * var(--spacer))` or an `oklch(from …)` formula is **fixed at the root**: it does not see a local `--spacer` (`@size-*` aliases) nor a local `--l-shift` (a dark band). With `$name` the formula is generated where the class is applied, so those local overrides keep working.

```html
<!-- ⚠️ Fixed at the root: --card-radius ignores the local --spacer -->
<html class="--card-radius=calc(2rem*var(--spacer))">
  <div class="--spacer=0.5 rad-card-radius"></div>
</html>

<!-- ✅ Resolves on the element: rad-$card scales with the local --spacer -->
<html class="--card=2">
  <div class="--spacer=0.5 rad-$card"></div>
</html>
```

`name` is `[a-z][a-z0-9]*(-[a-z0-9]+)*` — segments joined by single hyphens — and ends at `/`, `_`, `+`, `,` or the end of the token. The `$` sits **after** the property, so it does not collide with the class-level prefixes (`$p-4` skips the refs cache, `$$p-4` marks a dynamic class); they combine: `$fs-$display`.

`$` is a token **only** in those three slots. Anywhere else (`pos-$mode`, `d-$x`, `z-$layer`, `o-$fade`, or the color name in `c-$x`) it is not a token and the class falls through to the literal path like any invalid value. Use the plain token there: `pos-mode` with `--mode=absolute`, `z-layer` with `--layer=3`.

##### A. Variable tone and alpha on a color token

```html
<div class="c-body-$tone-stroke"></div>
<div class="brc-red-$t"></div>
<div class="bgc-body-$tone-elev/$alpha-elev"></div>
<div class="bgc-red-700/$a"></div>
```

The tone variable holds the **tone number** (`--tone-stroke=900`); the alpha variable holds the **percentage** (`--alpha-elev=60`). The engine emits the same OKLCH formula as for `c-body-900`, with the tone position computed from the variable:

```css
/* literal: the position is rounded and written into the formula */
.c-body-900 {
  color: oklch(
    from var(--c-body, …) calc((l + ((… * (0.5 - 0.9444)) + …) * …)) … / alpha
  );
}

/* variable: the position stays in the rule, unrounded */
.c-body-\$t {
  color: oklch(
    from var(--c-body, …)
      calc((l + ((… * (0.5 - ((var(--t, 500) - 50) / 900))) + …) * …)) … / alpha
  );
}

.bgc-red-700\/\$a {
  background-color: oklch(from var(--bgc-red, …) … / calc(var(--a, 100) * 1%));
}
```

- Fallbacks: an undefined tone variable falls back to `500` (the base color); an undefined alpha variable falls back to `100`.
- The property-prefixed override chains stay exactly as for literals (`--c-body-l-shift`, `--body-l-shift`, `--c-l-shift`, `--l-shift`, and the scale and rotate chains), so `--bgc-l-shift=1` on a block and `--l-shift=-0.7` on a band keep working.
- `/$a` always writes the alpha (`--a=100` → `100%`), whereas a literal `/100` keeps the base color's own alpha.

##### B. Variable factor on a number token

```html
<div class="fs-$display lh-$display ls-$display"></div>
<div class="rad-$card brw-$stroke p-$inset g-$gap"></div>
<div class="p-$x_$y"></div>
```

```css
.fs-\$display {
  font-size: calc(
    var(--display) * 1rem *
      var(--fs-spacer, var(--f-spacer, var(--spacer, 0.25)))
  );
}
```

- The two leading fallbacks of the literal form (`--fs-11`, `--space-11`) do not apply; the value is always the chain.
- The category chain is the existing one per property: `fs`/`lh`/`ls` → `f`, radius and border widths → `br`, shadows → `shadow`, sizes → `size`, plain spacing → none.
- A negative factor is allowed in the variable (`--ls-tight=-0.25`), and the `-` prefix form (`-ls-$tight`) multiplies by `-1` as it does for literals.
- Properties with another unit use that unit: `tsdur-$d` → `calc(var(--d) * 1ms)`, `rot-$r` → `rotate(calc(var(--r) * 1deg))`; unitless transforms take the bare variable: `scale-$k` → `scale(var(--k))`.
- There is **no fallback** on purpose. An undefined variable makes the declaration invalid at computed-value time, which behaves as `unset` (inherited properties inherit, others take their initial value). A `0` fallback would collapse a font size or a padding.

##### C. Sums: `a+b` in a number slot

`+` joins two or more number tokens into one value, `calc(a + b)`. **Each side is resolved exactly as it would be on its own** — a literal, a plain token, or a `$` magnitude — and it is valid only in a number slot.

| side        | resolves as              | example                                                                                   |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| literal     | the literal rules        | `2` → scaled, `px` → `1px`, `100vh`                                                       |
| plain token | the variable chain       | `stroke-px` → `var(--brw-stroke-px, var(--space-stroke-px, var(--stroke-px, stroke-px)))` |
| `$name`     | a magnitude on the scale | `$stroke` → `var(--stroke) * 1rem * <chain>`                                              |

The canonical case is **magnitude + value**: a border that is `0.5` on the scale in one theme and a `1px` hairline in another, with one shared alias.

```html
<html class="--stroke=0.5 --stroke-px=0px">
  …
</html>
<html class="--stroke=0 --stroke-px=1px">
  …
</html>

<div class="brw-$stroke+stroke-px"></div>
```

```css
.brw-\$stroke\+stroke-px {
  border-width: calc(
    var(--stroke) * 1rem *
      var(--brw-spacer, var(--br-spacer, var(--spacer, 0.25))) +
      var(--brw-stroke-px, var(--space-stroke-px, var(--stroke-px, stroke-px)))
  );
}
```

The `$` sits only on the side that is a scale number. `stroke-px` is an ordinary token: it gets the usual chain, so `--brw-stroke-px` can override it for borders only, and the `px` in its name is just part of the identifier — `px` means `1px` only when it is the whole token.

Other sums follow from the same sentence, none with its own rule:

```html
<div class="brw-$a+px"><!-- scaled stroke plus a fixed 1px hairline --></div>
<div class="brw-2+px">
  <!-- 2 on the scale plus 1px, no variables at all -->
</div>
<div class="h-100vh+-4">
  <!-- calc(100vh + -1rem): subtract with a negative value -->
</div>
<div class="p-$x+px_4"><!-- _ splits value items before + --></div>
<div class="bshadow-$x+px_0_body-$t"><!-- sums in shadow slots --></div>
```

- `-` stays a sign, never an operator: subtract with a negative value (`+-4`), as with `m--4`.
- Every side must be defined. An undefined `$stroke` or an undefined `stroke-px` makes the whole `calc()` invalid, and the property takes its initial value (`medium` for a border width). Themes define their fields; there are no hidden defaults.
- A length token must carry a unit. `--stroke-px=0` (unitless) makes the sum invalid; write `0px`.
- `$a+$b` is legal and means two scaled magnitudes summed. If you meant "scale plus fixed", put `$` on the scale number only.

##### D. Shadows

The shadow serializer accepts the same forms in its slots:

```html
<div
  class="bshadow-$elev-x_$elev-y_$elev-blur_0_body-$tone-elev/$alpha-elev"
></div>
```

Each numeric slot becomes the `bshadow` spacer chain with the variable as factor; the color slot follows form A with the `bshadow` prefix and the `--shadow-<color>` fallback the serializer already inserts. `$` factors and sums also work in the border shorthand (`br-$w+w-px_solid_red-$t`), filters (`blur-$b`), transforms (`tlx-$x`) and gradient stops (`bg-linear|to_right|red-$t|blue-$t_$p`).

##### Undefined variables

| Slot               | Undefined variable                                                              |
| ------------------ | ------------------------------------------------------------------------------- |
| Tone (`c-body-$t`) | Falls back to `500`, the base color.                                            |
| Alpha (`/$a`)      | Falls back to `100`.                                                            |
| Factor (`fs-$s`)   | No fallback: the declaration behaves as `unset`.                                |
| Any side of a sum  | No fallback: the whole sum is invalid and the property takes its initial value. |

##### Aliases

Alias bodies may use `$` tokens and sums, and alias params expand before the token is parsed:

```html
<html
  class="--alias-stroke=brw-$stroke+stroke-px;brc-body-$tone-stroke --alias-tone-of=brc-{color,body}-$tone-{role}"
>
  <div class="@stroke"></div>
  <div class="@tone-of(color:red,role:hover)"><!-- brc-red-$tone-hover --></div>
</html>
```

##### Engine notes

- The merge and conflict key is unchanged: a `$` token or a sum conflicts with the same property as a literal.
- In `refs` mode a `$` token or a sum always generates the full chain in the rule; they depend on element scope, so they never go through the `--ref-*` cache.
- `parseClass` keeps `$name` in `utilVal` and exposes the referenced names as `vars` (e.g. `vars: ['tone-stroke']`) so a validator can check they are declared.
- `+` is the only operator. `bgc-red-$t+$a` (a color slot) and `pos-a+b` (a keyword slot) are not tokens and fall through to the literal path; so does `brw-$a-$b`, where `-` is neither a sign nor a separator.
- A variable holds a raw CSS value, so a color token inside a variable still does not resolve: write `--tone-stroke=900` with `brc-body-$tone-stroke`, not `--stroke-color=body-900`.
