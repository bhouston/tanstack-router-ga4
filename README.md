# tanstack-router-ga4

[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![Tests][tests-badge]][tests-url]
[![Coverage][coverage-badge]][coverage-url]

Google Analytics (GA4) integration for [TanStack Router](https://tanstack.com/router) and [TanStack Start](https://tanstack.com/start), built for modern React apps that need reliable analytics with minimal setup.

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

Mount the component in your app (e.g. root layout) so every route gets automatic page views, and use the hook for custom events:

```tsx
import { GoogleAnalytics, useGoogleAnalytics } from "tanstack-router-ga4";

// In your root layout or app shell — automatic page_view on each route change
function RootLayout() {
  return (
    <html>
      <body>
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        <Outlet />
      </body>
    </html>
  );
}

// In any component — track custom events
function SignupForm() {
  const { trackEvent } = useGoogleAnalytics();

  const handleSubmit = () => {
    trackEvent("sign_up", { method: "email" });
  };

  return <button onClick={handleSubmit}>Sign up</button>;
}
```

User identity registration example (`user_id` + `user_properties`):

```tsx
import { useState } from "react";
import { GoogleAnalytics, useGoogleAnalytics } from "tanstack-router-ga4";

function AppShell() {
  const [gaUser, setGaUser] = useState<null | {
    id: string;
    email: string;
    username: string;
  }>(null);

  return (
    <>
      <GoogleAnalytics
        measurementId="G-XXXXXXXXXX"
        config={
          gaUser
            ? {
                user_id: gaUser.id,
                user_properties: {
                  email: gaUser.email,
                  username: gaUser.username,
                },
              }
            : undefined
        }
      />
      <RegisterUserButton onRegistered={setGaUser} />
    </>
  );
}

function RegisterUserButton({
  onRegistered,
}: {
  onRegistered: (user: { id: string; email: string; username: string }) => void;
}) {
  const { trackEvent } = useGoogleAnalytics();

  const handleRegisterUser = async () => {
    // Example API call to create a user account
    const user = await registerUser({ email: "ada@example.com", password: "secure-password" });

    // Register the current GA user so subsequent events can be associated
    onRegistered({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    // Optionally track completed registration
    trackEvent("sign_up", { method: "email" });
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
