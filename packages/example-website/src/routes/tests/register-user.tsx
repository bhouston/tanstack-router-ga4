import { createFileRoute } from "@tanstack/react-router";
import { RegisterUserDemo, TestPageShell } from "../../components/AnalyticsDemoContent";

export const Route = createFileRoute("/tests/register-user")({
  component: TestsRegisterUserPage,
});

function TestsRegisterUserPage() {
  return (
    <TestPageShell
      title="Register user"
      description={
        <p>
          Dedicated route-based test page for setting{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">user_id</code> and{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">user_properties</code>.
        </p>
      }
    >
      <RegisterUserDemo />
    </TestPageShell>
  );
}
