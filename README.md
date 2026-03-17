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
- Supports Google Analytics configuration options (for example `debug_mode` and `user_id`)
- Supports user registration flows with typed tracking helpers
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
    ga.event("sign_up", { method: "email" });
  };

  return <button onClick={handleSubmit}>Sign up</button>;
}
```

User identity registration example (`user_id` + `user_properties`):

```tsx
import { HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GoogleAnalytics, useGoogleAnalytics } from "tanstack-router-ga4";

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

function AccountPage() {
  return <RegisterUserButton />;
}

function RegisterUserButton() {
  const ga = useGoogleAnalytics();

  const handleRegisterUser = async () => {
    // Example API call to create a user account
    const user = await registerUser({ email: "ada@example.com", password: "secure-password" });

    // Update global GA params for subsequent events
    ga.set({
      user_id: user.id,
      user_properties: {
        email: user.email,
        username: user.username,
      },
    });

    // Optionally track completed registration
    ga.event("sign_up", { method: "email" });
  };

  return <button onClick={handleRegisterUser}>Register user in GA</button>;
}
```

Optional config (e.g. `debug_mode`, `user_id`):

```tsx
<GoogleAnalytics
  measurementId="G-XXXXXXXXXX"
  config={{ debug_mode: true }}
/>
```

Optional consent defaults:

```tsx
<GoogleAnalytics
  measurementId="G-XXXXXXXXXX"
  consentDefaults={{
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 2000,
  }}
/>
```

### Hook API

`useGoogleAnalytics()` exposes typed wrappers around the core `gtag` commands:

- `event(name, params?)` for recommended and custom events
- `config(measurementId, config?)` for per-ID settings
- `set(params)` for global params
- `get(measurementId, fieldName, callback?)` for callback-based reads like `client_id`
- `consent('default' | 'update', params)` for consent mode updates

### SPA notes

- Repeated `config()` calls in SPAs should generally include `send_page_view: false` to avoid duplicate automatic page views.
- Use `set()` for session-wide values like a logged-in `user_id` when you want to avoid repeating the measurement ID.
- Runtime `config()` updates may be ignored if your GA4 stream has "Ignore duplicate instances of on-page configuration" enabled.
- Use `consentDefaults` on `GoogleAnalytics` when consent defaults must be applied before the initial `js` and `config` calls, then use `consent("update", ...)` after the user responds to your consent UI.

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
