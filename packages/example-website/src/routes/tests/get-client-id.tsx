import { createFileRoute } from '@tanstack/react-router';
import { GetClientIdDemo, TestPageShell } from '../../components/AnalyticsDemoContent';

export const Route = createFileRoute('/tests/get-client-id')({
  component: TestsGetClientIdPage,
});

function TestsGetClientIdPage() {
  return (
    <TestPageShell
      title="Get GA client ID"
      description={
        <p>
          Dedicated route-based test page for the{' '}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">get()</code> command.
        </p>
      }
    >
      <GetClientIdDemo />
    </TestPageShell>
  );
}
