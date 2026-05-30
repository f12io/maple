#### 7. Setting Values Directly

When you need to bypass Maple's fallback chain and use a value directly, use the equal sign `=` or bracket `[]` syntax.

**Equal sign syntax**: Use `=` instead of `-` to pass the value directly without variable resolution.

```html
<div class="bgc=red"><!-- background-color: red --></div>
<div class="w=100px"><!-- width: 100px --></div>
<div class="br=1px_solid_black"><!-- border: 1px solid black --></div>
```

**Bracket syntax**: Use `[value]` within the class for inline custom values, useful when you need special characters.

```html
<div class="bgimg-url|[https://example.com/image.jpg]">
  <!-- background-image: url(https://example.com/image.jpg) -->
</div>

<div class="m-4_[calc(100%_-_20px)]">
  <!-- margin: 1rem calc(100% - 20px) -->
</div>
```

> [!TIP]
> Use equal sign syntax for simple values. Use bracket syntax when your value contains special characters like `:` (colon is a delimiter). Even with equal sign, brackets may be needed: `bgimg=[url(https://example.com/image.jpg)]`.

**Special Character Handling**

Maple uses reverse scanning to detect reserved delimiters (`:`, `()`, `-`, etc.). Single quotes, double quotes, and brackets control parsing depth—content inside them is treated as a single value.

The key difference:

- **Brackets `[]`** are removed from the output
- **Quotes `'...'` or `"..."`** are preserved in the output

```html
<div class="bgimg=[url(https://example.com/image.jpg)]">
  <!-- background-image: url(https://example.com/image.jpg); -->
</div>

<div class="bgimg=url('https://example.com/image.jpg')">
  <!-- background-image: url('https://example.com/image.jpg'); -->
</div>

<div class="@supports=[backdrop-filter:blur(1px)]:bdblur-4">
  <!-- Brackets protect the colon in the @supports query -->
  <!-- @supports (backdrop-filter:blur(1px)) { .selector { backdrop-filter: blur(16px); } } -->
</div>
```

