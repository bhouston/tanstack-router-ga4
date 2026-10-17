import { ClientOnly, useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics.js';
import { useIdleReady } from '../hooks/useIdleReady.js';
import { getGtag } from '../lib/getGtag.js';
import type { GoogleAnalyticsConfig, GoogleAnalyticsConsentParams } from '../types/googleAnalytics.js';

/** Options for the client-only GA4 component. Keep config objects stable across renders. */
export type GoogleAnalyticsProps = {
  /** Stream configuration. Automatic gtag page views are always disabled by this component. */
  config?: GoogleAnalyticsConfig;
  /** Initial consent commands, queued before stream configuration. Does not block script loading. */
  consentDefaults?: GoogleAnalyticsConsentParams;
  /** GA4 web stream measurement ID, such as `G-XXXXXXXXXX`. */
  measurementId: string;
  /** Wait for requestIdleCallback when available. Defaults to true; no idle timeout is set. */
  deferred?: boolean;
};

const GoogleAnalyticsInner = ({ config, consentDefaults, measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();
  const { event } = useGoogleAnalytics();

  // Initialize Google Analytics once: inject gtag script and set up dataLayer
  useEffect(() => {
    if (!measurementId) return;

    const gtag = getGtag();
    if (!gtag) return;

    // The gtag.js loader is shared across measurement IDs, so any existing loader script is reusable.
    const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    if (consentDefaults) {
      gtag('consent', 'default', consentDefaults);
    }

    // Disable automatic page_view so we can send manual page views on route change
    gtag('js', new Date());
    gtag('config', measurementId, {
      ...config,
      send_page_view: false,
    });
  }, [config, consentDefaults, measurementId]);

  // Track page views on route changes
  useEffect(() => {
    if (!measurementId) return;

    event('page_view', {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_referrer: document.referrer || undefined,
    });
  }, [event, location.pathname, measurementId]);

  return null;
};

const DeferredGoogleAnalyticsInner = (props: GoogleAnalyticsProps) => {
  const isIdle = useIdleReady();
  if (!isIdle) return null;
  return <GoogleAnalyticsInner {...props} />;
};

/**
 * Initializes GA4 on the client and sends page views on pathname changes.
 *
 * Mount once inside a TanStack Router root. Search/hash-only changes do not trigger page views.
 * The component renders nothing during SSR and reuses an existing gtag loader script.
 *
 * @example
 * ```tsx
 * <GoogleAnalytics measurementId="G-XXXXXXXXXX" deferred={false} />
 * ```
 */
export const GoogleAnalytics = ({ deferred = true, ...rest }: GoogleAnalyticsProps) => (
  <ClientOnly fallback={null}>
    {deferred ? <DeferredGoogleAnalyticsInner {...rest} /> : <GoogleAnalyticsInner {...rest} />}
  </ClientOnly>
);
