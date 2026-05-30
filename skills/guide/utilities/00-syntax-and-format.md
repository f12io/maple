## Syntax Reference

Maple class names are composed of three parts:

**Format:** `{media-query}:{selector}:{utility}`

- `{media-query}`: Optional. Can be a breakpoint (`md:`, `lg:`) or a media query (`@dark:`, `@print:`).
- `{selector}`: Optional. Can be a parent selector (`^.state-active:`), a self-selector (`&:hover:`), or a child selector (`/span:`, `/>div:`).
- `{utility}`: The actual utility class.

### 1. Utilities

**Format:** `{property}-{value}` or `{property}={value}`.

- `{property}`: The CSS property to apply. All camelCase CSS properties are supported. Some properties have shorthand versions. See the list of shorthand versions below.
- `{value}`: The value to apply to the property. With `equal sign`, the value is treated as a literal string. With `hyphen`, the value is resolved to semantic fallback chain of CSS variables. The type of the property determines how the value is resolved. There are three types of properties: `color`, `number`, and `custom`.

