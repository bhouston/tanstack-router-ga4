---
sidebar_position: 1
title: Getting started
description: Add automatic GA4 page views and typed analytics events to TanStack Router and TanStack Start.
---

`tanstack-router-ga4` connects Google Analytics 4 to your TanStack Router or TanStack Start app. Mount one component for automatic page views, then use a small hook to record actions throughout your app.

## Why use it?

- **Track client navigation:** page views follow pathname changes without a full page reload.
- **Keep initial rendering focused:** analytics initialization waits for browser idle time by default.
- **Use TypeScript throughout:** common GA4 events have parameter types, with support for custom event names and payloads.
- **Share one integration:** configure GA4, associate an application user ID, query client information, and update consent through the same hook.
- **Render on the server:** the analytics component renders only on the client, making it suitable for TanStack Start.

## Install

```sh
pnpm add tanstack-router-ga4
```

Your app needs React 18 or newer, TanStack Router 1 or newer, and Node.js 22 or newer. Create a GA4 web data stream and use its measurement ID (`G-XXXXXXXXXX`) below.

## Mount analytics in your root route

Place `GoogleAnalytics` inside the router context, in a layout that stays mounted across navigation:

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { GoogleAnalytics } from 'tanstack-router-ga4';

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    <>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      <Outlet />
    </>
  );
}
```

For TanStack Start, mount the same component in your existing root layout or root document, inside the router context. Keep your framework's existing `HeadContent`, `Scripts`, and document structure.

Once initialized, the component sends a `page_view` for the current pathname and subsequent pathname changes. It includes the current URL, document title, and browser referrer. Query-string or hash changes alone do not trigger a page view.

## Record an action

```tsx
import { useGoogleAnalytics } from 'tanstack-router-ga4';

export function DownloadButton() {
  const ga = useGoogleAnalytics();

  return (
    <button
      onClick={() => {
        ga.event('download_example', { example: 'starter' });
      }}
    >
      Download example
    </button>
  );
}
```

The hook queues commands through `window.gtag` and `window.dataLayer`. It does not load Google's script by itself: keep `GoogleAnalytics` mounted to initialize the integration.

## Configure your stream

```tsx
import type { GoogleAnalyticsConfig } from 'tanstack-router-ga4';

const analyticsConfig: GoogleAnalyticsConfig = {
  debug_mode: true,
  content_group: 'documentation',
};

// Within your root layout:
<GoogleAnalytics measurementId="G-XXXXXXXXXX" config={analyticsConfig} deferred={false} />;
```

Use `debug_mode` while checking your integration in GA4 DebugView, then remove it when appropriate. `deferred={false}` starts initialization after client mount instead of waiting for idle time. Keep configuration objects stable, such as module-level constants, to avoid re-running the initialization effect unnecessarily.

Read [Examples](./examples.md) for common workflows and [Behavior and consent](./behavior-and-consent.md) before deciding how to load analytics in your app.
