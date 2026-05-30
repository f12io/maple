## Animations

Maple provides utilities for every CSS animation property. The `anim-*` utility also supports animation shorthand values: Maple splits shorthand tokens on `_`, classifies each token, and serializes the result as the CSS `animation` property.

For convenience, include `keyframes.css` when you want to use Maple's built-in animation names. The serializer only writes animation declarations; the keyframes themselves must still exist in CSS.

### Setup

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/keyframes.css"
  />
  <script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js"></script>
</head>
```

### Animation Utilities

```html
<!-- Built-in alias: expands to anim-fade-in_600_ease-out_forwards -->
<div class="fade-in">Fades in over 600ms</div>

<!-- Built-in alias: expands to anim-spin_1000_linear_infinite -->
<div class="spin">⟳</div>

<!-- Custom animation with name, duration, timing function, delay, fill mode -->
<div class="anim-fade-in-up_500_ease-out_200_both">Custom animation</div>

<!-- Hover-triggered animation -->
<div class="&:hover:shake">Shakes on hover</div>
```

### Animation Shorthand Parsing

In `anim-*`, separate shorthand tokens with `_`.

```html
<div class="anim-fade-in_600_ease-out_forwards"></div>
<div class="anim-spin_1000_linear_infinite"></div>
<div class="anim-fade-in_300_ease-out_forwards,spin_1000_linear_infinite"></div>
```

Maple classifies shorthand tokens in this order:

| Token Type           | Serialized As               | Examples                                                    |
| -------------------- | --------------------------- | ----------------------------------------------------------- |
| Timing function      | `animation-timing-function` | `linear`, `ease-out`, `steps(4)`, `cubic-bezier(0,0,0.2,1)` |
| Direction            | `animation-direction`       | `normal`, `reverse`, `alternate`, `alternate-reverse`       |
| Fill mode            | `animation-fill-mode`       | `none`, `forwards`, `backwards`, `both`                     |
| Play state           | `animation-play-state`      | `running`, `paused`                                         |
| `infinite`           | `animation-iteration-count` | `infinite`                                                  |
| First numeric token  | `animation-duration`        | `600`, `1s`, `250ms`                                        |
| Second numeric token | `animation-delay`           | `200`, `0.15s`                                              |
| Later numeric tokens | `animation-iteration-count` | `3`                                                         |
| Any other token      | `animation-name`            | `fade-in`, `spin`, `custom-loader`                          |

Numeric duration and delay values use Maple's default time unit, so `600` serializes as `600ms`. Use explicit units when needed, such as `1s` or `250ms`.

### Animation Properties

| Utility    | Property                  | Example Values                    |
| ---------- | ------------------------- | --------------------------------- |
| `anim`     | animation                 | `anim-fade-in`                    |
| `animname` | animation-name            | `animname-spin`                   |
| `animdur`  | animation-duration        | `animdur-600` (600ms)             |
| `animdel`  | animation-delay           | `animdel-200` (200ms)             |
| `animtf`   | animation-timing-function | `animtf-ease-in-out`              |
| `animic`   | animation-iteration-count | `animic-infinite`, `animic-3`     |
| `animdir`  | animation-direction       | `animdir-alternate`               |
| `animfm`   | animation-fill-mode       | `animfm-forwards`, `animfm-both`  |
| `animps`   | animation-play-state      | `animps-paused`, `animps-running` |

### Customizing Animations

When `anim-*` contains an animation name, Maple can wrap shorthand sub-values with animation-specific CSS variable fallbacks.

```css
var(--animdur-fade-in, var(--animdur, var(--animdur-600, var(--time-600, 600ms))))
var(--animdel-fade-in, var(--animdel, var(--animdel-0, var(--time-0, 0ms))))
var(--animtf-fade-in, var(--animtf, var(--animtf-ease-out, var(--ease-out, ease-out))))
var(--animic-fade-in, var(--animic, var(--animic-infinite, var(--infinite, infinite))))
var(--animdir-fade-in, var(--animdir, var(--animdir-alternate, var(--alternate, alternate))))
var(--animfm-fade-in, var(--animfm, var(--animfm-forwards, var(--forwards, forwards))))
var(--animps-fade-in, var(--animps, var(--animps-running, var(--running, running))))
```

This means you can customize preset defaults with variables, or override individual properties with normal animation utilities:

```html
<!-- Customize animation-specific defaults -->
<html
  class="--animdur=200ms --animdur-fade-in=500ms --animdel-fade-in=100ms --animdur-spin=2s"
>
  <div class="fade-in">Slow fade</div>

  <!-- Override one property on a specific element -->
  <div class="fade-in animdur-200">Fast fade just for this element</div>

  <!-- Customize keyframe behavior exposed by keyframes.css -->
  <div class="--fade-distance=96px fade-in-up">Fades from further</div>
  <div class="--slide-distance=96px slide-in-up">Slides from further</div>
  <div class="--pulse-opacity=0.1 pulse">Deeper pulse</div>
</html>
```

You can also define custom animation aliases on `<html>`:

```html
<html class="--alias-enter=anim-fade-in-up_500_ease-out_both">
  <div class="@enter">Custom enter animation</div>
</html>
```

### Creating Custom Keyframes

You can define custom keyframes in standard CSS (via a `<style>` block or external stylesheet) and then reference them by name in Maple's `anim-*` utilities.

```html
<style>
  @keyframes slide-intro {
    from {
      opacity: 0;
      transform: translateY(var(--slide-y, 10px));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<!-- Use directly in an element -->
<div class="anim-slide-intro_500_ease-out">Hello World</div>

<!-- Or define an alias for cleaner markup -->
<html class="--alias-intro=anim-slide-intro_500_ease-out">
  <div class="@intro">Better World</div>
</html>
```

> [!TIP]
> Use CSS variables with fallbacks in your keyframes (e.g., `var(--name, default)`) to make them highly reusable. This allows you to tweak the animation behavior per-element without defining new keyframes.

### Built-in Animation Aliases

The following table lists built-in animation aliases. These can be used directly (e.g., `fade-in`) or with an `@` prefix (e.g., `@fade-in`).

| Animation         | Description                 | Variables                                                                    | Expands To                                           |
| ----------------- | --------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| `fade-in`         | Fade from transparent       | `--fade-from-opacity`, `--fade-to-opacity`                                   | `anim-fade-in_600_ease-out_forwards`                 |
| `fade-out`        | Fade to transparent         | `--fade-from-opacity`, `--fade-to-opacity`                                   | `anim-fade-out_200_ease-in_forwards`                 |
| `fade-in-up`      | Fade in from below          | `--fade-distance` (default: 48px), `--fade-scale-from` (default: 0.98)       | `anim-fade-in-up_600_ease-out_forwards`              |
| `fade-in-down`    | Fade in from above          | `--fade-distance`, `--fade-scale-from`                                       | `anim-fade-in-down_600_ease-out_forwards`            |
| `fade-in-left`    | Fade in from right          | `--fade-distance`, `--fade-scale-from`                                       | `anim-fade-in-left_600_ease-out_forwards`            |
| `fade-in-right`   | Fade in from left           | `--fade-distance`, `--fade-scale-from`                                       | `anim-fade-in-right_600_ease-out_forwards`           |
| `fade-out-up`     | Fade out toward top         | `--fade-distance`, `--fade-scale-to` (default: 0.98)                         | `anim-fade-out-up_200_ease-in_forwards`              |
| `fade-out-down`   | Fade out toward bottom      | `--fade-distance`, `--fade-scale-to`                                         | `anim-fade-out-down_200_ease-in_forwards`            |
| `fade-out-left`   | Fade out toward left        | `--fade-distance`, `--fade-scale-to`                                         | `anim-fade-out-left_200_ease-in_forwards`            |
| `fade-out-right`  | Fade out toward right       | `--fade-distance`, `--fade-scale-to`                                         | `anim-fade-out-right_200_ease-in_forwards`           |
| `scale-in`        | Scale up while fading in    | `--scale-from` (default: 0.96), `--scale-from-opacity`, `--scale-to-opacity` | `anim-scale-in_600_ease-out_forwards`                |
| `scale-out`       | Scale down while fading out | `--scale-to` (default: 0.96), `--scale-from-opacity`, `--scale-to-opacity`   | `anim-scale-out_200_ease-in_forwards`                |
| `slide-in-up`     | Slide in from below         | `--slide-distance`                                                           | `anim-slide-in-up_600_ease-out_forwards`             |
| `slide-in-down`   | Slide in from above         | `--slide-distance`                                                           | `anim-slide-in-down_600_ease-out_forwards`           |
| `slide-in-left`   | Slide in from right         | `--slide-distance`                                                           | `anim-slide-in-left_600_ease-out_forwards`           |
| `slide-in-right`  | Slide in from left          | `--slide-distance`                                                           | `anim-slide-in-right_600_ease-out_forwards`          |
| `slide-out-up`    | Slide out toward top        | `--slide-distance`                                                           | `anim-slide-out-up_200_ease-in_forwards`             |
| `slide-out-down`  | Slide out toward bottom     | `--slide-distance`                                                           | `anim-slide-out-down_200_ease-in_forwards`           |
| `slide-out-left`  | Slide out toward left       | `--slide-distance`                                                           | `anim-slide-out-left_200_ease-in_forwards`           |
| `slide-out-right` | Slide out toward right      | `--slide-distance`                                                           | `anim-slide-out-right_200_ease-in_forwards`          |
| `spin`            | Continuous rotation         | -                                                                            | `anim-spin_1000_linear_infinite`                     |
| `ping`            | Radar ping effect           | `--ping-scale` (default: 2)                                                  | `anim-ping_1000_cubic-bezier(0,0,0.2,1)_infinite`    |
| `pulse`           | Fade in/out loop            | `--pulse-opacity` (default: 0.5)                                             | `anim-pulse_2000_cubic-bezier(0.4,0,0.6,1)_infinite` |
| `bounce`          | Bouncing motion             | `--bounce-distance` (default: 25%)                                           | `anim-bounce_1000_infinite`                          |
| `shake`           | Horizontal shake            | `--shake-distance` (default: 10px)                                           | `anim-shake_800_ease-in-out`                         |
| `wiggle`          | Rotational wiggle           | `--wiggle-angle` (default: 6deg)                                             | `anim-wiggle_400_ease-in-out`                        |

Built-in one-shot aliases use `forwards` so the element keeps the final keyframe after the animation finishes. Use `animfm-both` or an explicit `_both` shorthand only when delayed animations should also apply their first keyframe before they start.
