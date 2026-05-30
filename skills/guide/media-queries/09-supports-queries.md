#### 9. @supports Queries

You can use `@supports` to check for CSS feature support. These are viewport-only queries.

**Direct utility check**: The `@supports` key without a value checks if the browser supports the utility being applied.

```html
<div class="@supports:bdblur-4 bgc-white/30">
  <!-- Apply backdrop blur if browser supports it -->
</div>

<div class="@supports:rows=subgrid">
  <!-- Use subgrid if browser supports it -->
</div>
```

**Custom query**: Use `@supports=[query]` to check for any CSS feature support.

```html
<div class="@supports=[backdrop-filter:blur(1px)]:bdblur-4 bgc-black/50">
  <!-- Apply backdrop blur with fallback if browser supports it -->
</div>

<div class="@supports=[container-type:inline-size]:cnt">
  <!-- Enable container queries if browser supports them -->
</div>

<div class="@supports=[selector(:has(*))]:^.card:has(.error):bgc-red">
  <!-- Use :has() selector if browser supports it -->
</div>
```

