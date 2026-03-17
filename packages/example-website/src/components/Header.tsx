import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-slate-800 hover:text-slate-600">
          tanstack-router-ga4
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/bhouston/tanstack-router-ga4"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="sr-only">GitHub repository</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.23.72-.51v-1.78c-2.95.64-3.57-1.25-3.57-1.25-.48-1.2-1.18-1.51-1.18-1.51-.96-.66.07-.65.07-.65 1.07.08 1.63 1.08 1.63 1.08.94 1.59 2.47 1.13 3.08.86.1-.67.37-1.13.67-1.39-2.36-.26-4.85-1.16-4.85-5.19 0-1.15.42-2.08 1.1-2.82-.11-.27-.48-1.37.11-2.85 0 0 .9-.28 2.95 1.08a10.4 10.4 0 0 1 5.38 0c2.05-1.36 2.95-1.08 2.95-1.08.59 1.48.22 2.58.11 2.85.69.74 1.1 1.67 1.1 2.82 0 4.04-2.5 4.93-4.88 5.18.38.33.72.96.72 1.94v2.87c0 .28.19.62.73.51A10.5 10.5 0 0 0 12 1.5Z" />
            </svg>
          </a>
          <a
            href="https://www.npmjs.com/package/tanstack-router-ga4"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-[#cb3837] transition hover:bg-red-50 hover:text-[#a62b2b]"
          >
            <span className="sr-only">npm package</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M1.5 7.5v9h6v-4.5h3v4.5h12v-9Zm4.5 7.5H3V9h3Zm6 0H9V9h4.5v6Zm7.5 0H15V9h6v6Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
