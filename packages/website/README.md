# Documentation website

Docusaurus static site, styled to match [git-dedup](https://git-dedup.ben3d.ca) and [clidoc](https://clidoc.dev).

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm docs:build
pnpm docs:serve
```

The development and production commands generate `docs/api` from the library's public entry point using TypeDoc and typedoc-plugin-markdown. Edit TSDoc comments in `packages/tanstack-router-ga4/src` to update the API reference. Generated API Markdown, `.docusaurus`, and `build` are ignored. Restart the dev server after changing API comments to regenerate the reference.

The production build checks broken links and emits static files to `packages/website/build`. GitHub Actions uploads that directory with `actions/upload-pages-artifact` and deploys with `actions/deploy-pages` on pushes to main or a manual run from main. Pull request CI builds the site without deploying.

## Hosting migration

The new site targets <https://bhouston.github.io/tanstack-router-ga4/>. Enable **Settings → Pages → Source → GitHub Actions** once before the first deployment. There is deliberately no CNAME or DNS migration. The Cloud Run deployment workflows and Dockerfile have been removed; this does not delete or update the already-running service at <https://tanstack-router-ga4.ben3d.ca>. Its domain and deployed revision remain in place until a separate migration.

`packages/analytics-fixture` is a browser test harness for the library, not a deployed website. Its Playwright tests stub gtag.js and block collection requests so testing does not submit production analytics.
