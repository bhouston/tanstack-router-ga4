import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { GoogleAnalytics } from 'tanstack-router-ga4';
import { DEMO_MEASUREMENT_ID } from '../lib/googleAnalytics';
export const Route = createRootRoute({
  component: () => (
    <>
      <GoogleAnalytics measurementId={DEMO_MEASUREMENT_ID} deferred={false} />
      <nav>
        <Link to="/">Fixture home</Link> · <Link to="/tests">Test routes</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  ),
});
