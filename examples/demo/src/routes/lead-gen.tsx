import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { useGoogleAnalytics } from "tanstack-router-google-analytics";

export const Route = createFileRoute("/lead-gen")({
  component: LeadGenPage,
});

function LeadGenPage() {
  const { trackEvent } = useGoogleAnalytics();

  const handleGenerateLead = useCallback(() => {
    trackEvent("generate_lead", { currency: "USD", value: 1 });
  }, [trackEvent]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
        Generate lead
      </h1>
      <p className="mb-6 text-slate-600 leading-relaxed">
        This page demonstrates the <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">generate_lead</code> event.
        Click the button below to send the event to Google Analytics (if you have a real measurement
        ID, you&apos;ll see it in DebugView).
      </p>
      <button
        type="button"
        onClick={handleGenerateLead}
        className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
      >
        Generate lead
      </button>
    </div>
  );
}
