import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIdleReady } from './useIdleReady.js';

describe('useIdleReady', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('no requestIdleCallback (e.g. Safari)', () => {
    beforeEach(() => {
      const win = globalThis.window as Window & {
        requestIdleCallback?: unknown;
        cancelIdleCallback?: unknown;
      };
      const { requestIdleCallback: _ric, cancelIdleCallback: _cic, ...rest } = win as unknown as Record<string, unknown>;
      vi.stubGlobal('window', rest);
    });

    it('returns true immediately when requestIdleCallback is unavailable', async () => {
      const { result } = renderHook(() => useIdleReady());

      await act(async () => {});

      expect(result.current).toBe(true);
    });
  });

  describe('requestIdleCallback path', () => {
    let capturedCallback: (() => void) | null = null;
    let capturedId: number;
    const mockCancelIdleCallback = vi.fn();

    beforeEach(() => {
      capturedCallback = null;
      capturedId = 42;
      mockCancelIdleCallback.mockClear();

      const mockRequestIdleCallback = vi.fn((cb: () => void) => {
        capturedCallback = cb;
        return capturedId;
      });

      vi.stubGlobal('window', {
        ...globalThis.window,
        requestIdleCallback: mockRequestIdleCallback,
        cancelIdleCallback: mockCancelIdleCallback,
      });
    });

    it('returns false before idle fires', () => {
      const { result } = renderHook(() => useIdleReady());
      expect(result.current).toBe(false);
    });

    it('returns true after idle callback fires', async () => {
      const { result } = renderHook(() => useIdleReady());

      expect(result.current).toBe(false);

      await act(async () => {
        capturedCallback?.();
      });

      expect(result.current).toBe(true);
    });

    it('cancels idle callback on unmount', () => {
      const { unmount } = renderHook(() => useIdleReady());
      unmount();
      expect(mockCancelIdleCallback).toHaveBeenCalledWith(capturedId);
    });

    it('does not set ready after unmount', async () => {
      const { result, unmount } = renderHook(() => useIdleReady());
      unmount();

      await act(async () => {
        capturedCallback?.();
      });

      expect(result.current).toBe(false);
    });
  });
});
