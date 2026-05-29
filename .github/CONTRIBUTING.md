# Contributing to Maple

Thanks for taking the time to improve Maple. This guide keeps the project workflow predictable for contributors and maintainers.

## Development Setup

Use Node.js 24, which matches the release workflow.

```sh
npm ci
```

Useful commands:

```sh
npm run lint
npm test
npm run build
```

For local development with the example app:

```sh
npm run dev
```

## Pull Requests

- Work from a feature or fix branch created from `main`.
- Keep changes focused on one concern.
- Add or update tests when behavior changes.
- Run lint, tests, and build before opening a pull request. When ready open a PR to `main`.
- Do not commit generated release artifacts unless the change specifically requires it.

Recommended pre-PR check:

```sh
npm run lint
npm test
npm run build
```

## Commit Style

Use a lightweight Conventional Commits style:

Good examples:

```text
test: add media query parser coverage
fix: correct color alpha serialization
chore: update release workflow validation
```

## Release Cycle

Releases are cut from `main` with npm's version command through the project release script.

Before releasing, make sure all intended changes have already landed on remote `main`.

```sh
git checkout main
git pull --ff-only origin main
npm run release -- patch
```

You can also release an explicit version:

```sh
npm run release -- 2.0.1
```

The release script runs:

```sh
npm version <version>
git push origin main --follow-tags
```

The `preversion` lifecycle script runs before npm creates the version commit and tag. It requires:

- current branch is `main`
- working tree is clean
- local `main` exactly matches `origin/main`
- lint passes
- tests pass
- build passes

After the version commit and tag are pushed, the GitHub release workflow validates the tag again before publishing. It requires:

- tag is semver-shaped, such as `v2.0.1`
- tag points to current `origin/main` HEAD
- tag is the latest semver tag on `main`
- tag version matches `package.json`
- `package-lock.json` versions match `package.json`
- package artifacts and npm package contents are present

If validation passes, the workflow creates a draft GitHub Release with assets, publishes to npm, then publishes the GitHub Release.

## Failed Releases

If the workflow fails before npm publish, check whether a draft GitHub Release was created for the tag. Delete or update that draft before retrying from a corrected commit.

If npm publish succeeds but the final GitHub Release publish step fails, do not create a new npm version just to retry the GitHub Release. Publish the existing draft release for the already-published tag:

```sh
gh release edit v2.0.1 --draft=false --latest
```

## Reporting Issues

When opening an issue, include:

- Maple version
- browser/runtime environment
- minimal reproduction
- expected behavior
- actual behavior

Small reproductions make fixes much faster.
