#### 8. Display Modes

You can use display mode shortcuts to target specific display contexts. These are viewport-only queries.

- `browser` for `display-mode: browser`
- `standalone` for `display-mode: standalone`
- `fullscreen` for `display-mode: fullscreen`
- `pip` for `display-mode: picture-in-picture`

```html
<div class="@standalone:p-4">
  <!-- Has padding when the app is in standalone mode (PWA) -->
</div>

<div class="@fullscreen:bgc-black">
  <!-- Background is black when the app is in fullscreen mode -->
</div>

<div class="@pip:o-80">
  <!-- Opacity is 0.8 when the app is in picture-in-picture mode -->
</div>

<div class="@browser:none @standalone:block">
  <!-- Hidden in browser but visible when installed as PWA -->
</div>
```

You can also use the explicit `display-mode=value` syntax:

```html
<div class="@display-mode=fullscreen:bgc-black">
  <!-- Background is black when the app is in fullscreen mode -->
</div>
```

