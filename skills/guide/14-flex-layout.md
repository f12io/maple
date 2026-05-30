## Flex Layout

Maple provides compact flex layout shortcuts using 2-letter position codes.

### Position Codes

| Letter | Value         |
| ------ | ------------- |
| `s`    | flex-start    |
| `c`    | center        |
| `e`    | flex-end      |
| `h`    | stretch       |
| `w`    | space-between |

### Container Shortcuts

| Shortcut      | Description        | Example                      |
| ------------- | ------------------ | ---------------------------- |
| `fxrow-{vh}`  | flex row           | `fxrow-cc` (center-center)   |
| `fxcol-{vh}`  | flex column        | `fxcol-ss` (start-start)     |
| `ifxrow-{vh}` | inline-flex row    | `ifxrow-cw` (center-between) |
| `ifxcol-{vh}` | inline-flex column | `ifxcol-ee` (end-end)        |

### Self Shortcuts

| Shortcut         | Description             | Example        |
| ---------------- | ----------------------- | -------------- |
| `fxrowself-{vh}` | self position in row    | `fxrowself-cc` |
| `fxcolself-{vh}` | self position in column | `fxcolself-ss` |

### Examples

```html
<!-- Centered content -->
<div class="fxrow-cc">Horizontally and vertically centered</div>

<!-- Header with logo left, nav right -->
<header class="fxrow-cw">
  <div>Logo</div>
  <nav>Links</nav>
</header>

<!-- Vertical stack, items at top-left -->
<div class="fxcol-ss g-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive layout -->
<div class="fxcol-ss md:fxrow-cw">
  <div>Stacked on mobile, row on tablet</div>
</div>

<!-- Self-positioning within flex parent -->
<div class="fxrow-ss">
  <div>Top-left</div>
  <div class="fxrowself-ee">Bottom-right override</div>
</div>
```
