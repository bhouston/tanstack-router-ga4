import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-lg font-semibold text-slate-800 hover:text-slate-600"
        >
          tanstack-router-ga4
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900"
            activeProps={{ className: "font-medium text-slate-900" }}
          >
            Home
          </Link>
          <Link
            to="/lead-gen"
            className="text-slate-600 hover:text-slate-900"
            activeProps={{ className: "font-medium text-slate-900" }}
          >
            Lead gen
          </Link>
          <Link
            to="/signup"
            className="text-slate-600 hover:text-slate-900"
            activeProps={{ className: "font-medium text-slate-900" }}
          >
            Sign up
          </Link>
          <Link
            to="/register-user"
            className="text-slate-600 hover:text-slate-900"
            activeProps={{ className: "font-medium text-slate-900" }}
          >
            Register user
          </Link>
        </nav>
      </div>
    </header>
  );
}
