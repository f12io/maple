# 🍁 Maple

**Maple** is a **runtime utility-first CSS engine**.
Instead of precompiling styles, Maple generates styles **on demand at runtime** by converting utility-like class strings into CSS property maps.

Maple is designed to be:

- ⚡ Runtime & lightweight
- 🧩 Framework-agnostic
- 🎛️ CSS-variable–driven
- 🧪 Fully testable

---

## ✨ Core Idea

Maple parses utility strings like:

```
src/
 ├─ config/                 # Global config & tokens
 │
 ├─ core/                   # Runtime engine (framework-agnostic)
 │   ├─ bootstrap.ts        # Public entry / initialization
 │   ├─ generator.ts        # Generates CSS rules & tokens
 │   ├─ observer.ts         # MutationObserver runtime
 │   ├─ parser.ts           # Utility string parser
 │   ├─ registry.ts         # Utility matcher registry
 │   ├─ stylesheet.ts      # StyleSheet injection & management
 │   └─ types.ts            # Shared core types
 │
 ├─ engines/                # Pluggable utility engines
 │   └─ maple/              # Default Maple engine
 │       ├─ index.ts        # Engine entry point
 │       ├─ matcher.ts      # Pattern matching logic
 │       ├─ register.ts     # Registers utilities into registry
 │       ├─ predefined-utility-map.ts
 │       ├─ property-extraction.ts
 │       ├─ properties-short-map.ts
 │       ├─ properties-word-short-map.ts
 │       └─ properties-weight-map.ts
```

### Core vs Engine

- **core/** contains the runtime system (observer, parser, registry, stylesheet)
- **engines/** define how utilities are interpreted and mapped to CSS
- Multiple engines can coexist and be registered i

And turns them into **CSS property objects**:

```ts
{
  padding: 'var(--padding-4, var(--base-4, 1rem))';
}
```

This makes Maple ideal for:

- Runtime style engines
- Design systems
- Headless UI libraries
- CSS-in-JS alternatives

---

## 📦 Installation

```bash
npm install maple
```

or

```bash
pnpm add maple
```

---

## 🚀 Usage

### Runtime DOM Observer (Recommended for Apps)

Maple can run as a **runtime DOM observer** that automatically converts utility classes into generated tokens whenever the DOM changes.

This is ideal for:

- SPA frameworks (React, Vue, Solid)
- Dynamic components
- Client-side rendering

> ⚠️ This API must be called from the **library entry**, not inside components.

#### Example

```ts
import { startObserver } from 'maple';
import { registerMaple } from 'maple/engines/maple';

registerMaple();
startObserver();
```

Once started, Maple will:

- Observe the entire document
- Detect added or changed `class` attributes
- Generate runtime style tokens
- Append generated tokens back to the element

```html
<div class="p-4 bgc-blue-600"></div>
```

⬇️ Automatically becomes:

```html
<div class="p-4 bgc-blue-600 maple-xyz123"></div>
```

No build step. No pre-scan. Fully runtime.

---

### 1️⃣ Register Maple

Register the engine once before resolving utilities:

```ts
import { registerMaple } from 'maple/engines/maple';

registerMaple();
```

---

### 2️⃣ Resolve a Utility

```ts
import { findMatch } from 'maple/core/registry';

const styles = findMatch('px-2');
```

Result:

```ts
{
  "padding-left": "var(--padding-2, var(--base-2, 0.5rem))",
  "padding-right": "var(--padding-2, var(--base-2, 0.5rem))"
}
```

---

## 🧠 Utility Syntax

Maple utilities follow a structured DSL:

```
[prefix]-[value]
[prefix]-[axis]-[value]
[prefix]=[raw-value]
```

### Examples

| Utility        | Description          |
| -------------- | -------------------- |
| `p-4`          | Padding              |
| `px-2`         | Padding left & right |
| `fs-lg`        | Font size            |
| `fw-700`       | Font weight          |
| `lh=1.25`      | Raw line-height      |
| `bgc-blue-600` | Background color     |
| `scale-1.05`   | Transform scale      |

---

## 📐 Spacing & Sizing

```txt
p-4        → padding
m-1        → margin
w-10       → width
h-10       → height
size-10    → width + height
```

Viewport-based utilities:

```txt
w-svw → width: 100svw
h-dvh → height: 100dvh
```

---

## ✍️ Typography

```txt
fs-lg      → font-size
fs-4       → numeric font-size
fw-bold    → font-weight
fw-700     → numeric font-weight
lh-tight   → line-height
lh=1.25    → raw line-height
```

---

## 🎨 Colors

```txt
c-red-500      → color
bgc-blue-600  → background-color
bc-gray-300   → border-color
```

Uses modern **OKLCH** color defaults with CSS variable fallbacks.

---

## 🧱 Borders

```txt
b-2        → border
bw-2       → border-width
bs-dashed  → border-style
br-lg      → border-radius
```

---

## 📐 Layout & Position

```txt
d-flex
d-grid
fd-column
ai-center
jc-space-between

pos-relative
t-3
```

---

## 🌫 Effects

```txt
o-0.5        → opacity
shadow-md   → box-shadow
```

---

## 🔄 Transforms

Maple composes transforms using CSS variables.

### Scale

```txt
scale-1.05
scale-x-1.05
```

### Translate

```txt
translate-2
translate-y-2
translate-z-2
```

### Skew

```txt
skew-2
skew-x-2
```

### Rotate

```txt
rotate-2
rotate-x-2
```

Transforms are safely composed into a single `transform` property using variables.

---

## 🧪 Testing

Maple uses **Vitest** with table-driven tests:

```ts
it.each(cases)('$name', ({ input, expected }) => {
  expect(findMatch(input)).toEqual(expected);
});
```

This ensures deterministic output and easy extensibility.

---

## 🧩 Architecture

Maple is split into **core runtime infrastructure** and **engine-specific implementations**.

```
src/
 ├─ engines/
 │   └─ maple.ts      # Utility registration
 ├─ core/
 │   └─ registry.ts   # Pattern matching & resolution
 └─ config/
     └─ tokens.ts     # Base scales & defaults
```

---

## 📄 License

MIT © Maple

---

## 🌱 Why “Maple”?

Maple is lightweight, flexible, and naturally composable — just like its name 🍁
