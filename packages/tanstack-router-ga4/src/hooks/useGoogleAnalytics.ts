import { useMemo } from 'react';
import { getGtag } from '../lib/getGtag.js';
import type {
  GoogleAnalyticsConfig,
  GoogleAnalyticsConsentMode,
  GoogleAnalyticsConsentParams,
  GoogleAnalyticsEventParams,
  GoogleAnalyticsGettableFieldName,
  GoogleAnalyticsRecommendedEventName,
  GoogleAnalyticsRecommendedEventParamsMap,
  GoogleAnalyticsSetParams,
} from '../types/googleAnalytics.js';

/** Event command with suggestions for supported recommended events and an open custom-event overload. */
export type GoogleAnalyticsCommandEvent = {
  <TEventName extends GoogleAnalyticsRecommendedEventName>(
    eventName: TEventName,
    params: GoogleAnalyticsRecommendedEventParamsMap[TEventName],
  ): void;
  (eventName: string, params?: GoogleAnalyticsEventParams): void;
};

/**
 * Returns stable helpers for gtag commands: set, config, event, consent, and get.
 *
 * Commands are safe to call during SSR (they do nothing without a browser).
 * Browser calls create the gtag queue if needed; mount {@link GoogleAnalytics} to load the GA script.
 * The get callback requires a working GA script and may never run if loading is blocked.
 *
 * @example
 * ```tsx
 * const { event } = useGoogleAnalytics();
 * event('sign_up', { method: 'email' });
 * event('editor_opened', { tool: 'brush' });
 * ```
 */
export function useGoogleAnalytics() {
  return useMemo(() => {
    return {
      /** Sets shared parameters for subsequent events. */
      set: (params: GoogleAnalyticsSetParams) => {
        getGtag()?.('set', params);
      },
      /** Configures a stream. Set send_page_view to false to avoid an extra automatic page view. */
      config: (measurementId: string, configParams?: GoogleAnalyticsConfig) => {
        getGtag()?.('config', measurementId, configParams);
      },
      /** Sends a recommended or custom event with optional parameters. */
      event: ((eventName: string, params?: GoogleAnalyticsEventParams) => {
        getGtag()?.('event', eventName, params);
      }) as GoogleAnalyticsCommandEvent,
      /** Queues consent defaults or an update from your own consent interface. */
      consent: (mode: GoogleAnalyticsConsentMode, params: GoogleAnalyticsConsentParams) => {
        getGtag()?.('consent', mode, params);
      },
      /** Requests a field asynchronously; the callback is invoked by the loaded GA script. */
      get: (measurementId: string, fieldName: GoogleAnalyticsGettableFieldName, callback: (value?: string) => void) => {
        getGtag()?.('get', measurementId, fieldName, callback);
      },
    };
  }, []);
}
