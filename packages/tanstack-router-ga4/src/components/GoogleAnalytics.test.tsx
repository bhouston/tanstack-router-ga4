import { render, waitFor } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as getGtagModule from '../lib/getGtag.js';

// Mock useLocation and ClientOnly so we can test script injection and page_view without full router
const mockGtag = vi.fn();
const mockLocation = vi.hoisted(() => ({ pathname: '/', href: '/' }));
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => mockLocation,
  ClientOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { GoogleAnalytics } from './GoogleAnalytics.js';

describe('GoogleAnalytics', () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockGtag.mockClear();
    mockLocation.pathname = '/';
    mockLocation.href = '/';
    window.history.replaceState(null, '', '/');
    document.head.innerHTML = '';
    const win = globalThis.window as unknown as Window & {
      gtag?: typeof mockGtag;
      dataLayer: unknown[];
    };
    win.dataLayer = [];
    win.gtag = mockGtag;
    appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => document.createElement('div'));
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('injects gtag script and calls config with send_page_view false', async () => {
    render(<GoogleAnalytics measurementId="G-DEMO" />);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith('js', expect.any(Date));
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-DEMO', {
        send_page_view: false,
      });
    });
  });

  it('does nothing when measurementId is empty', async () => {
    render(<GoogleAnalytics measurementId="" />);

    await waitFor(() => {
      expect(mockGtag).not.toHaveBeenCalled();
    });
    expect(appendChildSpy).not.toHaveBeenCalled();
  });

  it('does not initialize when gtag is unavailable', async () => {
    const getGtagSpy = vi.spyOn(getGtagModule, 'getGtag').mockReturnValue(undefined);

    render(<GoogleAnalytics measurementId="G-DEMO" />);

    await waitFor(() => {
      expect(getGtagSpy).toHaveBeenCalled();
    });
    expect(mockGtag).not.toHaveBeenCalled();
    expect(appendChildSpy).not.toHaveBeenCalled();

    getGtagSpy.mockRestore();
  });

  it('applies consent defaults before js and config', async () => {
    render(
      <GoogleAnalytics
        measurementId="G-DEMO"
        consentDefaults={{
          analytics_storage: 'denied',
          ad_storage: 'denied',
        }}
      />,
    );

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    });

    const consentCall = mockGtag.mock.calls.findIndex((call) => call[0] === 'consent');
    const jsCall = mockGtag.mock.calls.findIndex((call) => call[0] === 'js');
    const configCall = mockGtag.mock.calls.findIndex((call) => call[0] === 'config');
    expect(consentCall).toBeGreaterThanOrEqual(0);
    expect(jsCall).toBeGreaterThan(consentCall);
    expect(configCall).toBeGreaterThan(jsCall);
  });

  it('sends page_view with current pathname (from useLocation mock)', async () => {
    render(<GoogleAnalytics measurementId="G-DEMO" />);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'page_view',
        expect.objectContaining({
          page_path: '/',
        }),
      );
    });
  });

  it('reports the router destination even while the browser URL is stale', () => {
    window.history.replaceState(null, '', '/login');
    mockLocation.pathname = '/login';
    mockLocation.href = '/login';
    const { rerender } = render(<GoogleAnalytics measurementId="G-DEMO" deferred={false} />);
    mockGtag.mockClear();

    mockLocation.pathname = '/signup';
    mockLocation.href = '/signup?next=%2Faccount#email';
    rerender(<GoogleAnalytics measurementId="G-DEMO" deferred={false} />);

    expect(window.location.pathname).toBe('/login');
    expect(mockGtag).toHaveBeenCalledExactlyOnceWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/signup',
        page_location: `${window.location.origin}/signup?next=%2Faccount#email`,
      }),
    );
  });

  it('does not send extra page views for search, hash, or unrelated rerenders', () => {
    const { rerender } = render(<GoogleAnalytics measurementId="G-DEMO" deferred={false} />);
    mockGtag.mockClear();

    for (const href of ['/?q=test', '/?q=test#section', '/?q=test#section']) {
      mockLocation.href = href;
      rerender(<GoogleAnalytics measurementId="G-DEMO" deferred={false} />);
    }

    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('sends a page view when the measurement ID changes or is re-enabled', () => {
    const { rerender } = render(<GoogleAnalytics measurementId="G-DEMO" deferred={false} />);
    mockGtag.mockClear();

    rerender(<GoogleAnalytics measurementId="G-OTHER" deferred={false} />);
    expect(mockGtag.mock.calls.filter((call) => call[0] === 'event')).toHaveLength(1);

    rerender(<GoogleAnalytics measurementId="" deferred={false} />);
    mockGtag.mockClear();
    rerender(<GoogleAnalytics measurementId="G-OTHER" deferred={false} />);
    expect(mockGtag.mock.calls.filter((call) => call[0] === 'event')).toHaveLength(1);
  });

  it('creates and appends script with correct measurement ID', async () => {
    render(<GoogleAnalytics measurementId="G-OTHER" />);

    await waitFor(() => {
      expect(appendChildSpy).toHaveBeenCalled();
      const scriptElement = appendChildSpy.mock.calls.find((call: [Node]) =>
        (call[0] as HTMLScriptElement)?.src?.includes('googletagmanager.com'),
      )?.[0] as HTMLScriptElement | undefined;
      expect(scriptElement).toBeDefined();
      expect(scriptElement?.src).toContain('G-OTHER');
    });
  });

  it('reuses an existing gtag loader script for a different measurement ID', async () => {
    const existingScript = document.createElement('script');
    existingScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-FIRST';
    document.head.insertAdjacentElement('beforeend', existingScript);

    appendChildSpy.mockClear();

    render(<GoogleAnalytics measurementId="G-SECOND" />);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-SECOND', {
        send_page_view: false,
      });
    });

    const appendedLoaderScripts = appendChildSpy.mock.calls.filter((call: [Node]) =>
      (call[0] as HTMLScriptElement)?.src?.includes('googletagmanager.com/gtag/js'),
    );
    expect(appendedLoaderScripts).toHaveLength(0);

    existingScript.remove();
  });

  describe('dataLayer integration (Strategy 2)', () => {
    beforeEach(() => {
      const win = globalThis.window as unknown as Window & {
        gtag?: typeof mockGtag;
        dataLayer: unknown[];
      };
      win.dataLayer = [];
      // Use real gtag shape that pushes to dataLayer (as the component does)
      win.gtag = ((...args: unknown[]) => {
        win.dataLayer.push(args);
      }) as typeof mockGtag;
      appendChildSpy.mockRestore();
      appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => document.createElement('div'));
    });

    it('pushes config and page_view to dataLayer when mounted', async () => {
      render(<GoogleAnalytics measurementId="G-DEMO" />);

      await waitFor(() => {
        const dataLayer = (globalThis.window as Window & { dataLayer: unknown[] }).dataLayer;
        expect(dataLayer.length).toBeGreaterThanOrEqual(2);
        expect(dataLayer).toContainEqual(
          expect.arrayContaining(['config', 'G-DEMO', expect.objectContaining({ send_page_view: false })]),
        );
        expect(dataLayer).toContainEqual(
          expect.arrayContaining(['event', 'page_view', expect.objectContaining({ page_path: '/' })]),
        );
      });
    });
  });
});
