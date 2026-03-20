import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGtag } from './getGtag.js';

describe('getGtag', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns undefined when window is unavailable', () => {
    vi.stubGlobal('window', undefined);

    expect(getGtag()).toBeUndefined();
  });

  it('creates dataLayer and a fallback gtag when missing', () => {
    const win = {} as Window;
    vi.stubGlobal('window', win);

    const gtag = getGtag();

    expect(win.dataLayer).toEqual([]);
    expect(gtag).toBeTypeOf('function');
    expect(win.gtag).toBe(gtag);
  });

  it('reuses existing dataLayer and gtag instances', () => {
    const existingGtag = vi.fn() as unknown as Gtag;
    const existingDataLayer: unknown[] = [];
    const win = {
      dataLayer: existingDataLayer,
      gtag: existingGtag,
    } as Window;
    vi.stubGlobal('window', win);

    const gtag = getGtag();

    expect(gtag).toBe(existingGtag);
    expect(win.dataLayer).toBe(existingDataLayer);
  });
});
