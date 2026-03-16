# tanstack-router-google-analytics

Google Analytics (GA4) React integration for [TanStack Router](https://tanstack.com/router) (and by extension [TanStack Start](https://tanstack.com/start).) Sends `page_view` events on route changes and exposes a `useGoogleAnalytics()` hook for custom events. Uses TanStack Router's `ClientOnly` for SSR-safe mounting.

## Install

```sh
pnpm add tanstack-router-google-analytics
```

**Peer dependencies:** `react` (>=18), `@tanstack/react-router` (>=1).

## Usage

Mount the component in your app (e.g. root layout) so every route gets automatic page views, and use the hook for custom events:

```tsx
import { GoogleAnalytics, useGoogleAnalytics } from "tanstack-router-google-analytics";

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

Optional config (e.g. `debug_mode`, `user_id`):

```tsx
<GoogleAnalytics
  measurementId="G-XXXXXXXXXX"
  config={{ debug_mode: true }}
/>
```

The component injects the gtag script, sets `send_page_view: false`, and sends a manual `page_view` on each route change using `useLocation()`. It is wrapped in `ClientOnly` so it only runs in the browser.

---

## Monorepo development

This repo contains the library and a TanStack Start demo:

- **Library:** `packages/tanstack-router-google-analytics`
- **Demo:** `examples/demo`

```sh
pnpm install
pnpm build      # build library and example
pnpm test       # run Vitest tests
pnpm dev        # library watch + example app (port 3000)
pnpm make-release   # publish package (builds, copies dist + root README, npm publish)
```

Publishing runs from the repo root and uses the root README as the package README.

---

## Testing (three layers)

| Layer | Command | What it proves |
|-------|---------|----------------|
| **Unit** | `pnpm test` | Component/hook calls `gtag` with correct args (Vitest + spy) |
| **Integration** | `pnpm test` | Same suite asserts on `window.dataLayer` (GTM-style) |
| **E2E** | `pnpm test:e2e` | Real GA4 collect requests are sent (Playwright request interception) |

- **Unit/Integration:** Vitest in `packages/tanstack-router-google-analytics` — spy on `window.gtag` and/or assert on `window.dataLayer`. No network, fast and reliable.
- **E2E:** Playwright in `e2e/` — runs the demo app and intercepts requests to `google-analytics.com/g/collect` to verify `page_view` and custom events (e.g. `generate_lead`). First time: run `pnpm exec playwright install` to install browsers; then `pnpm test:e2e` (builds the app and starts the demo automatically). No extra interception library is needed — Playwright’s built-in `page.on('request')` captures outbound GA4 requests.

  **Debug E2E:** To see the browser and watch the test run, use `pnpm test:e2e:headed`. To step through with the Playwright Inspector, use `pnpm test:e2e:debug`. For the full Test UI (pick tests, watch runs, traces), use `pnpm test:e2e:ui`.
