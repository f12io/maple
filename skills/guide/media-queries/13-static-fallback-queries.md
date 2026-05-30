#### 13. Static Fallback Queries

Any unrecognized media query falls back to a static media query. This is useful for targeting specific media types.

```html
<div class="@print:none">
  <!-- Hidden when printing -->
</div>

<div class="@not-print:block">
  <!-- Visible when NOT printing -->
</div>

<div class="@screen:block">
  <!-- Visible on screen -->
</div>
```

