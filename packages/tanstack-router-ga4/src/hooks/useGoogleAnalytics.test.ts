import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGoogleAnalytics } from "./useGoogleAnalytics.js";

describe("useGoogleAnalytics", () => {
  const mockGtag = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("window", { ...globalThis.window, gtag: mockGtag });
    mockGtag.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls window.gtag with event name and params when event is invoked", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.event("test_event", { page_path: "/x" });
    });

    expect(mockGtag).toHaveBeenCalledTimes(1);
    expect(mockGtag).toHaveBeenCalledWith("event", "test_event", {
      page_path: "/x",
    });
  });

  it("calls window.gtag with config when config is invoked", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.config("G-DEMO", { debug_mode: true, send_page_view: false });
    });

    expect(mockGtag).toHaveBeenCalledWith("config", "G-DEMO", {
      debug_mode: true,
      send_page_view: false,
    });
  });

  it("calls window.gtag with get when get is invoked", () => {
    const { result } = renderHook(() => useGoogleAnalytics());
    const callback = vi.fn();

    act(() => {
      result.current.get("G-DEMO", "client_id", callback);
    });

    expect(mockGtag).toHaveBeenCalledWith("get", "G-DEMO", "client_id", callback);
  });

  it("calls window.gtag with global set params", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.set({ currency: "USD", user_id: "user-123" });
    });

    expect(mockGtag).toHaveBeenCalledWith("set", {
      currency: "USD",
      user_id: "user-123",
    });
  });

  it("calls window.gtag with consent params", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.consent("update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    });

    expect(mockGtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
    });
  });

  it("calls gtag with recommended event and typed params", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.event("generate_lead", { currency: "USD", value: 1 });
    });

    expect(mockGtag).toHaveBeenCalledWith("event", "generate_lead", {
      currency: "USD",
      value: 1,
    });
  });

  it("returns a stable API object and stable members across rerenders", () => {
    const { result, rerender } = renderHook(() => useGoogleAnalytics());

    const firstApi = result.current;
    const firstEvent = result.current.event;
    const firstConfig = result.current.config;
    const firstGet = result.current.get;
    const firstSet = result.current.set;
    const firstConsent = result.current.consent;

    rerender();

    expect(result.current).toBe(firstApi);
    expect(result.current.event).toBe(firstEvent);
    expect(result.current.config).toBe(firstConfig);
    expect(result.current.get).toBe(firstGet);
    expect(result.current.set).toBe(firstSet);
    expect(result.current.consent).toBe(firstConsent);
  });

  it("does not throw when gtag methods are called without gtag", () => {
    const { result } = renderHook(() => useGoogleAnalytics());
    const win = globalThis.window as unknown as Window & { gtag?: typeof mockGtag };
    const savedGtag = win.gtag;
    delete (win as unknown as Record<string, unknown>).gtag;

    expect(() => {
      act(() => {
        result.current.event("test_event", { page_path: "/y" });
        result.current.config("G-DEMO", { send_page_view: false });
        result.current.get("G-DEMO", "client_id", vi.fn());
        result.current.set({ currency: "USD" });
        result.current.consent("default", { analytics_storage: "denied" });
      });
    }).not.toThrow();
    expect(mockGtag).not.toHaveBeenCalled();

    if (savedGtag !== undefined) {
      win.gtag = savedGtag;
    }
  });

  describe("dataLayer integration (Strategy 2)", () => {
    beforeEach(() => {
      const win = globalThis.window as Window & { gtag?: Gtag; dataLayer: unknown[] };
      win.dataLayer = [];
      win.gtag = ((...args: unknown[]) => {
        win.dataLayer.push(args);
      }) as Gtag;
      mockGtag.mockClear();
      vi.stubGlobal("window", win);
    });

    it("pushes multiple command types to dataLayer", () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      act(() => {
        result.current.set({ currency: "USD" });
        result.current.config("G-DEMO", { send_page_view: false });
        result.current.event("sign_up", { method: "email" });
        result.current.consent("update", { analytics_storage: "granted" });
      });

      const dataLayer = (globalThis.window as Window & { dataLayer: unknown[] }).dataLayer;
      expect(dataLayer).toContainEqual(["set", { currency: "USD" }]);
      expect(dataLayer).toContainEqual(["config", "G-DEMO", { send_page_view: false }]);
      expect(dataLayer).toContainEqual(["event", "sign_up", { method: "email" }]);
      expect(dataLayer).toContainEqual(["consent", "update", { analytics_storage: "granted" }]);
    });
  });
});
