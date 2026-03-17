import "../app.css";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { GoogleAnalytics } from "tanstack-router-ga4";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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

type DemoAnalyticsUser = {
  email: string;
  id: string;
  username: string;
};

type DemoAnalyticsUserContextValue = {
  clearRegisteredUser: () => void;
  registerUserInAnalytics: (user: DemoAnalyticsUser) => void;
  registeredUser: DemoAnalyticsUser | null;
};

const DemoAnalyticsUserContext = createContext<DemoAnalyticsUserContextValue | null>(null);

export function useDemoAnalyticsUser() {
  const context = useContext(DemoAnalyticsUserContext);
  if (!context) {
    throw new Error("useDemoAnalyticsUser must be used within RootDocument");
  }
  return context;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [registeredUser, setRegisteredUser] = useState<DemoAnalyticsUser | null>(null);

  const registerUserInAnalytics = useCallback((user: DemoAnalyticsUser) => {
    setRegisteredUser(user);
  }, []);

  const clearRegisteredUser = useCallback(() => {
    setRegisteredUser(null);
  }, []);

  const gaConfig = useMemo(() => {
    if (!registeredUser) return undefined;
    return {
      user_id: registeredUser.id,
      user_properties: {
        email: registeredUser.email,
        username: registeredUser.username,
      },
    };
  }, [registeredUser]);

  const contextValue = useMemo(
    () => ({
      clearRegisteredUser,
      registerUserInAnalytics,
      registeredUser,
    }),
    [clearRegisteredUser, registerUserInAnalytics, registeredUser],
  );

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <DemoAnalyticsUserContext.Provider value={contextValue}>
          <GoogleAnalytics measurementId="G-FWJBK9S1RL" config={gaConfig} />
          {children}
        </DemoAnalyticsUserContext.Provider>
        <Scripts />
      </body>
    </html>
  );
}
