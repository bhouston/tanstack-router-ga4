<p align="center">
  <a href="https://npmjs.com/package/tanstack-router-ga4"><img src="https://img.shields.io/npm/v/tanstack-router-ga4.svg" alt="npm package"></a>
  <a href="https://www.npmtrends.com/tanstack-router-ga4"><img src="https://img.shields.io/npm/dw/tanstack-router-ga4.svg" alt="npm downloads"></a>
  <a href="https://codecov.io/gh/bhouston/tanstack-router-ga4"><img src="https://codecov.io/gh/bhouston/tanstack-router-ga4/branch/main/graph/badge.svg" alt="coverage"></a>
  <a href="https://discord.gg/fwupDN493R"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
  <a href="https://bhouston.github.io/tanstack-router-ga4/"><img src="https://img.shields.io/badge/docs-read-blue?style=flat" alt="documentation"></a>
</p>
<br/>

# tanstack-router-ga4

> Google Analytics (GA4) for TanStack Router and TanStack Start.

- 🧭 Automatic Page Views
- 🔷 Typed GA4 Event Helpers
- 💤 Deferred Script Loading
- 🚀 TanStack Start and SSR Ready
- 🔒 Consent Mode Support
- 🪶 Under 1 KB Gzipped

[Google Analytics (GA4)](https://marketingplatform.google.com/about/analytics/) integration for [TanStack Router](https://tanstack.com/router) and [TanStack Start](https://tanstack.com/start), built for modern React apps that need reliable analytics with minimal setup. Mount one `GoogleAnalytics` component in your root layout and every route change records a `page_view`; use the `useGoogleAnalytics` hook for typed `set`, `config`, `event`, `get`, and `consent` calls.

[Read the Docs to Learn More](https://bhouston.github.io/tanstack-router-ga4/).

Live demo: [tanstack-router-ga4.ben3d.ca](https://tanstack-router-ga4.ben3d.ca). See [packages/tanstack-router-ga4/README.md](packages/tanstack-router-ga4/README.md) for install and usage.

## Development

This repo contains the library, a static Docusaurus documentation website, and a browser test fixture:

- **Library:** `packages/tanstack-router-ga4`
- **Website:** `packages/website` (guides, examples, and generated API reference)
- **Analytics test fixture:** `packages/analytics-fixture` (Vite + TanStack Router, not deployed)

```bash
pnpm install
pnpm dev # documentation dev server
pnpm tsc
pnpm build
pnpm lint # oxlint
pnpm lint:fix
pnpm format # oxfmt
pnpm test # library unit tests
pnpm test:e2e # analytics fixture and documentation browser tests
```

For E2E tests, run `pnpm build` and `pnpm exec playwright install chromium` first, then `pnpm test:e2e`. The test harness uses ports 3100 and 3101 by default; `PLAYWRIGHT_PORT` changes the fixture port and documentation uses the next port.

See [website development and hosting](packages/website/README.md) for API generation and GitHub Pages setup. The previous Cloud Run deployment workflows have been removed; the running service and its DNS are unchanged.

Before submitting changes, follow [CONTRIBUTING.md](CONTRIBUTING.md): open an issue first, branch from `main`, and target `main` in your PR.

## Releases

See [RELEASING.md](RELEASING.md) for how releases are published and [GitHub Releases](https://github.com/bhouston/tanstack-router-ga4/releases) for changes.

## Contribution

See [Contributing Guide](CONTRIBUTING.md).

## License

MIT

## Author

[Ben Houston](https://ben3d.ca), Sponsored by [Land of Assets](https://landofassets.com).
