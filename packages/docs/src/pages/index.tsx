import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';

const guides = [
  {
    label: 'Start here',
    title: 'Getting started',
    href: '/docs/getting-started',
    body: 'Install the package, mount GoogleAnalytics in your root route, and confirm the first page view.',
  },
  {
    label: 'Recipes',
    title: 'Examples',
    href: '/docs/examples',
    body: 'Track signups and leads, set user IDs, and read the client ID with the useGoogleAnalytics hook.',
  },
  {
    label: 'Concepts',
    title: 'Behavior and consent',
    href: '/docs/behavior-and-consent',
    body: 'When page views fire, how loading is deferred, what happens during server rendering, and where consent fits.',
  },
  {
    label: 'Reference',
    title: 'API reference',
    href: '/docs/api',
    body: 'Component props, hook commands, and exported types, generated from the TSDoc comments in the source.',
  },
];
const workflow = [
  ['Install', 'One npm package for TanStack Router apps'],
  ['Mount', 'GoogleAnalytics once in your root route'],
  ['Navigate', 'A page_view per pathname change'],
  ['Track', 'Typed events from one hook'],
];

export default function Home() {
  return (
    <Layout
      title="GA4 analytics that follows your router"
      description="Google Analytics 4 for TanStack Router and TanStack Start. Automatic page views, typed event helpers, and client-only initialization for React apps."
    >
      <header className="home-hero container">
        <div>
          <p className="eyebrow">TanStack Router · TanStack Start · GA4</p>
          <h1>
            Your routes.
            <br />
            <em>Your analytics. Connected.</em>
          </h1>
          <p className="hero-description">
            Client-side navigation does not reload the page, so GA4 never sees it. Mount one component and every
            pathname change becomes a page view, then record the actions that matter with typed event helpers.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary button--lg" to="/docs/getting-started">
              Get started <span aria-hidden>→</span>
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/examples">
              See examples
            </Link>
          </div>
        </div>
        <figure className="hero-preview">
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
        </figure>
      </header>
      <main>
        <section className="workflow-band" aria-label="Setup steps">
          <div className="container workflow-steps">
            {workflow.map(([title, detail], index) => (
              <div key={title}>
                <span className="workflow-number">0{index + 1}</span>
                <strong>{title}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="container story-section" aria-labelledby="events-title">
          <div>
            <p className="eyebrow">Beyond page views</p>
            <h2 id="events-title">
              From the first visit
              <br />
              to the next conversion.
            </h2>
            <p>
              Recommended events such as <code>sign_up</code> and <code>login</code> are typed, and custom events accept
              any name. The same hook sets user properties and sends consent updates from your own consent interface, so
              there is no separate analytics wrapper to maintain.
            </p>
            <div className="story-links">
              <Link className="button button--primary" to="/docs/examples">
                Browse the examples
              </Link>
            </div>
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
        <section className="workflow-band">
          <div className="container story-section">
            <div>
              <p className="eyebrow">Fits your app shell</p>
              <h2>
                Client only.
                <br />
                Out of the way.
              </h2>
              <p>
                The component renders nothing during server rendering and initializes GA4 in the browser. By default it
                waits for browser idle time, and you can turn that off to load immediately.
              </p>
              <div className="story-links">
                <Link to="/docs/behavior-and-consent">Understand loading, tracking, and consent →</Link>
              </div>
            </div>
            <CodeBlock language="tsx">{`<GoogleAnalytics
  measurementId="G-XXXXXXXXXX"
  deferred={false}
  consentDefaults={{ analytics_storage: 'denied' }}
/>`}</CodeBlock>
          </div>
        </section>
        <section className="container package-section" aria-labelledby="guides-title">
          <div className="section-heading">
            <p className="eyebrow">Documentation</p>
            <h2 id="guides-title">Find what you need.</h2>
            <p>Guides for setup and behavior, plus an API reference generated from the source on every build.</p>
          </div>
          <div className="package-grid">
            {guides.map((guide) => (
              <Link key={guide.title} className="package-card" to={guide.href}>
                <p className="package-label">{guide.label}</p>
                <h3>{guide.title}</h3>
                <p>{guide.body}</p>
                <span>Read more →</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="container home-callout">
          <p className="eyebrow">Add it to your app</p>
          <h2>One package. One component.</h2>
          <CodeBlock language="bash">npm install tanstack-router-ga4</CodeBlock>
          <div className="hero-actions">
            <Link className="button button--primary button--lg" to="/docs/getting-started">
              Read the guide
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/api">
              Browse the API
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
