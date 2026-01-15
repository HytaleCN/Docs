// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  homeSidebar: [
    {
      type: 'category',
      label: '首页',
      collapsed: false,
      items: [
        'home/index',
      ],
    },
  ],
  officialDocsSidebar: [
    {
      type: 'category',
      label: '官方文档',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '玩家支持',
          collapsed: false,
          items: [
            {
              type: 'category',
              label: '入门',
              collapsed: false,
              items: [
                'official-docs/player-support/getting-started/how-to-download-and-play-hytale',
                'official-docs/player-support/getting-started/how-to-create-a-hytale-account',
                'official-docs/player-support/getting-started/how-to-purchase-hytale',
              ],
            },
            {
              type: 'category',
              label: '账户',
              collapsed: false,
              items: [
                'official-docs/player-support/accounts/how-to-keep-your-hytale-account-secure',
                'official-docs/player-support/accounts/account-recovery',
              ],
            },
            {
              type: 'category',
              label: '社区',
              collapsed: false,
              items: [
                'official-docs/player-support/community/support-and-feedback',
                'official-docs/player-support/community/how-to-join-the-official-hytale-discord-server',
                'official-docs/player-support/community/hytale-community',
                'official-docs/player-support/community/how-to-report-discord-rule-breakers',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '玩家资源',
          collapsed: false,
          items: [
            {
              type: 'category',
              label: '一般',
              collapsed: false,
              items: [
                'official-docs/player-resources/general/frequently-asked-questions',
                'official-docs/player-resources/general/how-to-find-your-hytale-logs',
                'official-docs/player-resources/general/refund-policy-and-available-payment-methods',
                'official-docs/player-resources/general/recording-and-screenshot-tools-for-hytale',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '游戏功能',
          collapsed: false,
          items: [
            {
              type: 'category',
              label: '多人游戏',
              collapsed: false,
              items: [
                'official-docs/game-features/multiplayer/joining-friends',
                'official-docs/game-features/multiplayer/slow-connection-or-world-not-loading-on-server',
                'official-docs/game-features/multiplayer/server-provider-authentication-guide',
                'official-docs/game-features/multiplayer/hytale-server-manual',
              ],
            },
          ],
        },
      ],
    },
  ],

  // By default, Docusaurus generates a sidebar from the docs folder structure
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
