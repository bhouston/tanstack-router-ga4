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

  it("calls window.gtag with event name and params when trackEvent is invoked", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.trackEvent("test_event", { page_path: "/x" });
    });

    expect(mockGtag).toHaveBeenCalledTimes(1);
    expect(mockGtag).toHaveBeenCalledWith("event", "test_event", {
      page_path: "/x",
    });
  });

  it("returns isReady true when window.gtag is defined", () => {
    const { result } = renderHook(() => useGoogleAnalytics());
    expect(result.current.isReady).toBe(true);
  });

  it("does not throw when trackEvent is called without gtag (e.g. SSR)", () => {
    vi.stubGlobal("window", { ...globalThis.window, gtag: undefined });

    const { result } = renderHook(() => useGoogleAnalytics());
    expect(result.current.isReady).toBe(false);

    expect(() => {
      act(() => {
        result.current.trackEvent("test_event", { page_path: "/y" });
      });
    }).not.toThrow();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it("calls gtag with recommended event and typed params", () => {
    const { result } = renderHook(() => useGoogleAnalytics());

    act(() => {
      result.current.trackEvent("generate_lead", { currency: "USD", value: 1 });
    });

    expect(mockGtag).toHaveBeenCalledWith("event", "generate_lead", {
      currency: "USD",
      value: 1,
    });
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

    it("pushes event to dataLayer when trackEvent is called", () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      act(() => {
        result.current.trackEvent("sign_up", { method: "email" });
      });

      const dataLayer = (globalThis.window as Window & { dataLayer: unknown[] }).dataLayer;
      expect(dataLayer).toContainEqual(
        expect.arrayContaining(["event", "sign_up", expect.objectContaining({ method: "email" })]),
      );
    });

    it("pushes multiple events to dataLayer in order", () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      act(() => {
        result.current.trackEvent("generate_lead", { value: 1 });
        result.current.trackEvent("login", { method: "google" });
      });

      const dataLayer = (globalThis.window as Window & { dataLayer: unknown[] }).dataLayer;
      expect(dataLayer).toHaveLength(2);
      expect(dataLayer[0]).toEqual(["event", "generate_lead", { value: 1 }]);
      expect(dataLayer[1]).toEqual(["event", "login", { method: "google" }]);
    });

    it("pushes event with undefined params as gtag('event', name)", () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      act(() => {
        result.current.trackEvent("custom_event");
      });

      const dataLayer = (globalThis.window as Window & { dataLayer: unknown[] }).dataLayer;
      expect(dataLayer).toContainEqual(expect.arrayContaining(["event", "custom_event"]));
    });
  });
});
