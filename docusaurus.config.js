// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HytaleCN 文档站',
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
          editUrl: 'https://github.com/HytaleCN/Docs/',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/HytaleCN/Docs/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
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
            label: '玩家支持',
            to: 'player-support',
            position: 'left',
          },
          {
            label: '玩家资源',
            to: 'player-assets',
            position: 'left',
          },
          {
            label: '游戏功能',
            to: 'game-features',
            position: 'left',
          },
					{
						href: 'https://github.com/HytaleCN/Docs',
						position: 'right',
						className: 'navbar-item-github',
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
                label: '玩家支持',
                to: 'player-support',
              },
              {
                label: '玩家资源',
                to: 'player-resources',
              },
              {
                label: '游戏功能',
                to: 'game-features',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'HytaleCN',
                href: 'https://hytalecn.com',
              },
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
    }),
};

export default config;
