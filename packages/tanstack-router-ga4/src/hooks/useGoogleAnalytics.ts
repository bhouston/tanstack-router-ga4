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

/**
 * Signature of the `event` command: typed parameters for recommended events, plus an open overload for custom events.
 *
 * @example
 * ```ts
 * event('sign_up', { method: 'email' });
 * event('editor_opened', { tool: 'brush' });
 * ```
 */
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
 * The returned object is memoized for the lifetime of the component, so it is safe in effect dependency arrays.
 *
 * Commands are safe to call during SSR (they do nothing without a browser).
 * Browser calls create the gtag queue if needed; mount {@link GoogleAnalytics} to load the GA script.
 * The get callback requires a working GA script and may never run if loading is blocked.
 *
 * @returns An object with the `set`, `config`, `event`, `consent`, and `get` commands.
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
      /**
       * Sets shared parameters for subsequent events.
       *
       * @param params - Parameters to apply to later events.
       */
      set: (params: GoogleAnalyticsSetParams) => {
        getGtag()?.('set', params);
      },
      /**
       * Configures a stream. Set `send_page_view` to `false` to avoid an extra automatic page view.
       *
       * @param measurementId - GA4 web stream measurement ID, such as `G-XXXXXXXXXX`.
       * @param configParams - Optional stream configuration.
       */
      config: (measurementId: string, configParams?: GoogleAnalyticsConfig) => {
        getGtag()?.('config', measurementId, configParams);
      },
      /**
       * Sends a recommended or custom event with optional parameters.
       *
       * @param eventName - A recommended event name or any custom event name.
       * @param params - Event parameters; required for recommended events that need them.
       */
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- cast widens the public type to the overloaded GoogleAnalyticsCommandEvent
      event: ((eventName: string, params?: GoogleAnalyticsEventParams) => {
        getGtag()?.('event', eventName, params);
      }) as GoogleAnalyticsCommandEvent,
      /**
       * Queues consent defaults or an update from your own consent interface.
       *
       * @param mode - `default` for the initial state, `update` after the user chooses.
       * @param params - Consent states to apply.
       */
      consent: (mode: GoogleAnalyticsConsentMode, params: GoogleAnalyticsConsentParams) => {
        getGtag()?.('consent', mode, params);
      },
      /**
       * Requests a field asynchronously; the callback is invoked by the loaded GA script.
       *
       * @param measurementId - GA4 web stream measurement ID.
       * @param fieldName - The field to read, such as `client_id`.
       * @param callback - Receives the value, or `undefined` if it is unavailable.
       */
      get: (measurementId: string, fieldName: GoogleAnalyticsGettableFieldName, callback: (value?: string) => void) => {
        getGtag()?.('get', measurementId, fieldName, callback);
      },
    };
  }, []);
}
