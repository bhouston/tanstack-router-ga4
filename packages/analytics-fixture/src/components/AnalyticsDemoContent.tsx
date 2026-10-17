import { type ReactNode, useCallback, useState } from 'react';
import type { GoogleAnalyticsConsentParams } from 'tanstack-router-ga4';
import { useGoogleAnalytics } from 'tanstack-router-ga4';
import { DEMO_MEASUREMENT_ID } from '../lib/googleAnalytics';

type RegisteredUser = {
  email: string;
  id: string;
  username: string;
};

type ConsentState = {
  label: string;
  mode: 'update';
  params: GoogleAnalyticsConsentParams;
};

function DemoPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function SignupDemo() {
  const ga = useGoogleAnalytics();
  const [lastSignup, setLastSignup] = useState<{ method: string } | null>(null);

  const handleSignup = useCallback(() => {
    const signupDetails = { method: 'email' };
    ga.event('sign_up', signupDetails);
    setLastSignup(signupDetails);
  }, [ga]);

  return (
    <DemoPanel title="Interactive demo">
      <button
        type="button"
        onClick={handleSignup}
        className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
      >
        Sign up
      </button>
      <div aria-live="polite" className="mt-4 text-slate-600">
        {!lastSignup ? (
          <p>No sign up event sent yet.</p>
        ) : (
          <p>
            Sent <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">sign_up</code> with method{' '}
            <strong>{lastSignup.method}</strong>.
          </p>
        )}
      </div>
    </DemoPanel>
  );
}

export function LeadGenDemo() {
  const ga = useGoogleAnalytics();
  const [lastLead, setLastLead] = useState<{ currency: string; value: number } | null>(null);

  const handleGenerateLead = useCallback(() => {
    const leadDetails = { currency: 'USD', value: 1 };
    ga.event('generate_lead', leadDetails);
    setLastLead(leadDetails);
  }, [ga]);

  return (
    <DemoPanel title="Interactive demo">
      <button
        type="button"
        onClick={handleGenerateLead}
        className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
      >
        Generate lead
      </button>
      <div aria-live="polite" className="mt-4 text-slate-600">
        {!lastLead ? (
          <p>No lead event sent yet.</p>
        ) : (
          <p>
            Sent <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">generate_lead</code> for {lastLead.value}{' '}
            {lastLead.currency}.
          </p>
        )}
      </div>
    </DemoPanel>
  );
}

export function RegisterUserDemo() {
  const ga = useGoogleAnalytics();
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [statusMessage, setStatusMessage] = useState('No user changes sent yet.');

  const handleRegisterUser = useCallback(() => {
    const user = {
      id: 'user-123',
      email: 'ada@example.com',
      username: 'ada',
    };

    ga.set({
      user_id: user.id,
      user_properties: {
        email: user.email,
        username: user.username,
      },
    });
    ga.event('sign_up', { method: 'email' });
    setRegisteredUser(user);
    setStatusMessage('Registered user in GA and sent sign_up.');
  }, [ga]);

  const handleClearUser = useCallback(() => {
    ga.set({
      user_id: undefined,
      user_properties: undefined,
    });
    setRegisteredUser(null);
    setStatusMessage('Cleared the registered user from GA.');
  }, [ga]);

  return (
    <DemoPanel title="Interactive demo">
      <div className="flex flex-wrap items-center gap-3">
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
      <div aria-live="polite" className="mt-4 space-y-2 text-slate-600">
        <p>{statusMessage}</p>
        {!registeredUser ? (
          <p>No user is currently shown in this demo.</p>
        ) : (
          <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-sm text-slate-700">
            {JSON.stringify(registeredUser, null, 2)}
          </pre>
        )}
      </div>
    </DemoPanel>
  );
}

export function ConfigDemo() {
  const ga = useGoogleAnalytics();
  const [debugMode, setDebugMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Debug mode is currently off.');

  const toggleDebugMode = useCallback(() => {
    const nextDebugMode = !debugMode;
    ga.config(DEMO_MEASUREMENT_ID, {
      debug_mode: nextDebugMode,
      send_page_view: false,
    });
    setDebugMode(nextDebugMode);
    setStatusMessage(`Debug mode is now ${nextDebugMode ? 'on' : 'off'}.`);
  }, [debugMode, ga]);

  return (
    <DemoPanel title="Interactive demo">
      <button
        type="button"
        onClick={toggleDebugMode}
        className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
      >
        Turn debug mode {debugMode ? 'off' : 'on'}
      </button>
      <div aria-live="polite" className="mt-4 space-y-2 text-slate-600">
        <p>{statusMessage}</p>
        <p>
          Current value: <strong>{debugMode ? 'true' : 'false'}</strong>
        </p>
      </div>
    </DemoPanel>
  );
}

export function GetClientIdDemo() {
  const ga = useGoogleAnalytics();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [clientId, setClientId] = useState<string | null>(null);

  const handleGetClientId = useCallback(() => {
    setStatus('loading');
    setClientId(null);

    ga.get(DEMO_MEASUREMENT_ID, 'client_id', (value) => {
      setClientId(value ?? '(empty response)');
      setStatus('success');
    });
  }, [ga]);

  return (
    <DemoPanel title="Interactive demo">
      <button
        type="button"
        onClick={handleGetClientId}
        className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
      >
        Get client ID
      </button>
      <p aria-live="polite" className="mt-4 text-slate-600">
        {status === 'idle' && 'No request sent yet.'}
        {status === 'loading' && 'Loading client ID...'}
        {status === 'success' && `Latest client ID: ${clientId}`}
      </p>
    </DemoPanel>
  );
}

export function ConsentDemo() {
  const ga = useGoogleAnalytics();
  const [lastConsent, setLastConsent] = useState<ConsentState | null>(null);

  const updateConsent = useCallback(
    (label: string, params: GoogleAnalyticsConsentParams) => {
      ga.consent('update', params);
      setLastConsent({
        label,
        mode: 'update',
        params,
      });
    },
    [ga],
  );

  return (
    <DemoPanel title="Interactive demo">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            updateConsent('Analytics granted', {
              analytics_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            })
          }
          className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700"
        >
          Grant analytics consent
        </button>
        <button
          type="button"
          onClick={() =>
            updateConsent('All denied', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            })
          }
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Deny all consent
        </button>
      </div>
      <div aria-live="polite" className="mt-4 space-y-2 text-slate-600">
        {!lastConsent ? (
          <p>No consent updates sent yet.</p>
        ) : (
          <>
            <p>{lastConsent.label}</p>
            <p>Mode: {lastConsent.mode}</p>
            <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-sm text-slate-700">
              {JSON.stringify(lastConsent.params, null, 2)}
            </pre>
          </>
        )}
      </div>
    </DemoPanel>
  );
}

export function TestPageShell({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: ReactNode;
  title: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <div className="mb-6 text-slate-600 leading-relaxed">{description}</div>
      {children}
    </div>
  );
}
