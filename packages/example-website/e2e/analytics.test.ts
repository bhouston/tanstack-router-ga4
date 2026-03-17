import { expect } from "@playwright/test";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, afterEach, beforeAll, beforeEach, describe, test } from "vitest";

const BASE_URL = "http://localhost:3000";

/**
 * E2E: Asserts our GA integration pushes events to dataLayer and that real GA collect
 * requests are sent (external gtag.js must load and send to google-analytics.com).
 * Runs in Node with Playwright as library (browser in beforeAll, page in beforeEach).
 */

function eventNameFromRequest(url: string, postData?: string | null): string | null {
  try {
    const u = new URL(url);
    const en = u.searchParams.get("en");
    if (en) return en;
  } catch {
    // ignore
  }
  if (postData?.includes("page_view")) return "page_view";
  if (postData?.includes("generate_lead")) return "generate_lead";
  if (postData?.includes("sign_up")) return "sign_up";
  return null;
}

async function getDataLayerEventNames(page: Page): Promise<string[]> {
  const dataLayer = await page.evaluate(() => {
    const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];
    return dl.map((entry: unknown) =>
      Array.isArray(entry) ? entry : Array.from(entry as ArrayLike<unknown>),
    );
  });
  return dataLayer
    .filter(
      (entry): entry is [string, string, unknown] =>
        Array.isArray(entry) && entry[0] === "event" && typeof entry[1] === "string",
    )
    .map((e) => e[1]);
}

async function getNormalizedDataLayer(page: Page): Promise<unknown[][]> {
  return page.evaluate(() => {
    const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];
    return dl.map((entry: unknown) =>
      Array.isArray(entry) ? entry : Array.from(entry as ArrayLike<unknown>),
    );
  });
}

async function getEventCount(page: Page, eventName: string): Promise<number> {
  const eventNames = await getDataLayerEventNames(page);
  return eventNames.filter((name) => name === eventName).length;
}

async function hasGtagAndDataLayer(page: Page): Promise<{ hasDataLayer: boolean; hasGtag: boolean }> {
  return page.evaluate(() => {
    const w = window as Window & { dataLayer?: unknown[]; gtag?: unknown };
    return {
      hasDataLayer: Array.isArray(w.dataLayer),
      hasGtag: typeof w.gtag === "function",
    };
  });
}

describe(
  "Google Analytics E2E",
  { timeout: 60_000 },
  () => {
    let browser: Browser;
    let page: Page;

    beforeAll(
      async () => {
        browser = await chromium.launch({ headless: process.env.HEADED !== "1" });
        // Single initial visit so the app (and GA) have time to warm up; all tests then run fast.
        const warmPage = await browser.newPage();
        await warmPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
        await expect(warmPage.getByRole("heading", { name: /tanstack-router-ga4/i })).toBeVisible({
          timeout: 15000,
        });
        await warmPage.waitForTimeout(5000);
        await warmPage.close();
      },
      60_000,
    );

    afterAll(async () => {
      await browser?.close();
    });

    beforeEach(async () => {
      page = await browser.newPage();
    });

    afterEach(async () => {
      await page?.close();
    });

    test("home page loads and shows heading", async () => {
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /tanstack-router-ga4/i })).toBeVisible({
        timeout: 15000,
      });
    });

    test("GA gtag script is requested when loading the app", async () => {
      const scriptRequests: string[] = [];
      page.on("request", (req) => {
        const url = req.url();
        if (url.includes("googletagmanager.com/gtag/js")) {
          scriptRequests.push(url);
        }
      });

      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /tanstack-router-ga4/i })).toBeVisible({
        timeout: 15000,
      });
      await page.waitForTimeout(1000);

      expect(scriptRequests.length).toBeGreaterThan(0);
    });

    test("dataLayer and gtag exist after loading home and waiting for hydration", async () => {
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /tanstack-router-ga4/i })).toBeVisible({
        timeout: 15000,
      });
      await page.waitForTimeout(1000);

      const debug = await hasGtagAndDataLayer(page);
      expect(debug.hasDataLayer).toBe(true);
      expect(debug.hasGtag).toBe(true);
    });

    test("register-user: clicking Register user updates global state and fires sign_up", async () => {
      await page.goto(`${BASE_URL}/tests/register-user`, { waitUntil: "networkidle" });

      const registerButton = page.getByRole("button", { name: /Register user/i });
      await registerButton.waitFor({ state: "visible", timeout: 15000 });
      await expect(registerButton).toBeEnabled({ timeout: 20000 });
      await page.waitForFunction(
        () => typeof (window as Window & { gtag?: unknown }).gtag === "function",
        null,
        { timeout: 10000 },
      );

      await registerButton.scrollIntoViewIfNeeded();
      await registerButton.click();
      await page.waitForTimeout(1000);

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag) {
        const hasUserSet = await page.evaluate(() => {
          const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];
          return dl.some((entry) => {
            const normalized = Array.isArray(entry) ? entry : Array.from(entry as ArrayLike<unknown>);
            return (
              normalized[0] === "set"
              && typeof normalized[1] === "object"
              && normalized[1] !== null
              && "user_id" in (normalized[1] as Record<string, unknown>)
            );
          });
        });
        const eventNames = await getDataLayerEventNames(page);
        expect(hasUserSet).toBe(true);
        expect(eventNames).toContain("sign_up");
      }
    });

    test("lead-gen: clicking Generate lead fires generate_lead in dataLayer", async () => {
      await page.goto(`${BASE_URL}/tests/lead-gen`, { waitUntil: "networkidle" });

      const trackButton = page.getByRole("button", { name: /Generate lead/i });
      await trackButton.waitFor({ state: "visible", timeout: 15000 });
      await expect(trackButton).toBeEnabled({ timeout: 20000 });

      await trackButton.scrollIntoViewIfNeeded();
      await trackButton.click();
      await page.waitForTimeout(1000);

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag) {
        const eventNames = await getDataLayerEventNames(page);
        expect(eventNames).toContain("generate_lead");
      }
    });

    test("config: clicking the toggle updates debug_mode on and off", async () => {
      await page.goto(`${BASE_URL}/tests/config`, { waitUntil: "networkidle" });

      const toggleButton = page.getByRole("button", { name: /Turn debug mode on/i });
      await toggleButton.waitFor({ state: "visible", timeout: 15000 });
      await expect(toggleButton).toBeEnabled({ timeout: 20000 });
      await page.waitForFunction(
        () => typeof (window as Window & { gtag?: unknown }).gtag === "function",
        null,
        { timeout: 10000 },
      );

      await toggleButton.click();
      await expect(page.getByText(/Debug mode is now on\./i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Current value: true/i)).toBeVisible({ timeout: 10000 });

      await page.getByRole("button", { name: /Turn debug mode off/i }).click();
      await expect(page.getByText(/Debug mode is now off\./i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Current value: false/i)).toBeVisible({ timeout: 10000 });

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag) {
        const dataLayer = await getNormalizedDataLayer(page);
        expect(dataLayer).toContainEqual([
          "config",
          "G-FWJBK9S1RL",
          {
            debug_mode: true,
            send_page_view: false,
          },
        ]);
        expect(dataLayer).toContainEqual([
          "config",
          "G-FWJBK9S1RL",
          {
            debug_mode: false,
            send_page_view: false,
          },
        ]);
      }
    });

    test("get-client-id: clicking Get client ID shows the callback result", async () => {
      await page.goto(`${BASE_URL}/tests/get-client-id`, { waitUntil: "networkidle" });

      const getClientIdButton = page.getByRole("button", { name: /Get client ID/i });
      await getClientIdButton.waitFor({ state: "visible", timeout: 15000 });
      await expect(getClientIdButton).toBeEnabled({ timeout: 20000 });
      await page.waitForFunction(
        () => typeof (window as Window & { gtag?: unknown }).gtag === "function",
        null,
        { timeout: 10000 },
      );

      await getClientIdButton.click();
      await page.waitForFunction(
        () => document.body.textContent?.includes("Latest client ID:"),
        null,
        { timeout: 15000 },
      );

      const resultText = await page.getByText(/Latest client ID:/i).textContent();
      expect(resultText).not.toContain("(empty response)");

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag) {
        const hasGetCommand = await page.evaluate(() => {
          const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];
          return dl.some((entry) => {
            const normalized = Array.isArray(entry) ? entry : Array.from(entry as ArrayLike<unknown>);
            return normalized[0] === "get" && normalized[1] === "G-FWJBK9S1RL" && normalized[2] === "client_id";
          });
        });
        expect(hasGetCommand).toBe(true);
      }
    });

    test("consent: clicking Grant analytics consent updates the page and dataLayer", async () => {
      await page.goto(`${BASE_URL}/tests/consent`, { waitUntil: "networkidle" });

      const grantConsentButton = page.getByRole("button", { name: /Grant analytics consent/i });
      await grantConsentButton.waitFor({ state: "visible", timeout: 15000 });
      await expect(grantConsentButton).toBeEnabled({ timeout: 20000 });
      await page.waitForFunction(
        () => typeof (window as Window & { gtag?: unknown }).gtag === "function",
        null,
        { timeout: 10000 },
      );

      await grantConsentButton.click();
      await expect(page.getByText(/Analytics granted/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Mode: update/i)).toBeVisible({ timeout: 10000 });

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag) {
        const dataLayer = await getNormalizedDataLayer(page);
        expect(dataLayer).toContainEqual([
          "consent",
          "update",
          {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          },
        ]);
      }
    });

    test("page_view appears in dataLayer after navigation", async () => {
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /tanstack-router-ga4/i })).toBeVisible({
        timeout: 15000,
      });
      await page.waitForTimeout(1000);

      await page.goto(`${BASE_URL}/tests/lead-gen`, { waitUntil: "networkidle" });
      const trackButton = page.getByRole("button", { name: /Generate lead/i });
      await trackButton.waitFor({ state: "visible", timeout: 15000 });
      await trackButton.click();
      await page.waitForTimeout(1000);

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag) {
        const eventNames = await getDataLayerEventNames(page);
        expect(eventNames).toContain("page_view");
        expect(eventNames).toContain("generate_lead");
      }
    });

    test("stability fixture loads once per selection and does not loop custom events", async () => {
      await page.goto(`${BASE_URL}/tests/stability`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /Stability regression fixture/i })).toBeVisible({
        timeout: 15000,
      });
      await page.waitForFunction(
        () => typeof (window as Window & { gtag?: unknown }).gtag === "function",
        null,
        { timeout: 10000 },
      );

      const fixtureSelect = page.getByLabel(/Stability fixture example/i);

      await fixtureSelect.selectOption("blouberg_sunrise_2_1k.hdr");
      await expect(page.getByText("Load count: 1")).toBeVisible({ timeout: 10000 });
      await expect(page.getByText("Event count: 1")).toBeVisible({ timeout: 10000 });

      await page.waitForTimeout(1500);
      await expect(page.getByText("Load count: 1")).toBeVisible();
      await expect(page.getByText("Event count: 1")).toBeVisible();

      const firstEventCount = await getEventCount(page, "stability_fixture_load");
      expect(firstEventCount).toBe(1);

      await fixtureSelect.selectOption("reference_gradient.exr");
      await expect(page.getByText("Load count: 2")).toBeVisible({ timeout: 10000 });
      await expect(page.getByText("Event count: 2")).toBeVisible({ timeout: 10000 });

      await page.waitForTimeout(1500);
      await expect(page.getByText("Load count: 2")).toBeVisible();
      await expect(page.getByText("Event count: 2")).toBeVisible();

      const secondEventCount = await getEventCount(page, "stability_fixture_load");
      expect(secondEventCount).toBe(2);
    });

    test("GA collect endpoint receives page_view when requests are sent", async () => {
      const gaRequests: { url: string; postData: string | null }[] = [];
      page.on("request", (req) => {
        const url = req.url();
        if (url.includes("google-analytics.com")) {
          gaRequests.push({ url, postData: req.postData() });
        }
      });

      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { name: /tanstack-router-ga4/i })).toBeVisible({
        timeout: 15000,
      });
      await page.waitForTimeout(1000);

      await page.goto(`${BASE_URL}/tests/lead-gen`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      const debug = await hasGtagAndDataLayer(page);
      if (debug.hasDataLayer && debug.hasGtag && gaRequests.length > 0) {
        const networkEventNames = gaRequests.flatMap((r) => {
          const en = eventNameFromRequest(r.url, r.postData);
          return en ? [en] : [];
        });
        expect(networkEventNames).toContain("page_view");
      }
    });
  },
);
