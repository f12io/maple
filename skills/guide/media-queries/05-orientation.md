#### 5. Orientation

You can use `landscape` and `portrait` keys to target the orientation of the viewport or container.

```html
<div class="landscape:bgc-red">
  <!-- Background is red when in a container which orientation is landscape -->
</div>

<div class="landscape(sidebar):bgc-red">
  <!-- Background is red when in a container called sidebar which orientation is landscape -->
</div>

<div class="portrait:bgc-red">
  <!-- Background is red when in a container which orientation is portrait -->
</div>

<div class="portrait(sidebar):bgc-red">
  <!-- Background is red when in a container called sidebar which orientation is portrait -->
</div>

<div class="@landscape:bgc-red">
  <!-- Background is red when the viewport orientation is landscape -->
</div>

<div class="@portrait:bgc-red">
  <!-- Background is red when the viewport orientation is portrait" -->
</div>
```

