<p align="center">
  <a href="https://npmjs.com/package/tanstack-router-ga4"><img src="https://img.shields.io/npm/v/tanstack-router-ga4.svg" alt="npm package"></a>
  <a href="https://www.npmtrends.com/tanstack-router-ga4"><img src="https://img.shields.io/npm/dw/tanstack-router-ga4.svg" alt="npm downloads"></a>
  <a href="https://codecov.io/gh/bhouston/tanstack-router-ga4"><img src="https://codecov.io/gh/bhouston/tanstack-router-ga4/branch/main/graph/badge.svg" alt="coverage"></a>
  <a href="https://discord.gg/fwupDN493R"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
  <a href="https://tanstack-router-ga4.ben3d.ca"><img src="https://img.shields.io/badge/docs-read-blue?style=flat" alt="documentation"></a>
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

[Read the Docs to Learn More](https://tanstack-router-ga4.ben3d.ca).

Live demo: [tanstack-router-ga4.ben3d.ca](https://tanstack-router-ga4.ben3d.ca). See the [repository](https://github.com/bhouston/tanstack-router-ga4) for the full project.

## Capabilities

- Automatically records `page_view` events on route changes
- Full TypeScript support for common GA4 events (`sign_up`, `generate_lead`, etc.) and custom events
- Supports all Google Analytics configuration options (for example `debug_mode` and `user_id`)
- Supports advanced features like user-session association, consents and queries (`get`)
- Deferred GA script injection by default: waits for the browser to be idle via `requestIdleCallback` before loading, improving initial page load performance. Pass `deferred={false}` to load immediately
- Designed for TanStack Router and TanStack Start with correct behavior across client-side navigation and SSR
- Full test suite with unit/integration coverage and browser-based E2E tests
- Ultra small bundles (minified/gzipped) to less than 1KB.

## Install

```sh
pnpm add tanstack-router-ga4
```

**Peer dependencies:** `react` (>=18), `@tanstack/react-router` (>=1).

## Usage

Mount the component in your app shell (for example a `RootDocument` or root layout) so every route gets automatic page views, and use the hook as a typed wrapper over the core `gtag` commands.

```tsx
import { HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { GoogleAnalytics, useGoogleAnalytics } from 'tanstack-router-ga4';

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

  const handleSubmit = async () => {
    const user = await registerUser({ email: 'ada@example.com', password: 'secure-password' });

    // associate user id with session
    ga.set({
      user_id: user.id,
      user_properties: {
        email: user.email,
        username: user.username,
      },
    });

    // send standard GA event for signups
    ga.event('sign_up', { method: 'email' });
  };

  return <button onClick={handleSubmit}>Sign up</button>;
}
```

### Deferred loading

By default, `GoogleAnalytics` delays GA script injection until the browser is idle using [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback). This moves analytics work out of the critical rendering path, improving Time to Interactive and other Core Web Vitals. On browsers that don't support `requestIdleCallback` (such as Safari) the script loads immediately so no data is lost.

To load GA immediately instead, pass `deferred={false}`:

```tsx
<GoogleAnalytics measurementId="G-XXXXXXXXXX" deferred={false} />
```

### Hook API

`useGoogleAnalytics()` exposes typed wrappers around the core `gtag` commands:

- `set(config)` for global config
- `config(measurementId, config?)` for per-stream config
- `event(name, params?)` for recommended and custom events
- `get(measurementId, fieldName, callback?)` for callback-based reads like `client_id`
- `consent('default' | 'update', params)` for consent mode updates

## Contribution

See [Contributing Guide](https://github.com/bhouston/tanstack-router-ga4/blob/main/CONTRIBUTING.md).

## License

MIT

## Author

[Ben Houston](https://ben3d.ca), Sponsored by [Land of Assets](https://landofassets.com).
