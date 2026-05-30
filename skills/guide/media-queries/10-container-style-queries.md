#### 10. Container Style Queries

You can use `style=` to query the computed style of a container. Style queries only work with container queries.

```html
<div class="cnt --theme=dark">
  <div class="style=[--theme:dark]:bgc-gray-900 style=[--theme:dark]:c-white">
    <!-- Dark theme styles applied when container has --theme:dark -->
  </div>
</div>

<div class="cnt=card --variant=outlined">
  <div
    class="style(card)=[--variant:outlined]:br style(card)=[--variant:outlined]:brc-gray-300"
  >
    <!-- Outlined card variant with border styles -->
  </div>
</div>

<div class="cnt --is-expanded=true">
  <div
    class="style=[--is-expanded:true]:h-auto not-style=[--is-expanded:true]:h-0"
  >
    <!-- Toggle height based on --is-expanded state -->
  </div>
</div>
```

