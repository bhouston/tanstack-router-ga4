import type { Config } from '@docusaurus/types';

const url = process.env.SITE_URL ?? 'https://tanstack-router-ga4.ben3d.ca';
const baseUrl = process.env.BASE_URL ?? '/';
const description =
  'Google Analytics 4 for TanStack Router and TanStack Start. Automatic page views, typed event helpers, and client-only initialization for React apps.';

const link = (attributes: Record<string, string>) => ({ tagName: 'link', attributes });
// Raw head tags: `themeConfig.metadata` goes through Helmet, which keeps one tag per name and would drop a theme-color.
const themeColor = (content: string, scheme: string) => ({
  tagName: 'meta',
  attributes: { name: 'theme-color', content, media: `(prefers-color-scheme: ${scheme})` },
});

const config: Config = {
  title: 'tanstack-router-ga4',
  tagline: 'GA4 analytics that follows your router.',
  url,
  baseUrl,
  favicon: 'img/mark.svg',
  headTags: [
    link({ rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseUrl}img/favicon-32x32.png` }),
    link({ rel: 'apple-touch-icon', sizes: '180x180', href: `${baseUrl}img/apple-touch-icon.png` }),
    link({ rel: 'manifest', href: `${baseUrl}site.webmanifest` }),
    themeColor('#ffffff', 'light'),
    themeColor('#11151d', 'dark'),
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'tanstack-router-ga4',
        url: new URL(baseUrl, url).href,
        description,
      }),
    },
  ],
  organizationName: 'bhouston',
  projectName: 'tanstack-router-ga4',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: { format: 'detect' },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/bhouston/tanstack-router-ga4/edit/main/packages/docs/',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],
  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      { property: 'og:site_name', content: 'tanstack-router-ga4' },
      { name: 'twitter:site', content: '@BenHouston3D' },
    ],
    colorMode: { defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: true },
    navbar: {
      title: 'tanstack-router-ga4',
      logo: { alt: '', src: 'img/mark.svg' },
      items: [
        { to: '/docs/getting-started', label: 'Get started', position: 'left' },
        { to: '/docs/examples', label: 'Examples', position: 'left' },
        { to: '/docs/behavior-and-consent', label: 'Behavior and consent', position: 'left' },
        { to: '/docs/api', label: 'API reference', position: 'left' },
        {
          href: 'https://github.com/bhouston/tanstack-router-ga4',
          html: '<span class="navbar-github-icon" aria-hidden="true"></span>',
          'aria-label': 'GitHub repository',
          title: 'GitHub repository',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            { label: 'Get started', to: '/docs/getting-started' },
            { label: 'Examples', to: '/docs/examples' },
            { label: 'Behavior and consent', to: '/docs/behavior-and-consent' },
          ],
        },
        {
          title: 'Build',
          items: [{ label: 'API reference', to: '/docs/api' }],
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/bhouston/tanstack-router-ga4' },
            { label: 'npm', href: 'https://www.npmjs.com/package/tanstack-router-ga4' },
            { label: 'Report an issue', href: 'https://github.com/bhouston/tanstack-router-ga4/issues' },
          ],
        },
      ],
      copyright:
        'Made with ❤️ by <a href="https://ben3d.ca">Ben Houston</a>. Sponsored by <a href="https://landofassets.com">Land of Assets</a>',
    },
    prism: { additionalLanguages: ['bash', 'typescript', 'tsx'] },
  },
};
export default config;
