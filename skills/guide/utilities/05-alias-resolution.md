#### 5. Alias Resolution

Aliases expand to one or more Maple utility classes before normal parsing and merge conflict checks run.

Maple includes built-in aliases for common utilities. They can be used directly, or with `@`:

```html
<!--Both examples apply `display: flex` -->
<div class="fx"></div>
<div class="@fx"></div>
```

You can define custom aliases on the root `<html>` element using `--alias-{name}=...`. Custom aliases must be used with `@`.

```html
<html class="--alias-truncate=of=hidden;tof=ellipsis;ws=nowrap">
  <span class="@truncate w-40"> Long text that should truncate </span>
</html>
```

Use `;` to separate multiple classes inside an alias.

```html
<html class="--alias-focus-ring=olw-2px;olst=solid;olc=currentColor;oloff-2">
  <button class="@focus-ring">Focusable control</button>
</html>
```

Alias definitions are collected only from `<html>` and definitions on other elements are ignored. If the same custom alias is defined more than once on `<html>`, the later definition wins.

Aliases are not reactive. If you change an alias definition on `<html>` after elements using that alias have already been processed, Maple does not automatically revisit those existing alias usages. Treat aliases as root-level configuration for reusable utility shortcuts. For live changes, use CSS variables instead.

> [!TIP]
> Aliases work best when they follow utility-first logic: multiple declarations doing one clear job, like `antialiased` or `truncate`. Avoid using aliases as component-sized CSS classes for buttons, cards, or panels; extract those patterns into components or templates instead.

Alias definitions must be plain root classes. If you combine `--alias-*` with a media query or selector, Maple treats it like a normal CSS custom property utility:

```html
<!-- Invalid alias usage. They will resolve to "--alias-focus-ring" css variable. -->
<div class="md:--alias-focus-ring=olw-2px"></div>
<div class="&:hover:--alias-focus-ring=olw-2px"></div>
```

However, the classes inside an alias definition may include their own media queries and selectors. When you use the alias with an additional media query or selector, Maple composes the usage context with each expanded alias member:

```html
<html
  class="--alias-focus-ring=@supports=[outline:1px_solid_currentColor]:&:focus-visible:olw-2px;&:focus-visible:olst=solid;&:focus-visible:olc=currentColor"
>
  <button class="@focus-ring"></button>
  <button class="@md:@focus-ring"></button>
  <button class="&:not(:disabled):@focus-ring"></button>
</html>
```

In this example, `@md:@focus-ring` applies the whole alias at the `md` viewport breakpoint while preserving the alias member's own `@supports` and `&:focus-visible` contexts. `&:not(:disabled):@focus-ring` also composes safely with the alias focus selector.

User-defined aliases do not hijack normal utility names. If you define `--alias-fx=d-grid`, then `@fx` uses your alias, while bare `fx` still uses Maple's built-in flex alias.

Alias usage works with media queries and selectors:

```html
<html class="--alias-focus-ring=olw-2px;olst=solid;olc=currentColor">
  <button class="md:@focus-ring"></button>
  <button class="@md:@focus-ring"></button>
  <button class="&:focus-visible:@focus-ring"></button>
</html>
```

The `@` before a media query belongs to Maple's media-query syntax. The `@` before an alias name belongs to alias usage. For example, `@md:@focus-ring` means "apply the `@focus-ring` alias at the viewport `md` breakpoint."

Because aliases expand before merge checks, later classes override earlier alias members as expected:

```html
<html class="--alias-focus-ring=olw-2px;olst=solid;olc=currentColor">
  <button class="@focus-ring olw-4px"></button>
  <!-- before merge: olw-2px olst=solid olc=currentColor olw-4px -->
  <!-- after merge: @focus-ring olw-4px -->
</html>
```

Maple keeps the alias class when at least one expanded utility inside the alias still applies. In this example, `olw-4px` overrides the alias's `olw-2px`, but the alias is kept because its outline style and color utilities still apply.

Alias-generated selectors are intentionally low-specificity. This lets a direct utility on the same element override an individual alias member even if the alias rule is generated later. For example, `fxrow-cc jc=space-between` keeps both classes, but `jc=space-between` wins for `justify-content`.

Built-in aliases include:

| Alias         | Expands To                                                        |
| ------------- | ----------------------------------------------------------------- |
| `abs`         | `pos=absolute`                                                    |
| `fixed`       | `pos=fixed`                                                       |
| `rel`         | `pos=relative`                                                    |
| `sticky`      | `pos=sticky`                                                      |
| `static`      | `pos=static`                                                      |
| `iblock`      | `d=inline-block`                                                  |
| `ifx`         | `d=inline-flex`                                                   |
| `fx`          | `d=flex`                                                          |
| `gr`          | `d=grid`                                                          |
| `block`       | `d=block`                                                         |
| `none`        | `d=none`                                                          |
| `table`       | `d=table`                                                         |
| `inline`      | `d=inline`                                                        |
| `hidden`      | `v=hidden`                                                        |
| `visible`     | `v=visible`                                                       |
| `br`          | `brw-px;brst=solid`                                               |
| `brt`         | `brtw-px;brtst=solid`                                             |
| `brr`         | `brrw-px;brrst=solid`                                             |
| `brb`         | `brbw-px;brbst=solid`                                             |
| `brl`         | `brlw-px;brlst=solid`                                             |
| `brx`         | `borderInlineWidth-px;borderInlineStyle=solid`                    |
| `brxs`        | `borderInlineStartWidth-px;borderInlineStartStyle=solid`          |
| `brxe`        | `borderInlineEndWidth-px;borderInlineEndStyle=solid`              |
| `bry`         | `borderBlockWidth-px;borderBlockStyle=solid`                      |
| `brys`        | `borderBlockStartWidth-px;borderBlockStartStyle=solid`            |
| `brye`        | `borderBlockEndWidth-px;borderBlockEndStyle=solid`                |
| `cnt`         | `cnt=inline-size`                                                 |
| `antialiased` | `-webkitFontSmoothing=antialiased;-mozOsxFontSmoothing=grayscale` |
| `truncate`    | `of=hidden;tof=ellipsis;ws=nowrap`                                |

> [!NOTE]
> Animation aliases (like `fade-in`) and flex layout aliases (like `fxrow-cc`) are documented in their respective files: [Animations](../13-animations.md) and [Flex Layout](../14-flex-layout.md).

> [!TIP]
> Adding `antialiased` to the `<body>` element is a good practice for sharper, more consistent font rendering across browsers.
