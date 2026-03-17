import { render, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock useLocation and ClientOnly so we can test script injection and page_view without full router
const mockGtag = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/" }),
  ClientOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { GoogleAnalytics } from "./GoogleAnalytics.js";

describe("GoogleAnalytics", () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockGtag.mockClear();
    const win = globalThis.window as unknown as Window & { gtag?: typeof mockGtag; dataLayer: unknown[] };
    win.dataLayer = [];
    win.gtag = mockGtag;
    appendChildSpy = vi.spyOn(document.head, "appendChild").mockImplementation(() => document.createElement("div"));
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("injects gtag script and calls config with send_page_view false", async () => {
    render(<GoogleAnalytics measurementId="G-DEMO" />);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith("js", expect.any(Date));
      expect(mockGtag).toHaveBeenCalledWith("config", "G-DEMO", {
        send_page_view: false,
      });
    });
  });

  it("sends page_view with current pathname (from useLocation mock)", async () => {
    render(<GoogleAnalytics measurementId="G-DEMO" />);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith(
        "event",
        "page_view",
        expect.objectContaining({
          page_path: "/",
        }),
      );
    });
  });

  it("creates and appends script with correct measurement ID", async () => {
    render(<GoogleAnalytics measurementId="G-OTHER" />);

    await waitFor(() => {
      expect(appendChildSpy).toHaveBeenCalled();
      const scriptElement = appendChildSpy.mock.calls.find((call: [Node]) =>
        (call[0] as HTMLScriptElement)?.src?.includes("googletagmanager.com"),
      )?.[0] as HTMLScriptElement | undefined;
      expect(scriptElement).toBeDefined();
      expect(scriptElement?.src).toContain("G-OTHER");
    });
  });

  describe("dataLayer integration (Strategy 2)", () => {
    beforeEach(() => {
      const win = globalThis.window as unknown as Window & { gtag?: typeof mockGtag; dataLayer: unknown[] };
      win.dataLayer = [];
      // Use real gtag shape that pushes to dataLayer (as the component does)
      win.gtag = ((...args: unknown[]) => {
        win.dataLayer.push(args);
      }) as typeof mockGtag;
      appendChildSpy.mockRestore();
      appendChildSpy = vi.spyOn(document.head, "appendChild").mockImplementation(() => document.createElement("div"));
    });

    it("pushes config and page_view to dataLayer when mounted", async () => {
      render(<GoogleAnalytics measurementId="G-DEMO" />);

      await waitFor(() => {
        const dataLayer = (globalThis.window as Window & { dataLayer: unknown[] }).dataLayer;
        expect(dataLayer.length).toBeGreaterThanOrEqual(2);
        expect(dataLayer).toContainEqual(
          expect.arrayContaining(["config", "G-DEMO", expect.objectContaining({ send_page_view: false })]),
        );
        expect(dataLayer).toContainEqual(
          expect.arrayContaining([
            "event",
            "page_view",
            expect.objectContaining({ page_path: "/" }),
          ]),
        );
      });
    });
  });
});
