# tanstack-router-ga4

[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![Tests][tests-badge]][tests-url]
[![Coverage][coverage-badge]][coverage-url]
[![Demo Site][demo-badge]][demo-url]

[Google Analytics (GA4)](https://marketingplatform.google.com/about/analytics/) integration for [TanStack Router](https://tanstack.com/router) and [TanStack Start](https://tanstack.com/start), built for modern React apps that need reliable analytics with minimal setup.

Live demo: [tanstack-router-ga4.benhouston3d.com](https://tanstack-router-ga4.benhouston3d.com)

## Features

- Automatically records `page_view` events on route changes
- Full TypeScript support for common GA4 events (`sign_up`, `generate_lead`, etc.) and custom events
- Supports all Google Analytics configuration options (for example `debug_mode` and `user_id`)
- Supports supports advanced features like user-session assocation, consents and queries (`get`.)
- Designed for TanStack Router and TanStack Start with correct behavior across client-side navigation and SSR
- Full test suite with unit/integration coverage and browser-based E2E tests

## Install

```sh
pnpm add tanstack-router-ga4
```

**Peer dependencies:** `react` (>=18), `@tanstack/react-router` (>=1).

## Usage

Mount the component in your app shell (for example a `RootDocument` or root layout) so every route gets automatic page views, and use the hook as a typed wrapper over the core `gtag` commands.

```tsx
import { HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GoogleAnalytics, useGoogleAnalytics } from "tanstack-router-ga4";

// In your root document — automatic page_view on each route change
function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// In any component — track custom events
function SignupForm() {
  const ga = useGoogleAnalytics();

  const handleSubmit = () => {
    const user = await registerUser({ email: "ada@example.com", password: "secure-password" });

    // associate user id with session
    ga.set({
      user_id: user.id,
      user_properties: {
        email: user.email,
        username: user.username,
      },
    });

    // send standard GA event for signups
    ga.event("sign_up", { method: "email" });
  };

  return <button onClick={handleSubmit}>Sign up</button>;
}
```

### Hook API

`useGoogleAnalytics()` exposes typed wrappers around the core `gtag` commands:

- `set(config)` for global config
- `config(measurementId, config?)` for per-stream config
- `event(name, params?)` for recommended and custom events
- `get(measurementId, fieldName, callback?)` for callback-based reads like `client_id`
- `consent('default' | 'update', params)` for consent mode updates

---

## Dvelopment

This repo contains the library and a TanStack Start demo:

- **Library:** `packages/tanstack-router-ga4`
- **Demo:** `packages/example-website`

```sh
pnpm install
pnpm build      # build library and example
pnpm dev        # library watch + example app (port 3000)
pnpm make-release   # publish package (builds, copies dist + root README, npm publish)
```

Publishing runs from the repo root and uses the root README as the package README.

---

## Testing

```sh
pnpm exec playwright install chromium
pnpm test       # run Vitest tests
```


## License

MIT

## Author

Created by [Ben Houston](https://benhouston3d.com) and sponsored by [Land of Assets](https://landofassets.com).

[npm]: https://img.shields.io/npm/v/tanstack-router-ga4
[npm-url]: https://www.npmjs.com/package/tanstack-router-ga4
[npm-downloads]: https://img.shields.io/npm/dw/tanstack-router-ga4
[npmtrends-url]: https://www.npmtrends.com/tanstack-router-ga4
[tests-badge]: https://github.com/bhouston/tanstack-router-ga4/workflows/Tests/badge.svg
[tests-url]: https://github.com/bhouston/tanstack-router-ga4/actions/workflows/test.yml
[coverage-badge]: https://codecov.io/gh/bhouston/tanstack-router-ga4/graph/badge.svg
[coverage-url]: https://codecov.io/gh/bhouston/tanstack-router-ga4
[demo-badge]: https://img.shields.io/badge/demo-live-0f172a
[demo-url]: https://tanstack-router-ga4.benhouston3d.com
