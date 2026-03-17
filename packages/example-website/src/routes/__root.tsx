import "../app.css";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { GoogleAnalytics } from "tanstack-router-ga4";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DEMO_MEASUREMENT_ID } from "../lib/googleAnalytics";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Router Google Analytics demo" },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <GoogleAnalytics measurementId={DEMO_MEASUREMENT_ID} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
