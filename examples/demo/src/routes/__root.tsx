import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { GoogleAnalytics } from "tanstack-router-google-analytics";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Router Google Analytics demo" },
    ],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0, background: "#f8fafc" }}>
        <GoogleAnalytics measurementId="G-FWJBK9S1RL" />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
