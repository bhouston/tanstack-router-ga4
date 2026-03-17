import { createFileRoute } from "@tanstack/react-router";
import { ConsentDemo, TestPageShell } from "../../components/AnalyticsDemoContent";

export const Route = createFileRoute("/tests/consent")({
  component: TestsConsentPage,
});

function TestsConsentPage() {
  return (
    <TestPageShell
      title="Consent controls"
      description={
        <p>
          Dedicated route-based test page for runtime{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">consent()</code> updates.
        </p>
      }
    >
      <ConsentDemo />
    </TestPageShell>
  );
}
