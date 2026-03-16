import { useCallback, useEffect, useState } from "react";

type GoogleAnalyticsPrimitive = string | number | boolean | null;

export type GoogleAnalyticsParameterValue =
  | GoogleAnalyticsPrimitive
  | GoogleAnalyticsParameterValue[]
  | { [key: string]: GoogleAnalyticsParameterValue };

export type GoogleAnalyticsEventParams = Record<string, GoogleAnalyticsParameterValue | undefined>;

export type GoogleAnalyticsConfig = {
  allow_ad_personalization_signals?: boolean;
  allow_google_signals?: boolean;
  campaign_content?: string;
  campaign_id?: string;
  campaign_medium?: string;
  campaign_name?: string;
  campaign_source?: string;
  campaign_term?: string;
  client_id?: string;
  content_group?: string;
  cookie_domain?: string;
  cookie_expires?: number;
  cookie_flags?: string;
  cookie_path?: string;
  cookie_prefix?: string;
  cookie_update?: boolean;
  debug_mode?: boolean;
  ignore_referrer?: boolean;
  language?: string;
  page_location?: string;
  page_path?: string;
  page_referrer?: string;
  page_title?: string;
  screen_resolution?: string;
  send_page_view?: boolean;
  user_id?: string;
  user_properties?: Record<string, GoogleAnalyticsPrimitive>;
};

type PageViewEventParams = {
  page_location: string;
  page_path: string;
  page_referrer?: string;
  page_title?: string;
  send_to?: string;
};

type ExceptionEventParams = {
  description?: string;
  fatal?: boolean;
};

type SearchEventParams = {
  search_term: string;
};

type AuthEventParams = {
  method?: string;
};

type ShareEventParams = {
  content_type?: string;
  item_id?: string;
  method: string;
};

type SelectContentEventParams = {
  content_type: string;
  item_id?: string;
};

export type GoogleAnalyticsRecommendedEventParamsMap = {
  exception: ExceptionEventParams;
  generate_lead: GoogleAnalyticsEventParams;
  login: AuthEventParams;
  page_view: PageViewEventParams;
  search: SearchEventParams;
  select_content: SelectContentEventParams;
  share: ShareEventParams;
  sign_up: AuthEventParams;
};

export type GoogleAnalyticsRecommendedEventName = keyof GoogleAnalyticsRecommendedEventParamsMap;

export type TrackGoogleAnalyticsEvent = {
  <TEventName extends GoogleAnalyticsRecommendedEventName>(
    eventName: TEventName,
    params: GoogleAnalyticsRecommendedEventParamsMap[TEventName],
  ): void;
  (eventName: string, params?: GoogleAnalyticsEventParams): void;
};

declare global {
  type Gtag = {
    (command: "js", date: Date): void;
    (command: "config", measurementId: string, config?: GoogleAnalyticsConfig): void;
    (command: "event", eventName: string, params?: GoogleAnalyticsEventParams): void;
  };

  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
  }
}

export function useGoogleAnalytics() {
  const [isReady, setIsReady] = useState(false);

  // Poll until window.gtag is available. React fires child effects before
  // parent effects, so `GoogleAnalytics` (mounted in the root layout) may
  // not have set up window.gtag yet when this hook first runs in a leaf page.
  useEffect(() => {
    const check = () => typeof window !== "undefined" && typeof window.gtag === "function";
    if (check()) {
      setIsReady(true);
      return;
    }
    const id = setInterval(() => {
      if (check()) {
        setIsReady(true);
        clearInterval(id);
      }
    }, 50);
    return () => clearInterval(id);
  }, []);

  const trackEvent = useCallback<TrackGoogleAnalyticsEvent>(
    (eventName: string, params?: GoogleAnalyticsEventParams) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        console.log('called trackEvent', eventName, params)
        window.gtag("event", eventName, params);
      }
    },
    [],
  );

  return {
    isReady,
    trackEvent,
  };
}
