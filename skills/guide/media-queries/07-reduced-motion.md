#### 7. Reduced Motion

You can use `motion-reduce` and `motion-safe` keys to target the user's motion preferences. These are viewport-only queries.

```html
<div class="@motion-reduce:tsdur-0">
  <!-- Transition duration is 0 when user prefers reduced motion -->
</div>

<div class="@motion-safe:tsdur-300">
  <!-- Transition duration is 300ms when user has no motion preference -->
</div>
```

