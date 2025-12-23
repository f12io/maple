# Tree-shaking & Feature Modules

Import specific features to keep bundle small. Example:
```js
import { spacingMatcher } from 'runtime-tailwind-ts/dist/index.esm.js';
```
Or (when published) import directly:
```js
import { spacingMatcher } from 'runtime-tailwind-ts/features/spacing';
```
