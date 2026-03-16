import { ClientOnly, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { initGtag } from "./initGtag.js";
import type { GoogleAnalyticsConfig } from "./useGoogleAnalytics.js";

type GoogleAnalyticsProps = {
  config?: GoogleAnalyticsConfig;
  measurementId: string;
};

const GoogleAnalyticsInner = ({ config, measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  // Initialize Google Analytics once: inject gtag script and set up dataLayer
  useEffect(() => {
    if (!measurementId || typeof window === "undefined") return;

    initGtag();
    if (typeof window.gtag !== "function") return;

    // Inject the gtag.js script if not already present
    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`,
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    // Disable automatic page_view so we can send manual page views on route change
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      ...config,
      send_page_view: false,
    });
  }, [config, measurementId]);

  // Track page views on route changes
  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function")
      return;

    window.gtag("event", "page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
      page_referrer: document.referrer || undefined,
    });
  }, [location.pathname, measurementId]);

  return null;
};

export const GoogleAnalytics = (props: GoogleAnalyticsProps) => (
  <ClientOnly fallback={null}>
    <GoogleAnalyticsInner {...props} />
  </ClientOnly>
);
