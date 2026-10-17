# tanstack-router-ga4

[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![Tests][tests-badge]][tests-url]
[![Coverage][coverage-badge]][coverage-url]
[![Demo Site][demo-badge]][demo-url]
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-5865F2?logo=discord&logoColor=white)][discord-url]

[Google Analytics (GA4)](https://marketingplatform.google.com/about/analytics/) integration for [TanStack Router](https://tanstack.com/router) and [TanStack Start](https://tanstack.com/start), built for modern React apps that need reliable analytics with minimal setup.

Documentation: [GitHub Pages](https://bhouston.github.io/tanstack-router-ga4/). The existing [Cloud Run demo](https://tanstack-router-ga4.ben3d.ca) remains available during the transition.

See [packages/tanstack-router-ga4/README.md](packages/tanstack-router-ga4/README.md) for full documentation.

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

Before submitting changes, follow [CONTRIBUTING.md](CONTRIBUTING.md): open an issue first, branch from `main`, and target `main` in your PR. See [RELEASING.md](RELEASING.md) for coverage/size gates, the release process, and one-time maintainer setup, and the [GitHub Releases page](https://github.com/bhouston/tanstack-router-ga4/releases) for release history.

## License

MIT

## Author

Created by [Ben Houston](https://ben3d.ca) and sponsored by [Land of Assets](https://landofassets.com).

[npm]: https://img.shields.io/npm/v/tanstack-router-ga4
[npm-url]: https://www.npmjs.com/package/tanstack-router-ga4
[npm-downloads]: https://img.shields.io/npm/dw/tanstack-router-ga4
[npmtrends-url]: https://www.npmtrends.com/tanstack-router-ga4
[tests-badge]: https://github.com/bhouston/tanstack-router-ga4/actions/workflows/ci.yml/badge.svg
[tests-url]: https://github.com/bhouston/tanstack-router-ga4/actions/workflows/ci.yml
[coverage-badge]: https://codecov.io/gh/bhouston/tanstack-router-ga4/graph/badge.svg
[coverage-url]: https://codecov.io/gh/bhouston/tanstack-router-ga4
[demo-badge]: https://img.shields.io/badge/demo-live-0f172a
[demo-url]: https://tanstack-router-ga4.ben3d.ca
[discord-url]: https://discord.gg/fwupDN493R
