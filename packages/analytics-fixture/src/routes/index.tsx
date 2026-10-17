import { createFileRoute, Link } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
  component: () => (
    <>
      <h1>tanstack-router-ga4 browser fixture</h1>
      <p>Local regression coverage for analytics commands and navigation.</p>
      <Link to="/tests/lead-gen">Generate lead</Link>
    </>
  ),
});
