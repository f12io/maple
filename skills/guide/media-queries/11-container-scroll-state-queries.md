#### 11. Container Scroll-State Queries

You can query the scroll state of a container using `stuck=`, `scrollable=`, and `snapped=` keys. These only work with container queries.

**Stuck**: Query whether an element is stuck due to `position: sticky`.

```html
<div class="stuck=top:bgc-red">
  <!-- Background is red when stuck to the top -->
</div>

<div class="stuck=bottom:bgc-blue">
  <!-- Background is blue when stuck to the bottom -->
</div>
```

**Scrollable**: Query whether a container is scrollable in a given direction.

```html
<div class="scrollable=top:bgc-red">
  <!-- Background is red when scrollable from the top -->
</div>

<div class="scrollable=bottom:bgc-blue">
  <!-- Background is blue when scrollable from the bottom -->
</div>
```

**Snapped**: Query whether an element is snapped to a scroll snap position.

```html
<div class="snapped=x:bgc-red">
  <!-- Background is red when snapped on the x-axis -->
</div>

<div class="snapped=y:bgc-blue">
  <!-- Background is blue when snapped on the y-axis -->
</div>

<div class="snapped(snap-container)=y:bgc-green">
  <!-- Background is green when snapped on the y-axis in the snap-container -->
</div>
```

