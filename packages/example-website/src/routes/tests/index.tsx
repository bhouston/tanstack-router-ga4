import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tests/")({
  component: TestsIndexPage,
});

function TestsIndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Dedicated test routes</h1>
      <p className="mb-6 text-slate-600 leading-relaxed">
        These pages keep each GA interaction isolated so browser tests can exercise real route
        changes and focused user flows.
      </p>
      <ul className="space-y-2 text-slate-600">
        <li>
          <Link to="/tests/config" className="font-medium text-slate-800 underline underline-offset-2">
            Per-stream config
          </Link>
        </li>
        <li>
          <Link to="/tests/signup" className="font-medium text-slate-800 underline underline-offset-2">
            Sign up
          </Link>
        </li>
        <li>
          <Link to="/tests/lead-gen" className="font-medium text-slate-800 underline underline-offset-2">
            Lead gen
          </Link>
        </li>
        <li>
          <Link to="/tests/register-user" className="font-medium text-slate-800 underline underline-offset-2">
            Register user
          </Link>
        </li>
        <li>
          <Link
            to="/tests/get-client-id"
            className="font-medium text-slate-800 underline underline-offset-2"
          >
            Get client ID
          </Link>
        </li>
        <li>
          <Link to="/tests/consent" className="font-medium text-slate-800 underline underline-offset-2">
            Consent controls
          </Link>
        </li>
      </ul>
    </div>
  );
}
