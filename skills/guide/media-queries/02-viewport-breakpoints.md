#### 2. Viewport Breakpoints

The same predefined breakpoints used for container queries are also available for viewport media queries. To target the viewport you need to add `@` prefix to breakpoint.

```html
<div class="@md:bgc-red">
  <!-- Background is red when the viewport width is equal or greater than 768px -->
</div>

<div class="@lg:bgc-blue">
  <!-- Background is blue when the viewport width is equal or greater than 1024px -->
</div>
```

