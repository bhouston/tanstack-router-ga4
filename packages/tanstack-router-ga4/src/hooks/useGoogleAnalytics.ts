import { useCallback } from "react";
import { initGtag } from "../lib/initGtag.js";
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

export type GoogleAnalyticsCommandSet = (params: GoogleAnalyticsSetParams) => void;

export type GoogleAnalyticsCommandConfig = (
  measurementId: string,
  config?: GoogleAnalyticsConfig,
) => void;

export type GoogleAnalyticsCommandGet = (
  measurementId: string,
  fieldName: GoogleAnalyticsGettableFieldName | string,
  callback?: (value?: string) => void,
) => void;

export type GoogleAnalyticsCommandConsent = (
  mode: GoogleAnalyticsConsentMode,
  params: GoogleAnalyticsConsentParams,
) => void;

export function useGoogleAnalytics() {
  if (typeof window !== "undefined") {
    initGtag();
  }

  const config = useCallback<GoogleAnalyticsCommandConfig>(
    (measurementId: string, configParams?: GoogleAnalyticsConfig) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("config", measurementId, configParams);
      }
    },
    [],
  );

  const get = useCallback<GoogleAnalyticsCommandGet>(
    (
      measurementId: string,
      fieldName: GoogleAnalyticsGettableFieldName | string,
      callback?: (value?: string) => void,
    ) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("get", measurementId, fieldName, callback);
      }
    },
    [],
  );

  const set = useCallback<GoogleAnalyticsCommandSet>((params: GoogleAnalyticsSetParams) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("set", params);
    }
  }, []);

  const event = useCallback<GoogleAnalyticsCommandEvent>(
    (eventName: string, params?: GoogleAnalyticsEventParams) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
      }
    },
    [],
  );

  const consent = useCallback<GoogleAnalyticsCommandConsent>(
    (mode: GoogleAnalyticsConsentMode, params: GoogleAnalyticsConsentParams) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("consent", mode, params);
      }
    },
    [],
  );

  return {
    config,
    consent,
    event,
    get,
    set,
  };
}
