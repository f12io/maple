## Selectors

**Format:** Any css selector is valid before utility classes. However, Maple introduces 3 delimiters to allow the elements manage their own styles.

- `^` for parent-state
- `&` for self
- `/` for child

After these delimiters, you can use any css selector. For example:

```html
<div class="^.state-active:bgc-red">
  <!-- Background is red when in a parent having state-active class -->
</div>

<div class="^.card:hover:bgc-red">
  <!-- Background is red when in a parent having card class and it's hovered -->
</div>

<div class="&:hover:bgc-red">
  <!-- Background is red when hovered -->
</div>

<div class="&[data-active='true']:bgc-red">
  <!-- Background is red when has data-active attribute -->
</div>

<div class="/span:bgc-red">
  <span>
    <!-- Background is red -->
  </span>
</div>

<div class="/+span:bgc-red">
  <!-- If next sibling is a span, set its background to red -->
</div>
```

You can combine these delimiters to create more complex selectors.

```html
<div class="^.state-active&:hover/span:bgc-red">
  <span>
    <!-- Background is red when in a parent having state-active class and parent is hovered -->
  </span>
</div>
```

Instead of space character, you can use underscore `_` to select children.

```html
<div class="^.card_.card-header&:before:content='🙂'">
  <!-- Shows emoji when in a card-header element which is also in a card element -->
</div>
```

As said earlier you can use all kind of selectors, even `:not` and `:has`

```html
<div class="^.card:not([class*='p-']):p-4">
  <!-- Has padding when in a card element which doesn't have any padding class -->
</div>

<div class="^.card:has(>.featured):bgc-red">
  <!-- Background is red when in a card which has a direct child with featured class -->
</div>
```

> [!IMPORTANT]
> Parent and self selectors are superior for managing element states without leaking styles. They allow you to build truly isolated components. However, the child selector should be used if only you have no control on the children. Otherwise, it will be against the utility-first philosophy and you might easily end up with tightly coupled components.

**Selector Helpers**

Maple provides a few helpers to make selector usage even more concise.

- `:rtl` for `[dir='rtl']`
- `:ltr` for `[dir='ltr']`
- `:odd` for `:nth-child(odd)`
- `:even` for `:nth-child(even)`

```html
<div class="^:rtl:pr-2">
  <!-- Has padding-right when in a rtl parent -->
</div>

<div class="&:odd:bgc-red">
  <!-- Has red background if an odd child -->
</div>

<div class="&:even:bgc-blue">
  <!-- Has blue background if an even child -->
</div>
```
