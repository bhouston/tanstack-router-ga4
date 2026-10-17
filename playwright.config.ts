import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT || 3100);
const baseURL = `http://localhost:${port}`;
const docsPort = port + 1;
const docsURL = `http://localhost:${docsPort}/tanstack-router-ga4/`;

export default defineConfig({
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'analytics',
      testDir: './packages/analytics-fixture/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'documentation',
      testDir: './packages/website/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: docsURL },
    },
    {
      name: 'documentation-mobile',
      testDir: './packages/website/e2e',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', baseURL: docsURL },
    },
  ],
  webServer: [
    {
      command: `pnpm --filter analytics-fixture exec vite dev --port ${port} --strictPort`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `pnpm --filter @tanstack-router-ga4/website exec docusaurus serve --port ${docsPort} --no-open`,
      url: docsURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
