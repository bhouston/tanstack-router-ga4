/** A scalar value accepted in GA4 parameters and user properties. */
export type GoogleAnalyticsPrimitive = string | number | boolean | null;

/** A JSON-like value for an event or set parameter: a primitive, an array, or a nested object. */
export type GoogleAnalyticsParameterValue =
  | GoogleAnalyticsPrimitive
  | GoogleAnalyticsParameterValue[]
  | { [key: string]: GoogleAnalyticsParameterValue };

/** Parameters for an event, keyed by parameter name. Undefined values are allowed and omitted by gtag. */
export type GoogleAnalyticsEventParams = Record<string, GoogleAnalyticsParameterValue | undefined>;

/**
 * Stream configuration passed to the gtag `config` command.
 *
 * Field names match the gtag.js configuration parameters.
 *
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

/** Parameters for the gtag `set` command, applied to subsequent events. */
export type GoogleAnalyticsSetParams = Record<string, GoogleAnalyticsParameterValue | undefined>;

/** A consent decision for one consent type. */
export type GoogleAnalyticsConsentState = 'granted' | 'denied';

/** Whether a consent command sets the initial `default` state or an `update` after the user decides. */
export type GoogleAnalyticsConsentMode = 'default' | 'update';

/** Consent Mode states for the gtag `consent` command. Omitted types keep their current state. */
export type GoogleAnalyticsConsentParams = {
  ad_personalization?: GoogleAnalyticsConsentState;
  ad_storage?: GoogleAnalyticsConsentState;
  ad_user_data?: GoogleAnalyticsConsentState;
  analytics_storage?: GoogleAnalyticsConsentState;
  wait_for_update?: number;
};

/** Field names that the gtag `get` command can read. */
export type GoogleAnalyticsGettableFieldName = 'campaign_name' | 'client_id' | 'gclid' | 'session_id';

/** @inline */
type PageViewEventParams = {
  page_location: string;
  page_path: string;
  page_referrer?: string;
  page_title?: string;
  send_to?: string;
};

/** @inline */
type ExceptionEventParams = {
  description?: string;
  fatal?: boolean;
};

/** @inline */
type SearchEventParams = {
  search_term: string;
};

/** @inline */
type AuthEventParams = {
  method?: string;
};

/** @inline */
type ShareEventParams = {
  content_type?: string;
  item_id?: string;
  method: string;
};

/** @inline */
type SelectContentEventParams = {
  content_type: string;
  item_id?: string;
};

/** Maps each recommended event name to the parameters its typed overload of `event` accepts. */
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

/** Names of the recommended events that have typed parameters. */
export type GoogleAnalyticsRecommendedEventName = keyof GoogleAnalyticsRecommendedEventParamsMap;
