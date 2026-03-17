import { createFileRoute } from "@tanstack/react-router";
import { SignupDemo, TestPageShell } from "../../components/AnalyticsDemoContent";

export const Route = createFileRoute("/tests/signup")({
  component: TestsSignupPage,
});

function TestsSignupPage() {
  return (
    <TestPageShell
      title="Sign up"
      description={
        <p>
          Dedicated route-based test page for the{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">sign_up</code> event.
        </p>
      }
    >
      <SignupDemo />
    </TestPageShell>
  );
}
