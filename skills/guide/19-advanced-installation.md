# Advanced Installation

While the standard installation method for Maple is a drop-in `<script>` tag for the runtime engine, advanced users and package authors can leverage the module build of Maple.

## NPM Install

To use the Maple module build, install the package via npm (or your preferred package manager):

```bash
npm install @f12io/maple
```

## Exposed APIs

The module build of Maple (`@f12io/maple`) exposes several core functions and constants, allowing for deeper integration, custom runtime initialization, or custom tooling.

The following APIs are exported:

### Core Functions

- **`startRuntime`**: Initializes the Maple CSS engine runtime.
- **`parseClass`**: Parses a raw Maple utility class string into its constituent parts (media query, selector, property, value, etc.).
- **`buildRule`**: Generates complete CSS rule data (`RuleData`) from a raw utility class string.
- **`convert`**: Converts a raw class string into a CSS string, handling alias expansion and automatically inserting the generated rules into the active stylesheet.

### Types and Constants

- **Configuration Constants**: Various default settings and configurations (`core/constants/config`).
- **Dictionaries**: Standard Maple terminology, keywords, and CSS mappings (`core/constants/dictionaries`).
- **Regex Patterns**: Patterns for safely parsing classes and tokens (`core/constants/regex`).
- **Units**: Standard unit arrays and mappings (`core/constants/units`).
- **Types**: TypeScript interfaces and types for the internal structure, parsing logic, and configuration.

### Precalculated Maps

- **`PRECALCULATED_PROP_ABBREVIATIONS`**: A dictionary of shorthand property abbreviations used in Maple mapped to their full CSS properties.
- **`PRECALCULATED_PROP_TYPES`**: A dictionary that maps CSS properties to their expected serialization strategies and value constraints.
