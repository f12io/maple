#### 9. Dynamic Values

For values that change frequently (like scroll position, mouse coordinates, or sliders), generating unique persistent classes for every value can grow the CSSOM and hurt performance. Maple provides **Dynamic Classes** for these cases.

Prefix any class with `$$` to mark it as dynamic. Dynamic classes:

- Are written to a special ephemeral CSS layer.
- Do not pollute the main stylesheet.
- Are cleared and replaced on the next flush, which runs in a microtask — not on an animation frame, so a hidden tab does not stall it.

This is useful for integrating JS-driven values with Maple's utility system without adding a permanent rule for every intermediate value.

```javascript
/* Example: using a slider to update CSS variables dynamically */
const slider = document.getElementById('slider');
const preview = document.getElementById('preview');

// Input event: Frequent updates use $$ (Dynamic)
slider.addEventListener('input', (e) => {
  const val = e.target.value;

  // These classes are transient and cleared on the next flush (a microtask)
  preview.classList.add(`$$--p-spacer=${val}`, `$$--g-spacer=${val}`);
});

// Change event: Final value uses standard class (Persistent)
slider.addEventListener('change', (e) => {
  const val = e.target.value;

  // These are standard static classes
  preview.classList.add(`--p-spacer=${val}`, `--g-spacer=${val}`);
});
```
