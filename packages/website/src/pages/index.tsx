import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const benefits = [
  {
    label: 'ROUTE AWARE',
    title: 'Every pathname, connected.',
    body: 'Mount one component in your router root. Page views follow client-side pathname changes without wiring up your own route listeners.',
  },
  {
    label: 'TYPESCRIPT FIRST',
    title: 'Events close to your code.',
    body: 'Use one stable hook for recommended and custom events, configuration, user properties, consent updates, and client ID callbacks.',
  },
  {
    label: 'CLIENT ONLY',
    title: 'Fits your app shell.',
    body: 'Keep server rendering intact. Analytics initializes on the client and waits for browser idle time by default, with an immediate-loading option.',
  },
];

export default function Home() {
  return (
    <Layout
      title="GA4 analytics that follows your router"
      description="Google Analytics 4 for TanStack Router and TanStack Start. Automatic page views, typed event helpers, and client-only initialization for React apps."
    >
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.kicker}>TANSTACK ROUTER + GOOGLE ANALYTICS 4</p>
            <h1>
              Your routes.
              <br />
              <em>
                Your analytics.
                <br />
                Connected.
              </em>
            </h1>
            <p className={styles.lead}>
              Add GA4 to your React app with one component. Track page views as users navigate, then capture the actions
              that matter with typed event helpers.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} to="/docs/getting-started">
                Get started →
              </Link>
              <Link className={styles.secondary} to="/docs/examples">
                Explore examples ↗
              </Link>
            </div>
            <p className={styles.platform}>TanStack Router · TanStack Start · React 18+ · MIT</p>
          </div>
          <div className={styles.codePanel}>
            <p className={styles.codeLabel}>ONE COMPONENT. ROUTE-BASED PAGE VIEWS.</p>
            <CodeBlock language="bash">npm install tanstack-router-ga4</CodeBlock>
            <CodeBlock language="tsx">{`import { Outlet } from '@tanstack/react-router';
import { GoogleAnalytics } from 'tanstack-router-ga4';

// Inside your router's root component
export function RootLayout() {
  return (
    <>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      <Outlet />
    </>
  );
}`}</CodeBlock>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.cards} aria-label="Benefits">
          {benefits.map(({ label, title, body }) => (
            <article className={styles.card} key={label}>
              <p className={styles.kicker}>{label}</p>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>
        <section className={styles.details}>
          <div>
            <p className={styles.kicker}>BEYOND PAGE VIEWS</p>
            <h2>
              From the first visit
              <br />
              to the next conversion.
            </h2>
            <p>
              Track sign-ups and leads where they happen. Send custom events, set user properties, or connect your
              consent interface to GA4 commands without maintaining a separate analytics wrapper.
            </p>
            <Link to="/docs/behavior-and-consent">Understand loading, tracking, and consent →</Link>
          </div>
          <CodeBlock language="tsx">{`import { useGoogleAnalytics } from 'tanstack-router-ga4';

export function SignupButton() {
  const { event } = useGoogleAnalytics();

  return (
    <button onClick={() => event('sign_up', {
      method: 'email',
    })}>
      Record signup
    </button>
  );
}`}</CodeBlock>
        </section>
        <section className={styles.reference}>
          <div>
            <h2>Documentation that follows the source.</h2>
            <p>
              Explore component props, hook commands, and exported types in the API reference generated from TypeScript
              and TSDoc on every build.
            </p>
          </div>
          <Link className={styles.primary} to="/docs/api">
            Browse the API →
          </Link>
        </section>
      </main>
    </Layout>
  );
}
