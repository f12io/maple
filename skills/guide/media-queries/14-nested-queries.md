#### 14. Nested Queries

You can combine multiple media queries by chaining them with colons. Maple will nest the queries in order of priority.

```html
<div class="@md:@dark:bgc-gray-900">
  <!-- Background is gray-900 on medium screens in dark mode -->
</div>

<div class="@print:md:none">
  <!-- Hidden when printing on containers wider than 768px -->
</div>

<div class="md:@xl:o-0">
  <!-- Opacity is 0 when container is >= 768px AND viewport is >= 1280px -->
</div>

<div class="@supports=[opacity:0]:@dark:@md:o-0">
  <!-- Complex nested query: supports opacity + dark mode + medium viewport -->
</div>
```

> [!TIP]
> When nesting queries, Maple automatically determines the order based on query type priority. The query with the **highest priority becomes the outermost wrapper**, and others are nested inside in their original order.
>
> **Priority order (lowest to highest):**
>
> 1. `base` - No media query
> 2. `mnw` - Min-width breakpoints
> 3. `mxw` - Max-width breakpoints
> 4. `mnh` - Min-height breakpoints
> 5. `mxh` - Max-height breakpoints
> 6. `orientation` - Landscape/portrait
> 7. `style` - Container style queries
> 8. `scroll` - Container scroll-state queries
> 9. `light` - Prefers light mode
> 10. `dark` - Prefers dark mode
> 11. `prefers` - User preferences (color-scheme, reduced-motion)
> 12. `supports` - Feature detection
> 13. `static` - Static media types (print, screen)
>
> Additionally, viewport queries (`@media`) get a slight priority boost over container queries (`@container`) of the same type.
