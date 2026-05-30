# Maple CSS Skill

This guide provides instructions on how to write CSS using the Maple engine. Maple is a runtime CSS engine that generates styles on-demand based on class names.

- It relies heavily on CSS variables, fallback chains, and runtime composition.
- It is a stack-agnostic engine, meaning it can be used with any frontend framework (React, Vue, Angular, Next.js, Remix, Nuxt etc.) or backend-driven applications (WordPress, PHP, Django, Rails etc.).
- It does not require any build step or configuration.

## Quick Start

To style an application with Maple, all you need is to include the script below in the document head:

```html
<script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js"></script>
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

## Core Concepts

1.  **Runtime Generation**: Styles are generated only when they appear in the DOM. No build step is required.
2.  **Variable-First**: Maple maps a class name to a **semantic fallback chain** of CSS variables. This means utilities don’t encode values — they express intent, and variables determine the result.
3.  **Atomic & Composition**: Classes are atomic (single purpose) but Maple has full CSS selector support in class names.
4.  **Automatic Conflict Resolution**: Maple treats the class attribute as an ordered style declaration. When multiple utilities target the same generated CSS property in the same context, the later utility wins and earlier conflicting utilities are removed from the element.
