import { useEffect, useState } from 'react';

export function useIdleReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (!browserWindow.requestIdleCallback) {
      // requestIdleCallback is not supported (e.g. Safari); skip deferral and render immediately
      // oxlint-disable-next-line react/set-state-in-effect -- no requestIdleCallback (Safari): render immediately, intentional
      setIsReady(true);
      return;
    }

    let cancelled = false;
    const idleId = browserWindow.requestIdleCallback(() => {
      if (!cancelled) {
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
      browserWindow.cancelIdleCallback?.(idleId);
    };
  }, []);

  return isReady;
}
