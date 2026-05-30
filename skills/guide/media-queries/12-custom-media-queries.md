#### 12. Custom Media Queries

You can write any custom media query using the `key=value` format. This works for both viewport and container queries.

```html
<div class="@prefers-contrast=more:c-black">
  <!-- Text is black when user prefers more contrast -->
</div>

<div class="@not-prefers-contrast=more:c-gray">
  <!-- Text is gray when user does NOT prefer more contrast -->
</div>
```

