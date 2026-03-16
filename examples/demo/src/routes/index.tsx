import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { useGoogleAnalytics } from "tanstack-router-google-analytics";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { trackEvent, isReady } = useGoogleAnalytics();

  const handleTrackDemo = useCallback(() => {
    trackEvent("generate_lead", { currency: "USD", value: 1 });
  }, [trackEvent]);

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        maxWidth: 720,
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      <h1>TanStack Router Google Analytics demo</h1>
      <p>
        This app uses <code>tanstack-router-google-analytics</code>. Page views are sent
        automatically on route changes. Use the button below to send a custom event (if you have a
        real measurement ID and GA4 property, you’ll see it in DebugView).
      </p>
      <p>
        <button
          type="button"
          onClick={handleTrackDemo}
          disabled={!isReady}
          style={{ padding: "8px 12px", cursor: isReady ? "pointer" : "not-allowed" }}
        >
          {isReady ? "Track “generate_lead” event" : "GA not ready (client-only)"}
        </button>
      </p>
    </main>
  );
}
