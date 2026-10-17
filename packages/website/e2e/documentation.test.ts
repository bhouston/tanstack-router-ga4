import path from 'node:path';
import { expect, test } from '@playwright/test';

test('homepage links reach guides and generated API without runtime errors', async ({ page, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseURL!);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your routes.');
  await page.getByRole('link', { name: 'Get started →', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
  await page.goto(`${baseURL}docs/examples/`);
  await expect(page.getByRole('heading', { name: /^Read the client ID/ })).toBeVisible();
  await page.goto(`${baseURL}docs/api/`);
  await page.locator('main').getByRole('link', { name: 'GoogleAnalytics', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Function: GoogleAnalytics()');
  await expect(page.locator('main')).toContainText('measurementId');
  expect(errors).toEqual([]);
});

test('layout fits the viewport in both color themes', async ({ page, baseURL }, testInfo) => {
  await page.goto(baseURL!);
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (process.env.SWARM_ARTIFACTS) {
      await page.screenshot({
        path: path.join(process.env.SWARM_ARTIFACTS, `${testInfo.project.name}-${theme}.png`),
        fullPage: true,
      });
    }
  }
});
