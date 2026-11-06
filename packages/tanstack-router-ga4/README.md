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

## Features

- Automatic `page_view` events on route changes: [Getting started](https://tanstack-router-ga4.ben3d.ca/docs/getting-started/)
- Typed helpers for recommended GA4 events and custom events: [Examples](https://tanstack-router-ga4.ben3d.ca/docs/examples/)
- Deferred script loading, SSR safety and consent mode: [Behavior and consent](https://tanstack-router-ga4.ben3d.ca/docs/behavior-and-consent/)
- Every prop, hook command and type, generated from TSDoc: [API reference](https://tanstack-router-ga4.ben3d.ca/docs/api/)
- Under 1 KB gzipped

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

See the [documentation](https://tanstack-router-ga4.ben3d.ca) for deferred loading, consent, and the full hook and component API.

## Contribution

See [Contributing Guide](https://github.com/bhouston/tanstack-router-ga4/blob/main/CONTRIBUTING.md).

## License

MIT

## Author

[Ben Houston](https://ben3d.ca), Sponsored by [Land of Assets](https://landofassets.com).
