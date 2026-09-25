# Releasing

This document covers release-only and one-time maintainer setup for `tanstack-router-ga4`. Day-to-day contribution workflow lives in [CONTRIBUTING.md](CONTRIBUTING.md); development setup lives in [README.md](README.md).

## Coverage and size gates

`pnpm test` includes type checking and enforces coverage gates: 95% lines/statements/functions and 90% branches.

`pnpm size` measures the minified, gzipped library (peer dependencies excluded) against the budget in `.size-limit.json`.

Audit failures (`pnpm audit --audit-level high`) produce a CI warning for review; they do not block unrelated work. Codecov reporting is supplementary; coverage thresholds are enforced locally and in CI even if uploading fails.

## Release process

Merging a PR into `main` never publishes; it only runs CI. When ready to publish, the maintainer manually dispatches the release workflow against `main`:

```sh
gh workflow run release.yml --ref main
```

`release.yml` rejects dispatches against any ref other than `refs/heads/main`, then runs the CI checks before Semantic Release computes the next version, creates a tag and GitHub release, and publishes using npm OIDC trusted publishing. A dispatch with no release-worthy commits since the last release succeeds without publishing anything. Pass `dry_run: true` (`gh workflow run release.yml --ref main -f dry_run=true`) to preview the computed version and changelog without publishing or tagging. The historical `v1.6.0` tag is required to prevent accidentally restarting at version 1.0.0.

Do not bump versions manually or publish from a workstation. `pnpm release:prepare` only builds and stages the package in the ignored `publish` directory; it never publishes. Semantic Release updates the staged package version. The checked-in package version is a development baseline, not the current registry version; tags and npm are authoritative. Generated notes accumulate on the [GitHub Releases page](https://github.com/bhouston/tanstack-router-ga4/releases), which is the changelog of record. No generated release commits are pushed back into `main`.

## One-time maintainer setup

- `main` is the integration branch and repository default. PRs target it, and issue-closing keywords take effect when merged there.
- Protect `main`: require PRs and the `Unit`, `E2E`, and `Contribution policy` checks. Allow merge commits only; disable squash and rebase merges. Restrict direct pushes; the release job only needs to create tags and releases, triggered manually via `workflow_dispatch`.
- The historical `v1.6.0` baseline tag points to `960ea71540bb5e4915589fb60b1bb2de89db2549`, verified against the published JavaScript. npm's recorded `gitHead` points to an older version; do not move the baseline to that commit. The release workflow checks that the baseline tag exists.
- In npm's `tanstack-router-ga4` package settings, configure a GitHub Actions trusted publisher with owner `bhouston`, repository `tanstack-router-ga4`, and workflow filename `release.yml` (no environment). See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/). No `NPM_TOKEN` secret is used. Configure this before the first release merge.
- Enable GitHub private vulnerability reporting. Configure `CODECOV_TOKEN` if required by the Codecov account; coverage gating does not depend on it.

## Reusing this workflow

After the first successful issue → PR → release cycle, copy this guide, issue/PR templates, commitlint config, Husky hook, release config, and CI workflows into a dedicated template repository. Adapt package paths, repository URLs, runtime, coverage and size budgets, and release baseline per project. Do not copy this repository's deployment credentials or baseline tag. Mark that separate repository as a GitHub template after validation. This repository remains the library repository.
