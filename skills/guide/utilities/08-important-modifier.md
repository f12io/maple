#### 8. Important Modifier

Maple supports `!important` via two syntaxes:

**Prefix syntax** (recommended): Add `!` at the beginning of the class name.

```html
<div class="!bgc-red">
  <!-- background-color: var(--bgc-red, fallback chain...) !important -->
</div>

<div class="!bgc=red">
  <!-- background-color: red !important -->
</div>

<div class="!@md:^:rtl:bgc=red">
  <!-- @media (min-width: 768px) { .selector { background-color: red !important } } -->
</div>
```

**Suffix syntax**: Append `_!important` at the end of the value.

```html
<div class="bgc-red_!important">
  <!-- background-color: var(--bgc-red, fallback chain...) !important -->
</div>

<div class="bgc=red_!important">
  <!-- background-color: red !important -->
</div>

<div class="@md:^:rtl:bgc=red_!important">
  <!-- @media (min-width: 768px) { .selector { background-color: red !important } } -->
</div>
```

