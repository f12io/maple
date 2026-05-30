#### 3. Unit Shorthand Resolution

Absolute and relative units have shorthand sytax for 1 unit. For example:

```css
/* Absolute */
.w-px {
  width: 1px;
}

/* Relative */
.w-rem {
  width: 1rem;
}
```

The units below are supported for `1` shorthand:

- Absolute: `px, cm, mm, in, pt, pc, Q`
- Relative: `rem, em, ch, ex, cap, ic, lh, rlh, fr`

There are also shorthands for covering the viewport or container:

```css
/* w-% class resolves to: */
.w-\% {
  width: 100%;
}

.h-vh {
  height: 100vh;
}
```

Following units are supported for `cover` shorthand:

`%, vh, vw, vmin, vmax, vi, vb, dvh, dvw, dvmin, dvmax, svh, svw, svmin, svmax, lvh, lvw, lvmin, lvmax, cqw, cqh, cqi, cqb, cqmin, cqmax`

