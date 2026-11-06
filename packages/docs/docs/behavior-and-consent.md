---
sidebar_position: 3
title: Behavior and consent
description: Understand page-view triggers, deferred loading, server rendering, and consent integration boundaries.
---

## Page-view behavior

`GoogleAnalytics` disables the initial page view from its own GA4 configuration using `send_page_view: false`, then sends explicit `page_view` events from a React effect.

| Situation                                 | Component behavior                       |
| ----------------------------------------- | ---------------------------------------- |
| Client initialization completes           | Sends a view for the current pathname    |
| Router pathname changes                   | Sends a new view                         |
| Only search parameters or the hash change | Does not send a new view                 |
| Document title changes without navigation | Does not send a new view                 |
| Empty measurement ID                      | Skips initialization and automatic views |

Each automatic event includes `page_path` from the router, `page_location` from `window.location.href`, `page_title` from `document.title`, and `page_referrer` from `document.referrer` when present. The browser referrer is not rewritten to the previous client-side route.

Mount one component in a persistent root layout. Other tags or GA4 enhanced-measurement settings may also send navigation events; check your stream configuration if you see duplicates. A component remount or development effect replay can send another view.

## Deferred loading

The default `deferred={true}` waits for `requestIdleCallback` before mounting the inner analytics component. This defers both script injection and automatic page-view tracking. Browsers without that API initialize after the component's client effect runs.

```tsx
<GoogleAnalytics measurementId="G-XXXXXXXXXX" deferred={false} />
```

There is no idle timeout. Navigation that happens before initialization is not replayed as a history of page views: initialization records the then-current pathname. Use immediate initialization if your measurement needs outweigh the benefit of delaying analytics work.

Hook commands can enter the data layer before the loader starts, but queued commands are not evidence of delivery to GA4. Network restrictions, blockers, or page exits can prevent delivery.

## Server rendering

The component uses TanStack Router's `ClientOnly` boundary with a `null` fallback. It emits no analytics markup on the server and initializes from client effects. Hook commands check for `window` and do nothing on the server. Run analytics calls in response to client effects or user interactions.

The component reuses an existing `googletagmanager.com/gtag/js` loader and existing `window.gtag` when present. It does not remove the shared loader when unmounted.

## Set initial consent and apply updates

Pass defaults as a stable object. During component initialization, these defaults are queued before the `js` and stream configuration commands:

```tsx
import { GoogleAnalytics, type GoogleAnalyticsConsentParams } from 'tanstack-router-ga4';

const consentDefaults: GoogleAnalyticsConsentParams = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
};

export function Analytics() {
  return <GoogleAnalytics measurementId="G-XXXXXXXXXX" consentDefaults={consentDefaults} />;
}
```

Connect your consent interface's saved choice to the hook. For example, after a user chooses to allow analytics while keeping advertising denied:

```tsx
const ga = useGoogleAnalytics();

function applyAnalyticsChoice(allowed: boolean) {
  ga.consent('update', {
    analytics_storage: allowed ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}
```

The package sends consent commands; it does not provide a consent banner, persist user choices, detect regions, or act as a consent management platform. `consentDefaults` is optional, and the package does not assume denial when it is omitted.

Denied storage consent does not prevent the component from loading Google's script or queuing events. If your application requires no analytics script before a choice, conditionally mount `GoogleAnalytics` only after your consent system allows it, and avoid analytics hook calls before then. When integrating an existing tag or consent system, coordinate command ordering: deferred component defaults can otherwise run after earlier hook updates.
