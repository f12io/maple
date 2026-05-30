#### 2. Number Property Resolution

The number properties having number values work out of the box. You don't need to define any CSS variables unless you want to override the default values. These properties resolve to:

```css
/* Spacing */
.p-4 {
  padding: var(--p-4, var(--space-4, calc(4rem * var(--spacer, 0.25))));
}

/* Time */
.tsdur-300 {
  transition-duration: var(--tsdur-300, var(--time-300, 300ms));
}

/* Angle */
.rot-15 {
  --tf-rot: rotate(var(--rot-15, var(--angle-15, 15deg)));
}

/* Unitless */
.z-4 {
  z-index: var(--z-4, 4);
}

/* Opacity has special handling */
.o-6 {
  opacity: 0.06;
}

.o-50 {
  opacity: 0.5;
}
```

This fallback chain allows you to manipulate the components locally, for example:

```html
<div class="lg:--spacer=0.5">
  <!-- All spacing will be doubled on large screens -->
</div>
```

However, number properties having string values require at least one fallback CSS variable to be defined. Otherwise, the browser will silently ignore the rule as it becomes invalid due to the string value. You can use string values as tokens to build your own design system. These properties resolve to:

```css
/* Spacing */
.p-md {
  padding: var(--p-md, var(--space-md, var(--md, md)));
}

/* Time */
.tsdur-fast {
  transition-duration: var(--tsdur-fast, var(--time-fast, var(--fast, fast)));
}

/* Angle */
.rot-lg {
  --tf-rot: rotate(var(--rot-lg, var(--angle-lg, var(--lg, lg))));
}

/* Unitless */
.z-max {
  z-index: var(--z-max, var(--max, max));
}

/* Opacity */
.o-half {
  opacity: var(--o-half, var(--half, half));
}
```

**Negative Values**

Maple supports two syntaxes for negative values:

**Prefix syntax**: Add `-` before the property to negate the entire resolved value.

```html
<div class="-m-4"></div>
```

```css
.-m-4 {
  margin: calc(
    var(--m-4, var(--space-4, calc(4rem * var(--spacer, 0.25)))) * -1
  );
}
```

**Inline negative**: Use a negative number in the value directly.

```html
<div class="m--4"><!-- margin with -1rem --></div>
<div class="m--4_-5"><!-- margin: -1rem -1.25rem --></div>
<div class="m--4_-5px"><!-- margin: -1rem -5px --></div>
```

```css
.m--4 {
  margin: var(--m--4, var(--space--4, calc(-4rem * var(--spacer, 0.25))));
}
```

> [!TIP]
> Use prefix syntax (`-m-4`) when you want to negate a design token. Use inline negative (`m--4`) when you specifically need a negative spacer value that can still be overridden via CSS variables.

