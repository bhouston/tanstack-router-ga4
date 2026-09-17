# Contributing

These requirements apply to everyone submitting changes, including automated tools.

## Issue, branch, and pull request

1. **Create a GitHub issue before making changes** to explain the proposed change, why it is needed, acceptance criteria, and constraints. Use the [feature template](https://github.com/bhouston/tanstack-router-ga4/issues/new?template=feature.yml). If an issue already describes the work, use it instead of creating a duplicate.
2. Fetch the remote and **create your branch from `origin/main`**. Use `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, or `chore/<issue>-<slug>`. Never commit directly to `main`.
3. Implement the scoped change, preserve unrelated work, and run the checks below.
4. Push your branch and **open a PR targeting `main`**, with a Conventional Commit title, a description of the resulting behavior, validation results, and `Closes #<issue>`. Follow the PR template. Do not merge without maintainer approval.
5. Squash PRs into `main`, using the Conventional Commit PR title as the squash commit message. CI checks PR titles and issue references; local hooks check every new commit. Merging does not publish; see [Releases](#releases).

```sh
git fetch origin
git switch -c feature/42-batch-export origin/main
# implement and validate
git add <changed-files>
git commit -m "feat: add batch export" -m "Refs #42"
git push -u origin feature/42-batch-export
gh pr create --base main --title "feat: add batch export" --body-file /path/to/pr-body.md
```

## Commit messages

Use `type(scope): description`; the scope is optional. Types are `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, and `revert`. `feat` triggers a minor release; `fix` and `perf` trigger a patch release. Mark incompatible changes with `!` after the type/scope or a `BREAKING CHANGE:` footer to trigger a major release. Other types do not trigger releases unless marked breaking. Reference the issue in the body where helpful. Do not bypass Git hooks.

## Development and validation

Use Node from `.nvmrc` and the pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm test
pnpm size
pnpm exec playwright install chromium
pnpm test:e2e
pnpm audit --audit-level high
```

`pnpm test` includes type checking and coverage gates: 95% lines/statements/functions and 90% branches. `pnpm size` measures the minified, gzipped library with peer dependencies excluded against the budget in `.size-limit.json`. Audit failures produce a CI warning for review; they do not block unrelated work. Codecov reporting is supplementary; coverage thresholds are enforced locally and in CI even if uploading fails.

If another app uses port 3000, run `PLAYWRIGHT_PORT=3107 pnpm test:e2e`.

The library is in `packages/tanstack-router-ga4`; the demo is in `packages/example-website`. Preserve public API compatibility and TypeScript declarations. Commit dependency changes with `pnpm-lock.yaml`. Run `pnpm format` for formatting.

## Releases

Merging a PR into `main` never publishes; it only runs CI. When ready to publish, the maintainer manually dispatches the release workflow against `main`:

```sh
gh workflow run release.yml --ref main
```

`release.yml` rejects dispatches against any ref other than `refs/heads/main`, then runs the CI checks before Semantic Release computes the next version, creates a tag and GitHub release, and publishes using npm OIDC trusted publishing. A dispatch with no release-worthy commits since the last release succeeds without publishing anything. Pass `dry_run: true` (`gh workflow run release.yml --ref main -f dry_run=true`) to preview the computed version and changelog without publishing or tagging. The historical `v1.6.0` tag is required to prevent accidentally restarting at version 1.0.0.

Do not bump versions manually or publish from a workstation. `pnpm release:prepare` only builds and stages the package in the ignored `publish` directory; it never publishes. Semantic Release updates the staged package version. The checked-in package version is a development baseline, not the current registry version; tags and npm are authoritative. Generated notes accumulate in GitHub Releases, with a per-release changelog included in the package and attached as a release asset. No generated release commits are pushed back into `main`.

## One-time maintainer setup

- `main` is the integration branch and repository default. PRs target it, and issue-closing keywords take effect when merged there.
- Protect `main`: require PRs and the `Unit`, `E2E`, and `Contribution policy` checks. Allow squash merges. Restrict direct pushes; the release job only needs to create tags and releases, triggered manually via `workflow_dispatch`.
- The historical `v1.6.0` baseline tag points to `960ea71540bb5e4915589fb60b1bb2de89db2549`, verified against the published JavaScript. npm’s recorded `gitHead` points to an older version; do not move the baseline to that commit. The release workflow checks that the baseline tag exists.
- In npm’s `tanstack-router-ga4` package settings, configure a GitHub Actions trusted publisher with owner `bhouston`, repository `tanstack-router-ga4`, and workflow filename `release.yml` (no environment). See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/). No `NPM_TOKEN` secret is used. Configure this before the first release merge.
- Enable GitHub private vulnerability reporting. Configure `CODECOV_TOKEN` if required by the Codecov account; coverage gating does not depend on it.

## Reusing this workflow

After the first successful issue → PR → release cycle, copy this guide, issue/PR templates, commitlint config, Husky hook, release config, and CI workflows into a dedicated template repository. Adapt package paths, repository URLs, runtime, coverage and size budgets, and release baseline per project. Do not copy this repository’s deployment credentials or baseline tag. Mark that separate repository as a GitHub template after validation. This repository remains the library repository.
