import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
        tanstack-router-ga4
      </h1>
      <p className="mb-4 text-slate-600 leading-relaxed">
        Google Analytics (GA4) React integration for{" "}
        <a
          href="https://tanstack.com/router"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
        >
          TanStack Router
        </a>{" "}
        (and by extension{" "}
        <a
          href="https://tanstack.com/start"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
        >
          TanStack Start
        </a>
        ). Sends <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">page_view</code> events on
        route changes and exposes a <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">useGoogleAnalytics()</code> hook
        for custom events. Uses TanStack Router&apos;s <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">ClientOnly</code> for
        SSR-safe mounting.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">
        Try the demo pages
      </h2>
      <ul className="mb-8 space-y-2 text-slate-600">
        <li>
          <Link
            to="/lead-gen"
            className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            Lead gen
          </Link>
          — trigger a <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">generate_lead</code> event
        </li>
        <li>
          <Link
            to="/signup"
            className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            Sign up
          </Link>
          — trigger a <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">sign_up</code> event
        </li>
        <li>
          <Link
            to="/register-user"
            className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            Register user
          </Link>
          — set
          {" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">user_id</code>
          {" "}
          and
          {" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">user_properties</code>
          {" "}
          in GA, then track a
          {" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">sign_up</code>
          {" "}
          event
        </li>
      </ul>

      <h2 className="mb-3 text-xl font-semibold text-slate-900">
        Install &amp; links
      </h2>
      <div className="space-y-3">
        <p className="text-slate-600">
          <span className="font-medium text-slate-800">npm:</span>{" "}
          <a
            href="https://www.npmjs.com/package/tanstack-router-ga4"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            tanstack-router-ga4
          </a>
        </p>
        <p className="text-slate-600">
          <span className="font-medium text-slate-800">GitHub:</span>{" "}
          <a
            href="https://github.com/bhouston/tanstack-router-ga4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            github.com/bhouston/tanstack-router-ga4
          </a>
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">
          Page views are sent automatically on each route change. Use the demo pages above to fire
          custom events; with a real GA4 measurement ID you can see them in DebugView.
        </p>
      </div>
    </div>
  );
}
