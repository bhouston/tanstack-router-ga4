import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { useGoogleAnalytics } from "tanstack-router-ga4";
import { useDemoAnalyticsUser } from "./__root";

export const Route = createFileRoute("/register-user")({
  component: RegisterUserPage,
});

function RegisterUserPage() {
  const { trackEvent } = useGoogleAnalytics();
  const { clearRegisteredUser, registerUserInAnalytics, registeredUser } = useDemoAnalyticsUser();

  const handleRegisterUser = useCallback(() => {
    const user = {
      id: "user-123",
      email: "ada@example.com",
      username: "ada",
    };

    registerUserInAnalytics(user);
    trackEvent("sign_up", { method: "email" });
  }, [registerUserInAnalytics, trackEvent]);

  const handleClearUser = useCallback(() => {
    clearRegisteredUser();
  }, [clearRegisteredUser]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
        Register user
      </h1>
      <p className="mb-4 text-slate-600 leading-relaxed">
        This page demonstrates identifying the current user in Google Analytics. Press
        the button to set
        {" "}
        <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">user_id</code>
        {" "}
        and
        {" "}
        <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">user_properties</code>
        {" "}
        (email + username), then fire a
        {" "}
        <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">sign_up</code>
        {" "}
        event.
      </p>
      <p className="mb-6 text-slate-600 leading-relaxed">
        In a real app, register the user only after your backend confirms authentication.
        That way all subsequent events in the session can be associated with that user.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRegisterUser}
          className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
        >
          Register user in GA
        </button>
        <button
          type="button"
          onClick={handleClearUser}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Clear registered user
        </button>
      </div>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">
          Current registered user:
          {" "}
          {registeredUser
            ? `${registeredUser.id} (${registeredUser.username}, ${registeredUser.email})`
            : "none"}
        </p>
      </div>
    </div>
  );
}
