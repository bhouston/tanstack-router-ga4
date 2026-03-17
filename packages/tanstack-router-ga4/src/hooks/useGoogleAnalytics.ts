import { useMemo } from "react";
import { getGtag } from "../lib/getGtag.js";
import type {
  GoogleAnalyticsConfig,
  GoogleAnalyticsConsentMode,
  GoogleAnalyticsConsentParams,
  GoogleAnalyticsEventParams,
  GoogleAnalyticsGettableFieldName,
  GoogleAnalyticsRecommendedEventName,
  GoogleAnalyticsRecommendedEventParamsMap,
  GoogleAnalyticsSetParams,
} from "../types/googleAnalytics.js";

export type GoogleAnalyticsCommandEvent = {
  <TEventName extends GoogleAnalyticsRecommendedEventName>(
    eventName: TEventName,
    params: GoogleAnalyticsRecommendedEventParamsMap[TEventName],
  ): void;
  (eventName: string, params?: GoogleAnalyticsEventParams): void;
};

export function useGoogleAnalytics() {
  return useMemo(() => {
    return {
      set: (params: GoogleAnalyticsSetParams) => {
        getGtag()?.("set", params);
      },
      config: (measurementId: string, configParams?: GoogleAnalyticsConfig) => {
        getGtag()?.("config", measurementId, configParams);
      },
      event: ((eventName: string, params?: GoogleAnalyticsEventParams) => {
        getGtag()?.("event", eventName, params);
      }) as GoogleAnalyticsCommandEvent,
      consent: (mode: GoogleAnalyticsConsentMode, params: GoogleAnalyticsConsentParams) => {
        getGtag()?.("consent", mode, params);
      },
      get: (
        measurementId: string,
        fieldName: GoogleAnalyticsGettableFieldName,
        callback: (value?: string | undefined) => void,
      ) => {
        getGtag()?.("get", measurementId, fieldName, callback);
      },
    };
  }, []);
}
