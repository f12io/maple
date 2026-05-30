## Media Queries

Maple is a container query first CSS engine. This means that by default, all media queries are container queries. You can use `@` symbol to define a viewport media query.

**Format:** `{prefix}{modifier}{query}{operator}{value}`

- `{prefix}`: Optional. `@` for viewport media queries (`@media`). Default is container query (`@container`).
- `{modifier}`: Optional. `not-` to negate the query.
- `{query}`: The specific media query key (e.g., `md`, `dark`, `mnw`, `style`).
- `{container-name}`: Optional. For container queries, specify the container name in parentheses before the colon or operator, e.g., `md(sidebar)`.
- `{operator}`: Optional. `=` for equality, `!=` for inequality.
- `{value}`: Optional. The value for the query.
