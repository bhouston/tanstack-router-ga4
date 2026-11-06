# Documentation website

Docusaurus static site, styled to match [mtlx](https://mtlx.ben3d.ca).

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm docs:build
pnpm docs:serve
```

The development and production commands generate `docs/api` from the library's public entry point using TypeDoc and typedoc-plugin-markdown. Edit TSDoc comments in `packages/tanstack-router-ga4/src` to update the API reference. Generated API Markdown, `.docusaurus`, and `build` are ignored. Restart the dev server after changing API comments to regenerate the reference.

The production build checks broken links and emits static files to `packages/docs/build`. GitHub Actions uploads that directory with `actions/upload-pages-artifact` and deploys with `actions/deploy-pages` on pushes to main or a manual run from main. Pull request CI builds the site without deploying.

## Hosting

The site is served at <https://tanstack-router-ga4.ben3d.ca> through GitHub Pages (Settings → Pages → Source → GitHub Actions). `static/CNAME` and the repository Pages custom domain both name that host. Set `SITE_URL` and `BASE_URL` to build for a different location.

`packages/analytics-fixture` is a browser test harness for the library, not a deployed website. Its Playwright tests stub gtag.js and block collection requests so testing does not submit production analytics.
