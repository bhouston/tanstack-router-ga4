# Releasing

Releases are manual and maintainer-only. Merging to `main` never publishes.

## Running a Release

```sh
gh workflow run release.yml --ref main                  # release
gh workflow run release.yml --ref main -f dry_run=true  # preview only, publishes nothing
```

When there are no release-worthy commits since the last `v*` tag, the run is a no-op.

## What the Workflow Does

1. Refuses any ref other than `main`.
2. Runs the full CI workflow on the dispatched commit.
3. Stops if `main` has moved since the dispatch.
4. Installs, builds, and runs `pnpm release`, which is semantic-release.
5. semantic-release computes the next version, creates the `v<version>` tag and GitHub Release, and publishes.

Releases run one at a time and never cancel a publish in progress. npm packages publish through npm trusted publishing (GitHub OIDC), so no `NPM_TOKEN` is stored.

## Versioning

The version comes from the Conventional Commits since the last `v*` tag. The highest change wins:

- `feat` produces a minor release.
- `fix` and `perf` produce a patch release.
- `!` or a `BREAKING CHANGE:` footer produces a major release.
- Other types do not trigger a release.

Everything this repository publishes shares one version. `package.json` versions in source are development snapshots; the Git tag and the registry hold the released version. [GitHub Releases](https://github.com/bhouston/tanstack-router-ga4/releases) is the changelog of record.

## One-Time Setup

1. On npmjs.com, open each package's Trusted Publisher settings, choose GitHub Actions, and enter organization or user `bhouston`, repository `tanstack-router-ga4`, workflow filename `release.yml`, and environment name `npm`.
2. Protect `main`: require pull requests and the CI checks, allow merge commits, and block force pushes and deletion.
3. If the repository uploads coverage to Codecov, add the `CODECOV_TOKEN` repository secret.

## Recovery

Publishing is not atomic. If a run fails part way, compare the registry versions, the `v<version>` tag, and the workflow log, then finish what is missing from the same release commit. If publishing succeeded but the GitHub Release failed, create the release from the existing tag. Never republish a version, delete a published version, or move a release tag. Resolve the failure before dispatching another release.

## Repository Specifics

### Published Artifacts

- `tanstack-router-ga4` on npm, built from `packages/tanstack-router-ga4`. `@tanstack-router-ga4/docs` and `analytics-fixture` are private and never published.

### Required Checks

The `main` protection requires the `ci` and `contribution` checks.

### Thresholds

`pnpm test --coverage` enforces 95% lines, statements, and functions and 90% branches. `pnpm size` enforces a 1 kB gzipped limit on `packages/tanstack-router-ga4/dist/index.js` (`.size-limit.json`), excluding the `react`, `react/jsx-runtime`, and `@tanstack/react-router` peers. `pnpm audit --audit-level=high` is advisory in CI: it warns but does not fail the run. Explain any intentional threshold change in the PR.

### Website

The documentation site at <https://tanstack-router-ga4.ben3d.ca> deploys to GitHub Pages from `pages.yml` on every push to `main` and on manual dispatch. It is independent of releases. Pages must use Settings → Pages → Source → GitHub Actions, with the custom domain `tanstack-router-ga4.ben3d.ca`; see `packages/docs/README.md`.
