// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HytaleCN 文档站',
  tagline: '获取与 Hytale 有关的文档',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.hytalecn.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'HytaleCN', // Usually your GitHub org/user name.
  projectName: 'Docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/HytaleCN/Docs/blob/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/hytalecn-docs-social-card.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'HytaleCN 文档站',
        logo: {
          alt: 'HytaleCN Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'homeSidebar',
            position: 'left',
            label: '首页',
          },
          {
            type: 'docSidebar',
            sidebarId: 'playerSupportSidebar',
            position: 'left',
            label: '玩家支持',
          },
          {
            type: 'docSidebar',
            sidebarId: 'playerResourcesSidebar',
            position: 'left',
            label: '玩家资源',
          },
          {
            type: 'docSidebar',
            sidebarId: 'gameFeaturesSidebar',
            position: 'left',
            label: '游戏功能',
          },
          {
            href: 'https://hytalecn.com',
            position: 'left',
            label: '主站',
          },
          {
            href: 'https://github.com/HytaleCN/Docs',
            position: 'right',
            className: 'navbar-item-github',
            'aria-label': 'GitHub 仓库',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '首页',
                to: '/',
              },
              {
                label: '玩家支持',
                to: '/player-support/getting-started/how-to-download-and-play-hytale',
              },
              {
                label: '玩家资源',
                to: '/player-resources/general/frequently-asked-questions',
              },
              {
                label: '游戏功能',
                to: '/game-features/multiplayer/joining-friends',
              },
              {
                label: 'NPC',
                to: '/npc',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'QQ 群',
                href: 'https://qm.qq.com/q/V11WIqBloC',
              },
              {
                label: '哔哩哔哩',
                href: 'https://space.bilibili.com/14046393',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: 'HytaleCN 主站',
                href: 'https://hytalecn.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/HytaleCN/Docs',
              },
            ],
          },
        ],
        copyright: `© 2018-${new Date().getFullYear()} 深圳布克拉岛科技有限公司 保留所有权利。本站由 <a href="https://github.com/facebook/docusaurus" target="_blank" data-blank-handler="true">Docusaurus</a> 强力驱动。本站非 Hytale 官方所属，仅供用户学习交流使用，请仔细甄别信息。`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'TJKR4MJNV3',

        // Public API key: it is safe to commit it
        apiKey: '412a47785ed34251f7402830b541f013',

        indexName: 'HytaleCN Docs',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: true,

        //... other Algolia params
      },
    }),
};

export default config;
