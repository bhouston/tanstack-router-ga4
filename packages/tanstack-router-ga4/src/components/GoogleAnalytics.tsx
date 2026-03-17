import { ClientOnly, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGoogleAnalytics } from "../hooks/useGoogleAnalytics.js";
import { getGtag } from "../lib/getGtag.js";
import type {
  GoogleAnalyticsConfig,
  GoogleAnalyticsConsentParams,
} from "../types/googleAnalytics.js";

type GoogleAnalyticsProps = {
  config?: GoogleAnalyticsConfig;
  consentDefaults?: GoogleAnalyticsConsentParams;
  measurementId: string;
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
    const existingScript = document.querySelector(
      'script[src*="googletagmanager.com/gtag/js"]',
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    if (consentDefaults) {
      gtag("consent", "default", consentDefaults);
    }

    // Disable automatic page_view so we can send manual page views on route change
    gtag("js", new Date());
    gtag("config", measurementId, {
      ...config,
      send_page_view: false,
    });
  }, [config, consentDefaults, measurementId]);

  // Track page views on route changes
  useEffect(() => {
    if (!measurementId) return;

    event("page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_referrer: document.referrer || undefined,
    });
  }, [event, location.pathname, measurementId]);

  return null;
};

export const GoogleAnalytics = (props: GoogleAnalyticsProps) => (
  <ClientOnly fallback={null}>
    <GoogleAnalyticsInner {...props} />
  </ClientOnly>
);
