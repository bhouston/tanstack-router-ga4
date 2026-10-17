import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'tanstack-router-ga4',
  tagline: 'GA4 analytics that follows your router.',
  favicon: 'img/mark.svg',
  url: 'https://bhouston.github.io',
  baseUrl: '/tanstack-router-ga4/',
  organizationName: 'bhouston',
  projectName: 'tanstack-router-ga4',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: { format: 'md', hooks: { onBrokenMarkdownLinks: 'throw' } },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/bhouston/tanstack-router-ga4/edit/main/packages/website/',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'tanstack-router-ga4',
      logo: { alt: '', src: 'img/mark.svg' },
      items: [
        { to: '/docs/getting-started', label: 'Get started', position: 'left' },
        { to: '/docs/examples', label: 'Examples', position: 'left' },
        { to: '/docs/api', label: 'API reference', position: 'left' },
        { href: 'https://github.com/bhouston/tanstack-router-ga4', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} tanstack-router-ga4 · MIT · Created by <a href="https://ben3d.ca">Ben Houston</a> · Sponsored by <a href="https://landofassets.com">Land of Assets</a>`,
    },
    prism: { additionalLanguages: ['bash', 'typescript', 'tsx'] },
  },
};
export default config;
