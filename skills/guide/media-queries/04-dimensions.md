#### 4. Dimensions

You can write specific width or height constraints with following keys:

- `mnw` for `min-width`
- `mxw` for `max-width`
- `mnh` for `min-height`
- `mxh` for `max-height`

```html
<div class="mnw=300px:bgc-red">
  <!-- Background is red when in a container which width is equal or greater than 300px -->
</div>

<div class="@mxh=800px:bgc-red">
  <!-- Background is red when the viewport height is less than 800px -->
</div>

<div class="mnw!=500px:bgc-red">
  <!-- Background is red when in a container which width is less than 500px -->
</div>

<div class="not-mnw=500px:bgc-red">
  <!-- Background is red when in a container which width is less than 500px -->
</div>
```

> [!TIP]
> When using `mxw` or `mxh` with a predefined breakpoint (e.g., `mxw-md`), Maple generates a `not (min-width: ...)` query, effectively targeting the range below that breakpoint.

```html
<div class="mxw-md:bgc-red">
  <!-- Background is red when in a container which width is less than 768px -->
</div>

<div class="@mxw-md:bgc-red">
  <!-- Background is red when the viewport width is less than 768px -->
</div>
```

