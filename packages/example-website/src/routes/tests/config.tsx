import { createFileRoute } from '@tanstack/react-router';
import { ConfigDemo, TestPageShell } from '../../components/AnalyticsDemoContent';

export const Route = createFileRoute('/tests/config')({
  component: TestsConfigPage,
});

function TestsConfigPage() {
  return (
    <TestPageShell
      title="Per-stream config"
      description={
        <p>
          Dedicated route-based test page for runtime{' '}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">config()</code> updates like{' '}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">debug_mode</code>.
        </p>
      }
    >
      <ConfigDemo />
    </TestPageShell>
  );
}
