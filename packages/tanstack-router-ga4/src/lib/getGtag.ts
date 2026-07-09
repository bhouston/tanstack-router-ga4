declare global {
  type Gtag = {
    (command: 'js', date: Date): void;
    (command: 'config', measurementId: string, config?: Record<string, unknown>): void;
    (command: 'get', measurementId: string, fieldName: string, callback?: (value?: string) => void): void;
    (command: 'set', params: Record<string, unknown>): void;
    (command: 'event', eventName: string, params?: Record<string, unknown>): void;
    (command: 'consent', mode: 'default' | 'update', params: Record<string, unknown>): void;
  };

  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
  }
}

// oxlint-disable-next-line prefer-rest-params -- GA4 requires the native Arguments object
function gtag() {
  window.dataLayer.push(arguments);
}

export function getGtag(): Window['gtag'] | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = gtag as unknown as Gtag;
  }

  return window.gtag;
}
