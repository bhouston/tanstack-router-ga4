import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useGoogleAnalytics } from "tanstack-router-ga4";

export const Route = createFileRoute("/tests/stability")({
  component: StabilityFixturePage,
});

function StabilityFixturePage() {
  const ga = useGoogleAnalytics();
  const [selectedFixtureExample, setSelectedFixtureExample] = useState("");
  const [loadCount, setLoadCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const loadFixtureExample = useCallback(async (exampleName: string) => {
    if (!exampleName) return;

    await Promise.resolve();
    setLoadCount((count) => count + 1);
    ga.event("stability_fixture_load", {
      example_name: exampleName,
    });
    setEventCount((count) => count + 1);
  }, [ga]);

  useEffect(() => {
    if (!selectedFixtureExample) return;
    void loadFixtureExample(selectedFixtureExample);
  }, [loadFixtureExample, selectedFixtureExample]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
        Stability regression fixture
      </h1>
      <p className="mb-6 text-slate-600 leading-relaxed">
        This page intentionally depends on the full object returned from
        <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-slate-800">
          useGoogleAnalytics()
        </code>
        so E2E can catch rerender loops if the wrapper ever becomes unstable again.
      </p>
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-800" htmlFor="stability-example-select">
            Stability fixture example
          </label>
          <select
            id="stability-example-select"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
            onChange={(event) => setSelectedFixtureExample(event.target.value)}
            value={selectedFixtureExample}
          >
            <option value="">Select an example</option>
            <option value="blouberg_sunrise_2_1k.hdr">Blouberg Sunrise</option>
            <option value="reference_gradient.exr">Reference Gradient</option>
          </select>
          <p className="text-sm text-slate-600">Selected example: {selectedFixtureExample || "(none)"}</p>
          <p className="text-sm text-slate-600">Load count: {loadCount}</p>
          <p className="text-sm text-slate-600">Event count: {eventCount}</p>
        </div>
      </div>
    </div>
  );
}
