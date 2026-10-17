---
sidebar_position: 2
title: Examples
description: Track signups, leads, custom events, user IDs, and client information with the GA4 hook.
---

These examples assume `GoogleAnalytics` is already mounted in your app's root layout. Call `useGoogleAnalytics()` inside a React component or custom hook.

## Track a successful signup

Send conversion events after the operation succeeds. Use your application's opaque user ID for association; avoid sending email addresses or other identifying form fields.

```tsx
import { useGoogleAnalytics } from 'tanstack-router-ga4';

type SignupButtonProps = {
  register: () => Promise<{ id: string }>;
};

export function SignupButton({ register }: SignupButtonProps) {
  const ga = useGoogleAnalytics();

  async function handleSignup() {
    const user = await register();
    ga.set({ user_id: user.id });
    ga.event('sign_up', { method: 'email' });
  }

  return <button onClick={handleSignup}>Create account</button>;
}
```

Clear the association when your app signs the user out:

```tsx
ga.set({ user_id: null });
```

## Measure a lead or custom action

```tsx
ga.event('generate_lead', {
  currency: 'USD',
  value: 50,
  lead_source: 'pricing-page',
});

ga.event('example_copied', {
  example_name: 'root-layout',
  language: 'tsx',
});
```

The event wrapper provides parameter types for `exception`, `generate_lead`, `login`, `page_view`, `search`, `select_content`, `share`, and `sign_up`. Other event names accept custom payloads. The general string overload also accepts arbitrary events, so TypeScript is a convenience rather than a complete validator of GA4 event semantics.

## Track search without treating it as navigation

Automatic page views depend on the pathname. Record a search explicitly when a query-string update or in-page interaction represents a meaningful search:

```tsx
ga.event('search', { search_term: 'route analytics' });
```

## Set shared or per-stream configuration

```tsx
ga.set({
  user_properties: { account_tier: 'team' },
});

ga.config('G-XXXXXXXXXX', {
  content_group: 'guides',
  send_page_view: false,
});
```

`set` sends global parameters; `config` targets a measurement ID. When configuring the stream directly, keep `send_page_view: false` if you want the mounted component to remain responsible for page views. The component sets that option automatically during its own initialization.

## Read the client ID

`get` uses a callback, not a returned promise:

```tsx
import { useState } from 'react';
import { useGoogleAnalytics } from 'tanstack-router-ga4';

export function ClientIdButton() {
  const ga = useGoogleAnalytics();
  const [clientId, setClientId] = useState<string>();

  return (
    <>
      <button
        onClick={() => {
          ga.get('G-XXXXXXXXXX', 'client_id', (value) => {
            setClientId(value);
          });
        }}
      >
        Read client ID
      </button>
      <output>{clientId ?? 'No client ID available'}</output>
    </>
  );
}
```

Supported field names are `campaign_name`, `client_id`, `gclid`, and `session_id`. The callback depends on Google's script processing the command. A blocked script, unavailable network, or consent configuration can affect availability; do not make application functionality depend on receiving a callback.

For consent defaults and updates, see [Behavior and consent](./behavior-and-consent.md).
