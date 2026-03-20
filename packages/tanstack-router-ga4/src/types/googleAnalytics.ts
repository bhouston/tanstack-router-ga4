export type GoogleAnalyticsPrimitive = string | number | boolean | null;

export type GoogleAnalyticsParameterValue =
  | GoogleAnalyticsPrimitive
  | GoogleAnalyticsParameterValue[]
  | { [key: string]: GoogleAnalyticsParameterValue };

export type GoogleAnalyticsEventParams = Record<string, GoogleAnalyticsParameterValue | undefined>;

/**
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/config
 */
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

export type GoogleAnalyticsSetParams = Record<string, GoogleAnalyticsParameterValue | undefined>;

export type GoogleAnalyticsConsentState = 'granted' | 'denied';

export type GoogleAnalyticsConsentMode = 'default' | 'update';

export type GoogleAnalyticsConsentParams = {
  ad_personalization?: GoogleAnalyticsConsentState;
  ad_storage?: GoogleAnalyticsConsentState;
  ad_user_data?: GoogleAnalyticsConsentState;
  analytics_storage?: GoogleAnalyticsConsentState;
  wait_for_update?: number;
};

export type GoogleAnalyticsGettableFieldName = 'campaign_name' | 'client_id' | 'gclid' | 'session_id';

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
