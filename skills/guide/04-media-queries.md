## Media Queries

This is the central reference file for Maple media-query syntax. Maple is container-query first, so read the relevant media-query reference file before writing responsive, environment, support, style, or scroll-state query classes.

Do not guess media-query syntax from Tailwind, Bootstrap, UnoCSS, CSS-in-JS conventions, or other utility systems. Use only documented Maple syntax from these files.

## Media Query Reference Files

- Syntax and format: [media-queries/00-syntax-and-format.md](media-queries/00-syntax-and-format.md) explains Maple's media-query structure, container-first behavior, viewport prefix, modifiers, query keys, named containers, operators, and values.
- Container breakpoints: [media-queries/01-container-breakpoints.md](media-queries/01-container-breakpoints.md) explains predefined container breakpoint classes, named containers, and the required `cnt` containment setup.
- Viewport breakpoints: [media-queries/02-viewport-breakpoints.md](media-queries/02-viewport-breakpoints.md) explains how to target viewport media queries with the `@` prefix.
- Breakpoint configuration: [media-queries/03-breakpoint-configuration.md](media-queries/03-breakpoint-configuration.md) explains configuring or adding breakpoints through the Maple script query string.
- Dimensions: [media-queries/04-dimensions.md](media-queries/04-dimensions.md) explains min/max width and height query keys, operators, negation, and token-based dimensions.
- Orientation: [media-queries/05-orientation.md](media-queries/05-orientation.md) explains container and viewport orientation queries for landscape and portrait.
- Color scheme: [media-queries/06-color-scheme.md](media-queries/06-color-scheme.md) explains dark, light, and negated color-scheme media queries.
- Reduced motion: [media-queries/07-reduced-motion.md](media-queries/07-reduced-motion.md) explains motion preference queries for reduced and no-preference motion.
- Display modes: [media-queries/08-display-modes.md](media-queries/08-display-modes.md) explains display-mode media queries such as fullscreen, standalone, and picture-in-picture.
- @supports queries: [media-queries/09-supports-queries.md](media-queries/09-supports-queries.md) explains feature-support queries, default support checks, and bracket syntax for complex support expressions.
- Container style queries: [media-queries/10-container-style-queries.md](media-queries/10-container-style-queries.md) explains style queries based on container CSS custom property values.
- Container scroll-state queries: [media-queries/11-container-scroll-state-queries.md](media-queries/11-container-scroll-state-queries.md) explains stuck, scrollable, and snapped scroll-state container queries.
- Custom media queries: [media-queries/12-custom-media-queries.md](media-queries/12-custom-media-queries.md) explains named custom media queries defined with CSS variables.
- Static fallback queries: [media-queries/13-static-fallback-queries.md](media-queries/13-static-fallback-queries.md) explains non-reactive fallback media values for classes that cannot depend on runtime variables.
- Nested queries: [media-queries/14-nested-queries.md](media-queries/14-nested-queries.md) explains composing multiple media and container query prefixes together.

## Required Workflow

1. Identify which media-query feature is needed.
2. Read the relevant media-query reference file before writing classes for that feature.
3. Remember that unprefixed breakpoints are container queries and `@`-prefixed breakpoints are viewport media queries.
4. Add `cnt` to the relevant container ancestor when using container queries that require a containment context.
5. Use only documented Maple query keys, prefixes, modifiers, operators, and examples.

## Core Syntax Reminder

Maple media queries use this format:

```txt
{prefix}{modifier}{query}{operator}{value}
```

The media-query segment appears before the selector and utility segments in the full Maple class format:

```txt
{media-query}:{selector}:{utility}
```
