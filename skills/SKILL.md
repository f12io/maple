---
name: Maple CSS Engine
description: A variable-first, stack-agnostic runtime CSS engine for building responsive interfaces.
license: ROOT - https://rootsrc.org
metadata:
  author: f12.io
  version: '2.0.0'
---

# Maple CSS Skill

This is the entry point for AI assistants using Maple. Maple is a variable-first, stack-agnostic runtime CSS engine.

Do not guess Maple classes from Tailwind, Bootstrap, UnoCSS, or other utility systems. When writing Maple classes, first read the relevant reference file below and follow the syntax documented there.

## Reference Files

- Overview, quick start, and core concepts: [guide/01-overview.md](guide/01-overview.md)
- Syntax reference and utilities: [guide/02-utilities.md](guide/02-utilities.md)
- Selectors: [guide/03-selectors.md](guide/03-selectors.md)
- Media queries: [guide/04-media-queries.md](guide/04-media-queries.md)
- Usage guide introduction: [guide/00-usage-guide.md](guide/00-usage-guide.md)
- Borders: [guide/05-borders.md](guide/05-borders.md)
- Transforms: [guide/06-transforms.md](guide/06-transforms.md)
- Transitions: [guide/07-transitions.md](guide/07-transitions.md)
- Filters: [guide/08-filters.md](guide/08-filters.md)
- Gradients: [guide/09-gradients.md](guide/09-gradients.md)
- Shadows: [guide/10-shadows.md](guide/10-shadows.md)
- Grid layout: [guide/11-grid-layout.md](guide/11-grid-layout.md)
- CSS variables: [guide/12-css-variables.md](guide/12-css-variables.md)
- Animations: [guide/13-animations.md](guide/13-animations.md)
- Flex layout: [guide/14-flex-layout.md](guide/14-flex-layout.md)
- Combining features: [guide/15-combining-features.md](guide/15-combining-features.md)
- Automatic conflict resolution: [guide/16-conflict-resolution.md](guide/16-conflict-resolution.md)
- Configuration, refs, nomerge, and breakpoints: [guide/17-configuration.md](guide/17-configuration.md)
- Best practices and component-library guidance: [guide/18-best-practices.md](guide/18-best-practices.md)
- Abbreviations reference: [guide/19-abbreviations-reference.md](guide/19-abbreviations-reference.md)

If an abbreviation exists in the abbreviations reference, Maple can also use the camelCase version of that CSS property.

## Required Workflow

1. Identify the Maple feature needed for the user request.
2. Read the relevant reference file before writing classes for that feature.
3. Use only documented Maple syntax.
4. If a semantic token is used, make sure it is already defined in the surrounding code or define it with Maple CSS variable utilities.
5. Prefer documented Maple utilities and examples over invented class names.

## Core Syntax Reminder

Maple class names are composed as:

```txt
{media-query}:{selector}:{utility}
```

The media query and selector parts are optional. Utilities can use token resolution, literal values, bracket values, CSS variable utilities, aliases, important modifiers, dynamic values, and feature-specific serializers as documented in the reference files.

The utility consists of a property name and a value separated by a hyphen or equal sign. All camelCase CSS properties are supported (e.g. `accentColor`). Some properties have shorthand versions (e.g. `bgc` for `backgroundColor`). See the list of shorthand versions in [guide/20-abbreviations-reference.md](guide/20-abbreviations-reference.md). If a property does not have a shorthand version, use the camelCase version of that property.
