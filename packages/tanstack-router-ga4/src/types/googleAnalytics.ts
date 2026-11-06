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
  /** Set to `false` to disable advertising personalization signals for this stream. */
  allow_ad_personalization_signals?: boolean;
  /** Set to `false` to disable Google signals (cross-device and demographic data) for this stream. */
  allow_google_signals?: boolean;
  /** Campaign content (`utm_content`) to attribute traffic to, overriding the URL value. */
  campaign_content?: string;
  /** Campaign ID (`utm_id`) to attribute traffic to, overriding the URL value. */
  campaign_id?: string;
  /** Campaign medium (`utm_medium`) to attribute traffic to, overriding the URL value. */
  campaign_medium?: string;
  /** Campaign name (`utm_campaign`) to attribute traffic to, overriding the URL value. */
  campaign_name?: string;
  /** Campaign source (`utm_source`) to attribute traffic to, overriding the URL value. */
  campaign_source?: string;
  /** Campaign term (`utm_term`) to attribute traffic to, overriding the URL value. */
  campaign_term?: string;
  /** Overrides the client ID that identifies this browser, instead of the one gtag generates. */
  client_id?: string;
  /** Content group to assign to page views, for grouping pages in reports. */
  content_group?: string;
  /** Domain for the GA cookies. Defaults to automatic domain detection. */
  cookie_domain?: string;
  /** Lifetime of the GA cookies, in seconds. */
  cookie_expires?: number;
  /** Extra attributes appended to the GA cookies, such as `SameSite=None;Secure`. */
  cookie_flags?: string;
  /** Path for the GA cookies. */
  cookie_path?: string;
  /** Prefix added to the GA cookie names. */
  cookie_prefix?: string;
  /** Whether gtag refreshes the cookie expiration on each page load. */
  cookie_update?: boolean;
  /** Set to `true` to send events to the GA4 DebugView. */
  debug_mode?: boolean;
  /** Set to `true` to ignore the document referrer when attributing traffic. */
  ignore_referrer?: boolean;
  /** Browser language, such as `en-us`. */
  language?: string;
  /** Full URL of the page. Defaults to the current location. */
  page_location?: string;
  /** Path portion of the page URL. */
  page_path?: string;
  /** URL of the referring page. */
  page_referrer?: string;
  /** Title of the page. */
  page_title?: string;
  /** Screen resolution in `<width>x<height>` form, such as `1920x1080`. */
  screen_resolution?: string;
  /** Whether gtag sends an automatic page view on configuration. `GoogleAnalytics` always sets this to `false` and sends its own page views. */
  send_page_view?: boolean;
  /** Your own opaque identifier for the signed-in user, used to associate sessions across devices. */
  user_id?: string;
  /** Custom user-scoped properties, keyed by property name. */
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
  /** Consent for personalized advertising. */
  ad_personalization?: GoogleAnalyticsConsentState;
  /** Consent to store advertising-related data, such as cookies. */
  ad_storage?: GoogleAnalyticsConsentState;
  /** Consent to send user data to Google for advertising. */
  ad_user_data?: GoogleAnalyticsConsentState;
  /** Consent to store analytics data, such as cookies. */
  analytics_storage?: GoogleAnalyticsConsentState;
  /** Milliseconds gtag waits for a consent `update` before sending queued data. */
  wait_for_update?: number;
};

/** Field names that the gtag `get` command can read. */
export type GoogleAnalyticsGettableFieldName = 'campaign_name' | 'client_id' | 'gclid' | 'session_id';

/** @inline */
type PageViewEventParams = {
  /** Full URL of the page. */
  page_location: string;
  /** Path portion of the page URL. */
  page_path: string;
  /** URL of the referring page. */
  page_referrer?: string;
  /** Title of the page. */
  page_title?: string;
  /** Measurement ID to send this page view to, instead of all configured streams. */
  send_to?: string;
};

/** @inline */
type ExceptionEventParams = {
  /** Short description of the error. */
  description?: string;
  /** Whether the error was fatal to the app. */
  fatal?: boolean;
};

/** @inline */
type SearchEventParams = {
  /** The text the user searched for. */
  search_term: string;
};

/** @inline */
type AuthEventParams = {
  /** How the user authenticated, such as `email` or `google`. */
  method?: string;
};

/** @inline */
type ShareEventParams = {
  /** Type of the shared content, such as `article`. */
  content_type?: string;
  /** Identifier of the shared content. */
  item_id?: string;
  /** How the content was shared, such as `email` or `twitter`. */
  method: string;
};

/** @inline */
type SelectContentEventParams = {
  /** Type of the selected content, such as `product`. */
  content_type: string;
  /** Identifier of the selected content. */
  item_id?: string;
};

/** Maps each recommended event name to the parameters its typed overload of `event` accepts. */
export type GoogleAnalyticsRecommendedEventParamsMap = {
  /** An error or crash. Carries an optional description and fatal flag. */
  exception: ExceptionEventParams;
  /** A lead was generated, for example a submitted contact form. Accepts any custom parameters. */
  generate_lead: GoogleAnalyticsEventParams;
  /** A user signed in. */
  login: AuthEventParams;
  /** A page was viewed. `GoogleAnalytics` sends this on each pathname change. */
  page_view: PageViewEventParams;
  /** A user searched your content. */
  search: SearchEventParams;
  /** A user selected a piece of content. */
  select_content: SelectContentEventParams;
  /** A user shared content. */
  share: ShareEventParams;
  /** A user registered for an account. */
  sign_up: AuthEventParams;
};

/** Names of the recommended events that have typed parameters. */
export type GoogleAnalyticsRecommendedEventName = keyof GoogleAnalyticsRecommendedEventParamsMap;
