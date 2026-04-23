import { createFileRoute } from '@tanstack/react-router';
import { HomeFeatureSections } from '../components/AnalyticsDemoContent';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">tanstack-router-ga4</h1>
        <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
          Ship{' '}
          <a
            href="https://marketingplatform.google.com/about/analytics/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            Google Analytics (GA4)
          </a>{' '}
          for{' '}
          <a
            href="https://tanstack.com/router"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            TanStack Router
          </a>{' '}
          and{' '}
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            TanStack Start
          </a>{' '}
          without wiring up fragile route listeners or untyped analytics helpers yourself. You get automatic{' '}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">page_view</code> tracking, typed event helpers, and
          a setup that fits naturally into real app shells.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Automatic tracking</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Record route-based <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">page_view</code> events
              automatically across client-side navigation.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Typed GA4 helpers</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Track <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">sign_up</code>,{' '}
              <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">generate_lead</code>, consent, config, and
              custom events with TypeScript support.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Deferred loading</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Add the <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">deferred</code> prop to delay GA script
              injection until the browser is idle, improving initial page load performance.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Built for real apps</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Works cleanly with TanStack Start, SSR-friendly root documents, and tested route flows.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Table of contents</h2>
            <ul className="mt-4 grid gap-2 text-slate-700">
              <li>
                <a href="#setup" className="underline underline-offset-2">
                  Set up GoogleAnalytics
                </a>
              </li>
              <li>
                <a href="#deferred" className="underline underline-offset-2">
                  Deferred loading
                </a>
              </li>
              <li>
                <a href="#set" className="underline underline-offset-2">
                  Set Global Config
                </a>
              </li>
              <li>
                <a href="#config" className="underline underline-offset-2">
                  Set Per-Stream Config
                </a>
              </li>
              <li>
                <a href="#signup" className="underline underline-offset-2">
                  Track sign_up events
                </a>
              </li>
              <li>
                <a href="#lead-gen" className="underline underline-offset-2">
                  Track generate_lead events
                </a>
              </li>
              <li>
                <a href="#get" className="underline underline-offset-2">
                  Read values with get
                </a>
              </li>
              <li>
                <a href="#consent" className="underline underline-offset-2">
                  Update consent
                </a>
              </li>
              <li>
                <a href="#tests" className="underline underline-offset-2">
                  Dedicated test routes
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <HomeFeatureSections />
      </div>
    </div>
  );
}
