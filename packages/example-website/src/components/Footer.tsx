export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-sm text-slate-600">
          Made with{' '}
          <span className="text-red-500" aria-hidden>
            ♥
          </span>{' '}
          by{' '}
          <a
            href="https://ben3d.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            Ben Houston
          </a>
          . Sponsored by{' '}
          <a
            href="https://landofassets.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
          >
            Land of Assets
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
