<div align="center">

  <h1>Maple</h1>
  <p>
    A variable-first, stack-agnostic runtime CSS engine.<br>
    Atomic. Tiny (~12kb gzipped). Delightfully intuitive.
  </p>

  <p>
    Zero build steps • Zero configuration • Zero dependencies
  </p>

  <p>
    <a href="#quick-start">Quick Start</a> •
    <a href="#why-maple">Why Maple?</a> •
    <a href="#documentation">Documentation</a> •
    <a href="https://maple.f12.io">Website</a>
  </p>

</div>

## TL;DR

Maple is a runtime CSS engine that generates atomic styles from utility classes **only when they appear in the DOM**.

Instead of shipping pre-compiled stylesheets, Maple ships a small JavaScript file that observes the DOM and constructs CSSOM incrementally as your application renders. If a class is never used, its style is never generated.

This shifts styling cost from upfront network transfer to demand-driven runtime generation. It eliminates build steps, complex configuration, and unused CSS, while keeping styles encapsulated.

## Quick Start

Add Maple to your project by including the script below in the document `<head>` and start styling with utility classes.

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Include Maple in the head -->
    <script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js"></script>
  </head>
  <body>
    <!-- Start styling -->
    <div class="bgc-blue-500 c-white p-4 rad-2">Hello World</div>
  </body>
</html>
```

> [!IMPORTANT]
> Load Maple as a blocking script in the document head.
>
> Maple replaces a render-blocking stylesheet with a small render-blocking runtime. Loading it with `async`, `defer`, `type="module"`, or at the end of the body allows the browser to paint elements before Maple has generated their styles, which can cause a Flash of Unstyled Content.

> [!TIP]
> For production, pin Maple to a specific version:
>
> ```html
> <script src="https://cdn.jsdelivr.net/npm/@f12io/maple@x.y.z/dist/maple.js"></script>
> ```

## Why Maple?

Instead of generating or optimizing CSS files ahead of time, Maple generates styles **on-demand** as the browser encounters classes.

That model creates benefits across delivery, developer experience, and styling power.

### Delivery & Performance

- [Constant Transfer Size](https://maple.f12.io/docs/why-maple/constant-transfer-size): Maple ships as a single ~12kb gzipped JavaScript file.
- [Incremental CSSOM](https://maple.f12.io/docs/why-maple/incremental-cssom): CSS is constructed incrementally based on what appears on the page.
- [Automatic Code Splitting](https://maple.f12.io/docs/why-maple/automatic-splitting): If a component is not on the screen, its styling cost is zero.
- [No Unused Styles](https://maple.f12.io/docs/why-maple/no-unused-styles): Styles cannot exist "just in case"; they are generated only from classes that appear in the DOM.

### Developer Experience

- [No Build Step](https://maple.f12.io/docs/why-maple/no-build-step): Include the script and start styling.
- [No Configuration Files](https://maple.f12.io/docs/why-maple/no-configuration-files): Maple observes the DOM using a `MutationObserver` instead of scanning source files.
- [No Special SSR Treatment](https://maple.f12.io/docs/why-maple/no-special-ssr-treatment): Maple behaves the same whether HTML is produced by Next.js, Remix, Nuxt, PHP, or served as a static file.
- [Universal Portability](https://maple.f12.io/docs/why-maple/universal-portability): If you can add a `<script>` tag, you can use Maple.

### Styling Power

- [Dynamic Data as CSS](https://maple.f12.io/docs/why-maple/dynamic-data-as-css): Maple treats dynamic data exactly like static class names.
- [Variable-first Architecture](https://maple.f12.io/docs/why-maple/variable-first-architecture): Utilities map to semantic fallback chains of CSS variables.
- [Dynamic Color Manipulation](https://maple.f12.io/docs/why-maple/dynamic-color-manipulation): Color utilities resolve through CSS variables in the OKLCH color space.
- [True Encapsulation](https://maple.f12.io/docs/why-maple/true-encapsulation): Selector logic can live inside the class name itself.

## Syntax

Every Maple class name follows a colon-separated structure:

```txt
media-query:selector:utility
```

The first two parts are optional, so Maple scales from simple utilities to advanced state management.

```html
<div class="bgc-red"></div>
<div class="&:hover:bgc-red"></div>
<div class="@md:^.active:bgc-red"></div>
```

Learn the full syntax in the [Syntax Reference](https://maple.f12.io/docs/syntax).

## Examples

### Variable-first Utilities

Maple maps utility classes to cascading CSS variables rather than hardcoded values. You can also define variables directly in HTML using class syntax.

```html
<div class="--primary=blue bgc-primary-200 c-primary-700">I am blue.</div>
```

When you want to bypass the variable system, use `=` to inject a literal value directly:

```html
<div class="w=86% c=#ff0000"></div>
```

Read more in [Variable-first Architecture](https://maple.f12.io/docs/why-maple/variable-first-architecture) and [Variable Utilities](https://maple.f12.io/docs/guide).

### Dynamic Classes

Because Maple observes the DOM directly, dynamically generated class names work naturally.

```jsx
<div className={`md:bg-${userColor} w=${progress}%`}></div>
```

Read more in [Dynamic Data as CSS](https://maple.f12.io/docs/why-maple/dynamic-data-as-css).

### Dynamic Colors

Maple color utilities resolve through CSS variables in the OKLCH color space, making lightness, chroma, hue, and alpha adjustable at runtime.

```html
<div class="bgc-primary-320/70 c-white/80"></div>
<div class="c-coral-600"></div>
<div class="bg-teal/70"></div>
<div class="c-slateblue-500/20"></div>
```

Read more in [Dynamic Color Manipulation](https://maple.f12.io/docs/why-maple/dynamic-color-manipulation) and try the [Native Palette](https://maple.f12.io/docs/guide/native-palette).

### Inline Selectors

Maple supports selector logic inside utility classes.

```html
<button class="c-red ^.card:c-green ^.nav:c-blue">
  Text is green when in a card and blue when in a navigation bar.
</button>

<button class="&:hover:c-black">The text becomes black on hover</button>

<div class="/>span:fw=700">
  <span>This text is bold</span>
</div>
```

Read more in [True Encapsulation](https://maple.f12.io/docs/why-maple/true-encapsulation) and [Selectors](https://maple.f12.io/docs/syntax/selectors).

### Aliases

Aliases expand into one or more utility classes, letting you build reusable grouped classes. You can define custom aliases on the root `<html>` element using `--alias-{name}=...` and apply them with `@`.

```html
<html class="--alias-truncate=of=hidden;tof=ellipsis;ws=nowrap">
  <body>
    <!-- Usage: Grouped utility classes under a single name -->
    <span class="@truncate w-40">Long text that should truncate</span>
  </body>
</html>
```

#### Parameterized Aliases

Aliases can also accept parameters using `{name}` placeholders. This allows you to create incredibly flexible, reusable utility abstractions that adapt dynamically to your design needs, bridging the gap between static utility classes and dynamic components.

By combining parameterized aliases with nested forwarding, you can build entire component systems directly in your root HTML:

```html
<html
  class="--alias-swatch=c-{color,black}-600;bgc-{color,black}-100;brc-{color,black}-200;square-8;br"
>
  <body>
    <!-- Usage: Instant, dynamic variations -->
    <div class="@swatch"></div> <!-- Black (Default) -->
    <div class="@swatch(red)"></div>
    <div class="@swatch(green)"></div>
  </body>
</html>
```

## Limitations & Trade-offs

Maple's architecture offers unique benefits but also introduces constraints you should understand before adoption.

- **JavaScript is Required.** Maple runs entirely in the browser and does not generate static CSS. If JavaScript is disabled, the page will render without styles.
- **Runtime Cost Scaling.** Maple's generation work scales with the number of **unique** utility classes that appear in the DOM.
- **Not all CSS fits in Utilities.** Certain patterns, such as keyframes, font-face declarations, and global resets, are often better expressed in traditional CSS.
- **Relative OKLCH Colors.** As of May 2026, global support for relative color syntax is about 89%, with broader support for plain OKLab and OKLCH colors. Browsers that do not support relative color syntax ignore those generated color declarations.

## Documentation

- [Introduction](https://maple.f12.io/docs)
- [Quick Start](https://maple.f12.io/docs/quick-start)
- [Why Maple?](https://maple.f12.io/docs/why-maple)
- [Syntax Reference](https://maple.f12.io/docs/syntax)
- [Guide](https://maple.f12.io/docs/guide)

## Contributing

If you're interested in contributing to Maple, please read our [contributing docs](https://github.com/f12io/maple/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

Released under the [Root Source License (ROOT)](https://github.com/f12io/maple/blob/main/LICENSE), an MIT-style permissive license with an additional distribution condition for systems that can recreate the source on demand. © [f12.io](https://f12.io)
