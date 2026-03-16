export function initGtag(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // biome-ignore lint: GA4 requires the native Arguments object, not a rest-param array
      window.dataLayer.push(arguments);
    } as unknown as Gtag;
  }
}
