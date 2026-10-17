import { createFileRoute } from '@tanstack/react-router';
import { LeadGenDemo, TestPageShell } from '../../components/AnalyticsDemoContent';

export const Route = createFileRoute('/tests/lead-gen')({
  component: TestsLeadGenPage,
});

function TestsLeadGenPage() {
  return (
    <TestPageShell
      title="Generate lead"
      description={
        <p>
          Dedicated route-based test page for the{' '}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">generate_lead</code> event.
        </p>
      }
    >
      <LeadGenDemo />
    </TestPageShell>
  );
}
