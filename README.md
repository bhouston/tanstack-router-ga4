# tanstack-router-ga4

[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![Tests][tests-badge]][tests-url]
[![Coverage][coverage-badge]][coverage-url]
[![Demo Site][demo-badge]][demo-url]

[Google Analytics (GA4)](https://marketingplatform.google.com/about/analytics/) integration for [TanStack Router](https://tanstack.com/router) and [TanStack Start](https://tanstack.com/start), built for modern React apps that need reliable analytics with minimal setup.

Live demo: [tanstack-router-ga4.ben3d.ca](https://tanstack-router-ga4.ben3d.ca)

See [packages/tanstack-router-ga4/README.md](packages/tanstack-router-ga4/README.md) for full documentation.

## Development

This repo contains the library and a TanStack Start demo:

- **Library:** `packages/tanstack-router-ga4`
- **Demo:** `packages/example-website`

```bash
pnpm install
pnpm dev
pnpm tsc
pnpm build
pnpm lint # oxlint
pnpm lint:fix
pnpm format # oxfmt
pnpm test # typecheck + unit tests
pnpm test:e2e # playwright demo E2E tests
```

Before submitting changes, follow [CONTRIBUTING.md](CONTRIBUTING.md): open an issue first, branch from `main`, and target `main` in your PR. Releases are triggered manually by the maintainer via `gh workflow run release.yml --ref main`; see the guide for maintainer setup and [CHANGELOG.md](CHANGELOG.md) for release history. For E2E tests, run `pnpm exec playwright install chromium` then `pnpm test:e2e`.

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
