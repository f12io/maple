<div align="center">

  <h1>Maple</h1>
  <p>
    A variable-first, stack-agnostic runtime CSS engine.<br>
    Atomic. Tiny (~12kb gzipped). Fast. Delightfully intuitive.
  </p>

  <p>
    Zero build steps • Zero configuration • Zero dependencies
  </p>

  <p>
    <a href="#why-maple">Why Maple?</a> •
    <a href="#the-deep-dive">Deep Dive</a> •
    <a href="https://maple.f12.io">Docs</a>
  </p>

</div>

## TL;DR

Maple is a runtime CSS engine that generates atomic styles from utility classes **only when they appear in the DOM**.

Instead of shipping a stylesheet upfront, Maple ships a small runtime (~12kb gzipped) that observes the DOM and constructs CSS incrementally as your application renders. If a class is never used, its style is never generated.

This shifts styling cost from upfront network transfer to demand-driven runtime generation, eliminating build steps, configuration, and unused CSS — while keeping styles encapsulated.

## Quick Start

Add Maple to your project by including the script below and start styling.

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Include Maple in the head -->
    <script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js"></script>
  </head>
  <body>
    <!-- Start styling -->
    <div class="bgc-blue c-white p-4">Hello World</div>
  </body>
</html>
```

> [!IMPORTANT]
> Load Maple as a blocking script in the document head.
> Do not use `async`, `defer`, `type="module"`, or place the script at the end of the body.
>
> These options allow the browser to process and render DOM elements before Maple initializes, which can result in unstyled or partially styled content during the first paint.

## Why Maple?

Before going into the details of how Maple works, let's understand why you might actually need it.

Since the introduction of CSS, the stylesheets are treated as static assets for a good reason. The "C" at the beginning of CSS stands for "Cascading", meaning that the rule at line 5000 can override the rule at line 1.

This feature naturally draws a hard line on how CSS can be evaluated between the first stylesheet request and the pixels on the screen. Any random combination of selector and specificity order has to be converted to CSSOM before its sibling DOM can be processed. So downloading stylesheets in the head, parsing them, building the CSSOM and then matching it with the DOM elements became the inevitable way to render the page, which we call [Critical Rendering Path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path).

That "hard line" forced us to architect [optimizations](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS) entirely around network latency and selector complexity. Currently, our optimization options are:

- Remove unnecessary styles
- Split CSS into separate modules
- Minify and compress CSS files
- Simplify selectors
- Preload important assets

Implementation of these optimizations requires complex tooling, build steps and configurations, in addition to cognitive load of code-splitting strategies. So far, we invented:

- Preprocessors (Compass, Sass, Less)
- Postprocessors (PostCSS, Autoprefixer)
- Semantic Approaches (BEM, OOCSS, SMACSS)
- Utility-first frameworks (Tailwind, Tachyons)
- Purgers (PurgeCSS)
- Critical CSS Extractors
- CSS-in-JS (Styled Components, Emotion)

As of now, the industry has settled on the idea that "CSS scales better when you stop writing CSS." That's why the popularity of Tailwind is not a coincidence. However, this does not change the fact that Tailwind is still bound by the "Static Asset" hard line. To see your first styles rendered on the screen, here is what needs to be done:

- Bootstrap a project with a build tool (Vite, Webpack, etc.)
- Install Tailwind
- Configure Tailwind
- Let Tailwind purge unused styles
- Build and deploy

So, no matter what we do, we face the same hard line: developers can optimize how CSS is delivered, but not when or how styles are created and managed at runtime.

Maple is here to challenge this hard line. Instead of optimizing CSS files, Maple generates styles **on-demand** as the browser encounters classes. This seemingly simple change creates cascading architectural benefits:

**Delivery & Performance:**

- Constant Transfer Size (12kb, always)
- Incremental CSSOM Construction
- Automatic Code Splitting
- Zero "Dead Code"

**Developer Experience:**

- No Build Step
- No Configuration Files
- No Special SSR Treatment
- Universal Portability

**Styling Power:**

- Dynamic Data as CSS
- Variable-First Architecture
- Dynamic Color Manipulation
- True Component Encapsulation

## The Deep Dive

Let's examine each benefit in detail:

### Constant Transfer Size

Maple ships as a single ~12kb (gzipped) JavaScript file that generates styles from utility classes at runtime. This may seem counterintuitive in a world where static CSS is considered the gold standard — but Maple operates on a fundamentally different model.

An application can easily accumulate 20kb, 200kb, or even megabytes of potential styles. On a first visit, those styles must be downloaded in full before the browser can render anything. No matter how fast the user’s device is, no matter how aggressively the CSS is optimized, that network cost is paid upfront.

By generating styles only when classes are encountered, Maple shifts this trade-off. The network cost of styling becomes constant — the browser always downloads the same small runtime — while CSS is constructed incrementally based on what actually appears on the page.

This moves work from upfront network transfer to incremental runtime generation, trading bandwidth for demand-driven computation.

---

### No Build Step

This is where things get interesting. To put a blue rectangle on the screen today, `bg-blue` must travel through a sophisticated, multi-step build toolchain:

**With Sass:**

```
bg-blue → Sass → PostCSS → Autoprefixer → Minify → CSS File → Browser
         └─ requires a build step and toolchain configuration
```

**With Tailwind v4:**

```
bg-blue → Vite → Oxide Engine → Lightning CSS → CSS File → Browser
         └─ requires a build step and minimal configuration
```

**With Maple:**

```
bg-blue → Browser
         └─ no build step, no configuration
```

To style an application with Maple, all you need is to include the script below in the document head:

```html
<script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js"></script>
```

---

### No Configuration Files

Most utility-based styling engines depend on static analysis. They scan source files ahead of time, trying to predict which class names might exist at runtime.

This creates a fundamental mismatch between where styles are decided and where styles actually exist.

As soon as class names stop being fully static, static analysis breaks down:

- Classes coming from databases `className={row.style}`
- Classes assembled dynamically `p-${spacing}`
- Classes introduced by third-party scripts
- Classes injected by the server or middleware
- Large codebases and monorepos with ambiguous scan boundaries

The result is configuration: safelists, glob patterns, special rules, and constant maintenance to keep the analyzer in sync with reality.

Maple takes a different approach.

Instead of scanning files, Maple runs at the end of the pipeline and observes the DOM itself using a `MutationObserver`.

If the browser sees a class, Maple sees it.

This means Maple works naturally with:

- Classes from databases
- Classes from server-rendered HTML
- Classes generated by JavaScript at runtime
- Classes introduced by third-party libraries
- Classes from literally anywhere

As a result, no configuration is required because no prediction is required.

---

### No Special SSR Treatment

Maple does not participate in server rendering.

Whether HTML is produced by Next.js, Remix, Nuxt, PHP, or served as a static file, Maple behaves the same way: it observes the DOM and generates styles as elements appear. There is no style collection step, no critical CSS extraction, and no framework-specific integration.

---

### Incremental CSSOM Construction

Browsers treat CSS as a global, order-dependent resource. Because any rule can override another, the browser must wait for an entire stylesheet to be downloaded and parsed before it can safely resolve styles and perform layout.

By generating rules strictly just-in-time (before the browser resolves styles for a newly inserted element), Maple creates a critical architectural guarantee: a newly inserted rule cannot match any element that was already rendered.

This guarantee, combined with the uniform specificity (0-1-0) of atomic utilities, has direct consequences for the browser engine:

- No invalidation: Previously rendered elements do not need to be reconsidered.
- No global matching: The engine does not need to evaluate the new rule against the entire DOM.
- Simplified specificity: Complex precedence and tie-breaker resolution is avoided.
- Zero dead code: The CSSOM grows linearly and never contains unused rules.

This shifts CSS from a front-loaded, render-blocking asset into an incremental, demand-driven process. The performance cost now scales linearly, and only
with the unique utility classes that actually appear on the page.

---

### Automatic Code Splitting

With Maple, you effectively get the most aggressive form of code splitting possible without configuring a single chunking strategy. If a component is not on the screen, its styling cost is zero.

- Styles for unseen routes are never generated
- Styles for unused components never exist
- Styles behind feature flags or conditionals are skipped entirely
- Styles for dynamic content are generated only when needed

There is no need to align CSS chunks with JavaScript chunks, no route-based extraction, and no risk of overfetching styles “just in case.”

Code splitting stops being a build-time optimization and becomes a natural outcome of Maple’s architecture.

---

### Zero Dead Code

The existence of unused code is structurally impossible with Maple. Like automatic code splitting, zero dead code emerges naturally from the architecture.

In practice, this means:

- No "legacy CSS" to maintain
- No auditing required
- No fear of breaking hidden dependencies when removing code

As styles cannot exist “just in case”, the styling footprint is always perfectly aligned with the actual feature set of the project.

---

### Universal Portability

Because Maple has no build step or compile-time requirements, it works anywhere HTML and JavaScript work. If you can add a `<script>` tag, you can use Maple.

This makes Maple immediately usable in environments where build-dependent CSS tooling is impractical or unavailable:

- CMS platforms and backend-driven applications (WordPress, PHP, Django, Rails)
- Server-rendered templates without a bundler
- Low-code and no-code platforms
- Embedded widgets and third-party scripts

There is no npm install, no bundler configuration, and no fragile build chain to maintain.

Maple decouples design systems from build infrastructure — and makes modern utility-based styling available to the entire web.

---

### Dynamic Data as CSS

Modern applications are driven by dynamic data—from CMS content, API responses, or user preferences. Build-time styling systems struggle here because they must know every class name in advance.

The result is a familiar constraint: styling becomes a fixed set of developer-approved presets. Content teams can choose size="small" or color="blue", but anything beyond that requires a code change and a redeploy.

Maple treats dynamic data exactly like static class names, so styles can be generated directly from runtime values—without escaping the design system.

**For Developers:**

You can interpolate variables directly into utility classes, including arbitrary runtime values. Unlike inline styles, these utilities retain full support for states, media queries, and variants.

```jsx
<div className={`md:bg-${userColor} w=${progress}%`}></div>
```

**For Content Teams:**

In a headless CMS, editors can supply utility strings as data, for example: `fs-xl fw-bold c-blue-600`

Layouts, typography, and visual variants can be adjusted instantly—without touching code or triggering a deployment.

> [!IMPORTANT]
> The power of Maple comes with the responsibility of using it wisely. While Maple enables flexible and dynamic designs, class names with dynamic or highly variable runtime values can cause unnecessary CSSOM growth if not carefully constrained.

---

### Variable-first Architecture

Traditional utility engines map a class name to a static value.
`text-blue-500` → `#3b82f6`

Maple maps a class name to a **semantic fallback chain** of CSS variables. This means utilities don’t encode values — they express intent, and variables determine the result.

When you write a utility like `c-primary`, Maple does not resolve it to a single color. Instead, it generates a CSS rule that progressively searches for meaning at multiple levels:

```css
.c-primary {
  color: oklch(
    from
      var(
        /* 1. Is there a specific override for color property? */ --c-primary,
        var(
          /* 2. Is there a generic 'color-primary'? */ --color-primary,
          var(
            /* 3. Is there a global 'primary' token? */ --primary,
            /* 4. Fallback */ primary
          )
        )
      )
      /* ... plus lightness, chroma, and hue modifiers */
  );
}
```

The same principle applies to every utility, not just colors. A spacing utility like `mb-6` resolves to:

```css
.mb-6 {
  margin-bottom: var(--mb-6, var(--space-6, calc(6rem * var(--spacer, 0.25))));
}
```

**Direct Assignment**

When you want to bypass the variable system, you can use `=` to inject a literal value directly:

```html
<div class="w=86% c=#ff0000"></div>
```

**Local Scoping**

You can define variables directly in the HTML using class syntax. You can theme a component instance without writing custom CSS:

```html
<div class="--primary=purple brc-primary c-primary">I am purple.</div>
```

This architecture enables:

- Component-scoped theming
- Contextual overrides
- Portable components
- Runtime design tokens
- CMS-driven styling
- Feature-flagged visual changes

All without introducing new APIs or special syntax.

---

### Dynamic Color Manipulation

In most styling systems, colors are static. If you want lighter, darker, muted, or emphasized variants, you predefine them ahead of time:

`blue-100`, `blue-200`, `blue-300`, ...

This inflates the palette, locks decisions into build time, and turns theming into a bookkeeping problem.

On the other hand, Maple treats colors as parameters. Color utilities resolve through CSS variables in the OKLCH color space, making lightness, chroma, hue, and alpha adjustable at runtime.

A single semantic color can express an entire range of variants — without defining them upfront.

```html
<div class="bgc-primary c-white/80"></div>
```

**Infinite Variants**

Variants are derived relative to the base color.

```html
<div class="c-primary"></div>
<div class="c-primary-600"></div>
<div class="c-primary/50"></div>
<div class="c-primary-600/70"></div>
<div class="c-primary-732/54"></div>
```

**Named Colors**

CSS ships with a built-in palette of 140+ named colors. Traditionally, these have been treated as legacy values — flat, inconsistent, and unsuitable for modern design systems.

In Maple, named colors flow through the same OKLCH-based pipeline as semantic tokens. As a result, every named color automatically gains:

- Lightness scaling
- Chroma adjustment
- Hue rotation
- Alpha control
- Contextual theming

```html
<div class="c-coral-600"></div>
<div class="bg-teal/70"></div>
<div class="c-slateblue"></div>
```

Maple effectively turns CSS named colors into a zero-configuration color system with thousands of usable variants.

**Context-aware Theming**

Because all color adjustments are variable-driven, colors respond naturally to context:

```html
<section class="--primary=teal">
  <button class="bgc-primary c-white"></button>
</section>

<section class="--primary=purple">
  <button class="bgc-primary c-white"></button>
</section>
```

The same markup produces different results — without conditional classes, duplication, or rebuilds.

**Per-component Color Behavior**

Components can tune color behavior locally:

```html
<div class="@dark:--bgc-l-scale=0.2 @dark:--c-l-scale=100">
  <div class="bgc-primary c-primary"></div>
</div>
```

This allows components to soften, intensify, or shift colors relative to their surroundings — something static color systems cannot express.

Dynamic color manipulation enables:

- Semantic color systems without palette explosion
- Runtime theming and experimentation
- Component-scoped color tuning
- Better perceptual consistency via OKLCH
- Named colors as usable design primitives

---

### True Component Encapsulation

In front-end development, styling relies on agreement.

> “We agree to use BEM.”
>
> “We agree not to use global selectors.”
>
> “We agree to pass props for theming.”

As long as everyone follows the rules, things work. When they don’t, styles leak, specificity escalates, and `!important`, `::ng-deep`, or global overrides become inevitable.

Maple removes the need for agreement by moving selector logic into the class name itself. It supports full CSS selector syntax inline, allowing components to define their own relationship with their environment, without relying on external coordination.

#### 1. Parent Selector (^)

Usually, a parent controls a child: `card .button { color: red }`. This creates a dependency where the Card must know about the Button.

Using the caret `^`, Maple allows the child to decide how it looks based on where it lives:

```html
<button class="^.card:c-red ^.nav:c-white">Smart Button</button>
```

So, elements define their own contextual behavior. This is true component encapsulation.

- No prop drilling (`<Button variant="card" />`)
- No global overrides
- No coupling between components

#### 2. Self Selector (&)

Maple supports self selectors via `&`, allowing components to express complex state logic directly:

```html
<div class="&:hover:c-white">Interactive Component</div>
```

#### 3. Child Selector (/)

Sometimes you need to style markup you don’t control — CMS output, markdown, or third-party HTML.

Maple allows child selectors inline using `/`:

```html
<div class="/>span:fw=700">
  <span>I am bold</span>
</div>
```

An element styled with Maple is a self-contained unit of styling logic that behaves identically across frameworks, projects, and environments. However, please note:

> [!IMPORTANT]
> Maple removes the need for global agreements, but not the risk of misuse. Selector power can become footguns that can recreate similar chaos locally.

## Limitations & Trade-offs

Maple deliberately shifts styling concerns from build time to runtime. This unlocks new capabilities, but also introduces constraints that are important to understand before adopting it.

- **JavaScript is required for styling.** Maple does not generate or ship static CSS. If JavaScript is disabled, the page will render without styles.
- **Not all CSS belongs in utilities.** While Maple supports advanced selectors, certain patterns—such as complex keyframes-are often better expressed in traditional CSS. Please keep in mind that Maple is optimized for utility-first and token-driven design systems.
- **Arbitrary runtime values must be bounded.** Styles generated from arbitrary runtime values can lead to excessive CSSOM growth. As with static stylesheets, once a style rule is inserted into the CSSOM, it remains in memory until page unload. When arbitrary runtime values are not used, Maple’s total CSSOM memory usage converges to that of an equivalent static CSS implementation. The difference is that Maple starts with an empty CSSOM and builds it incrementally as needed.
- **Runtime cost scales with the number of unique utility classes.** Maple’s runtime overhead scales with the number of unique utility classes that actually appear in the DOM. For most applications this cost is negligible—and often lower than shipping large static stylesheets—but performance characteristics should be evaluated for your specific use case. See [Performance](#performance) and the [examples](#examples) for guidance.
- **Relative OKLCH Colors** Maple uses OKLCH relative colors to support dynamic color adjustment. As of writing, the browser support is 89.65%. Please check [Can I use](https://caniuse.com/mdn-css_types_color_oklch_relative_syntax) for the latest information.

## Contributing

If you're interested in contributing to Maple, please read our [contributing docs](https://github.com/f12io/maple/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

Released under [ROOT](https://github.com/f12io/maple/blob/main/LICENSE) License © [f12.io](https://f12.io)
