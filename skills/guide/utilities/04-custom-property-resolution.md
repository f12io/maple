#### 4. Custom Property Resolution

Any property that is not a color or number is considered as `custom`. They all follow the same resolution logic as follows:

```css
/* Font Family */
.ff-main {
  font-family: var(--ff-main, var(--main, main));
}

/* Opacity */
.o-half {
  opacity: var(--o-half, var(--half, half));
}
```

