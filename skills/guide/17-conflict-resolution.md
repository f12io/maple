## Automatic Conflict Resolution

Atomic CSS makes styling easy to compose, but composition creates an ordering problem. A component may provide `p-4`, a caller may add `p-8`, a state branch may add `@md:p-6`, and an alias may expand to several utilities at once. If all of those classes remain in the DOM, the final visual result depends on CSS generation order, selector specificity, stylesheet layer order, and framework string-concatenation habits. That makes class strings harder to reason about than they appear.

In Tailwind and similar build-time utility systems, the common solution is a JavaScript helper such as `cn`, usually implemented with `clsx` for conditional class construction and `tailwind-merge` for conflict removal:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

That pattern works well inside JavaScript component code because every class list can be routed through one function before it reaches the DOM. It is less natural outside that paradigm. Server-rendered templates, CMS markup, WordPress themes, PHP, Rails, Django, static HTML, third-party widgets, and DOM mutations created after hydration do not automatically pass through a React-style helper. Each stack needs its own convention, and any missed class string can keep stale conflicts alive.

Maple moves that responsibility into the CSS engine. Whenever Maple processes an element, it reads the element's actual `class` attribute, parses each utility, and generates a conflict key from the emitted CSS property and its context. Later utilities win. Earlier utilities that would write the same property in the same media query and selector context are removed from the element's class attribute.

```html
<div class="p-4 p-8"></div>
<!-- Maple normalizes this to: class="p-8" -->

<div class="@md:p-4 @md:p-8"></div>
<!-- Maple normalizes this to: class="@md:p-8" -->

<div class="p-4 @md:p-8"></div>
<!-- Kept: the base context and @md context do not conflict. -->
```

This has two important effects:

- The DOM becomes the source of truth. You can append classes from templates, framework bindings, CMS fields, server-rendered markup, or direct DOM APIs, and Maple resolves the final class list after those classes exist on the element.
- The mental model stays local. When two utilities write the same thing in the same context, the one on the right is the one that survives.

Maple's merge model is property-aware rather than string-only:

- Exact duplicates collapse to the last occurrence: `p-4 p-4` becomes `p-4`.
- Shorthand utilities override earlier covered longhands, but earlier shorthands can still be refined by later longhands: `mx-4 m-6` becomes `m-6`, while `m-6 mx-4` stays `m-6 mx-4`.
- Original property names and abbreviations share the same conflict space: `p-4 padding-6` becomes `padding-6`.
- Media queries and selectors are part of the conflict key: `p-4 @md:p-4` stays as-is, while `&:hover:p-4 &:hover:p-8` becomes `&:hover:p-8`.
- Arbitrary values, custom values, and CSS variables still follow class order: `h-[10px] h-[20px]` becomes `h-[20px]`, and `--tone-factor=1 --tone-factor=2` becomes `--tone-factor=2`.
- Important utilities conflict with other important utilities, and they suppress earlier normal utilities for the same property: `!p-3 !p-4` becomes `!p-4`, `p-3 !p-4` becomes `!p-4`, and `!p-3 p-4` stays `!p-3 p-4`.
- Composable CSS features are merged by component, not by the final serialized property. For example, transform and filter utilities such as `tl-4 rot-45` or `blur-4 brightness-100` can coexist, while `tl-4 tl-8` resolves to `tl-8`.
- Aliases expand before merge checks. If `@focus-ring` expands to `olw-2px;olst=solid;olc=currentColor`, then `@focus-ring olw-4px` keeps `@focus-ring olw-4px` because the alias still contributes outline style and color, but its `olw-2px` member is overridden by `olw-4px`.

Maple also handles CSS shorthand relationships carefully. A later broad shorthand can remove earlier covered utilities, but Maple avoids false positives for properties that share a prefix without actually overriding each other. For example, `br-px rad-px`, `fx-1 fxdir=row`, `of=hidden ofwr=anywhere`, and `cols-1 col-2` are kept because those pairs target distinct CSS behavior.

This changes the usual utility-class architecture. React applications using Maple do not need a `cn`-style merge helper for conflict resolution. They may still use helpers for conditional string construction, variants, or ergonomics, but correctness no longer depends on funneling every class through a JavaScript merge function. The same conflict resolution applies in non-JavaScript-first environments, where adding a package-level class merging convention would otherwise be difficult or impossible without extra runtime code.
