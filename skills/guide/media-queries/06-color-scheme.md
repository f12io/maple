#### 6. Color Scheme

You can use `@dark` and `@light` keys to target the user's preferred color scheme. Maple employs a unique **"Hybrid" Dark Mode Architecture** that automatically supports both system preferences and manual toggles without writing extra CSS.

```html
<div class="@dark:bgc-black @dark:c-white">
  <!-- Background is black and text is white in dark mode -->
</div>

<div class="@light:bgc-white @light:c-black">
  <!-- Background is white and text is black in light mode -->
</div>

<div class="@not-dark:bgc-white">
  <!-- Background is white when user does not prefer dark mode -->
</div>
```

**How it works:**

When you use `@dark:`, Maple generates two CSS rules:

1.  **System Preference Rule**: Targets `@media (prefers-color-scheme: dark)`. It includes a guard `:root:not(.light)` to allow manual overriding.
2.  **Manual Override Rule**: Targets `.dark` class on the `:root` element.

This means you can rely on the user's system preference by default. If you need to force a mode, simply add the `dark` or `light` class to the `<html>` element.

- **System Mode** (Default): No class on `<html>`. Follows OS setting.
- **Force Dark**: `<html class="dark">`. Ignores system preference.
- **Force Light**: `<html class="light">`. Ignores system preference.

> [!TIP]
> You can disable this hybrid behavior by adding `nohybrid` to the script query string. In that case, `@dark` will only generate `@media (prefers-color-scheme: dark)` rule.

