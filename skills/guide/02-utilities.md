## Syntax Reference and Utilities

This is the central reference file for Maple utility syntax. Read the relevant utility reference file before writing classes for that feature.

Do not guess Maple utilities from Tailwind, Bootstrap, UnoCSS, plain CSS property guesses, or other utility systems. Use only documented Maple syntax from these files.

## Utility Reference Files

- Core syntax and utility format: [utilities/00-syntax-and-format.md](utilities/00-syntax-and-format.md) explains the `{media-query}:{selector}:{utility}` structure and the `{property}-{value}` / `{property}={value}` utility forms.
- Color property resolution: [utilities/01-color-property-resolution.md](utilities/01-color-property-resolution.md) explains color fallback chains, OKLCH manipulation, tones, alpha suffixes, and the difference between base colors and tone variants.
- Number property resolution: [utilities/02-number-property-resolution.md](utilities/02-number-property-resolution.md) explains numeric values, token-based string values, opacity handling, and negative value syntax.
- Unit shorthand resolution: [utilities/03-unit-shorthand-resolution.md](utilities/03-unit-shorthand-resolution.md) explains one-unit shorthands like `px` and `rem`, plus cover shorthands like `%`, `vh`, and `dvh`.
- Custom property resolution: [utilities/04-custom-property-resolution.md](utilities/04-custom-property-resolution.md) explains how non-color and non-number properties resolve through Maple fallback chains.
- Alias resolution: [utilities/05-alias-resolution.md](utilities/05-alias-resolution.md) explains built-in aliases, root-level custom aliases, alias composition, and alias merge behavior.
- Reserved values: [utilities/06-reserved-values.md](utilities/06-reserved-values.md) lists values Maple treats as literal CSS values instead of variable fallback tokens.
- Setting values directly: [utilities/07-setting-values-directly.md](utilities/07-setting-values-directly.md) explains literal `=` values, bracket syntax, and special-character handling.
- Important modifier: [utilities/08-important-modifier.md](utilities/08-important-modifier.md) explains Maple's `!important` prefix and suffix forms.
- Dynamic values: [utilities/09-dynamic-values.md](utilities/09-dynamic-values.md) explains ephemeral `$$` classes for frequently changing runtime values.

## Required Workflow

1. Identify which utility feature is needed.
2. Read the relevant utility reference file before writing classes for that feature.
3. Use token form, literal form, bracket form, CSS variable utilities, aliases, important modifiers, and dynamic values only as documented in the reference files.
4. If a semantic token is used, make sure it is already defined in the surrounding code or define it with Maple CSS variable utilities.
5. Prefer documented Maple utilities and examples over invented class names.
