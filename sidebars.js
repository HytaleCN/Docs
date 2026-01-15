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
  playerSupportSidebar: [
    {
      type: 'category',
      label: '入门',
      collapsed: false,
      items: [
        'player-support/getting-started/how-to-download-and-play-hytale',
        'player-support/getting-started/how-to-create-a-hytale-account',
        'player-support/getting-started/how-to-purchase-hytale',
      ],
    },
    {
      type: 'category',
      label: '账户',
      collapsed: false,
      items: [
        'player-support/accounts/how-to-keep-your-hytale-account-secure',
        'player-support/accounts/account-recovery',
      ],
    },
    {
      type: 'category',
      label: '社区',
      collapsed: false,
      items: [
        'player-support/community/support-and-feedback',
        'player-support/community/how-to-join-the-official-hytale-discord-server',
        'player-support/community/hytale-community',
        'player-support/community/how-to-report-discord-rule-breakers',
      ],
    },
  ],
  playerResourcesSidebar: [
    {
      type: 'category',
      label: '一般',
      collapsed: false,
      items: [
        'player-resources/general/frequently-asked-questions',
        'player-resources/general/how-to-find-your-hytale-logs',
        'player-resources/general/refund-policy-and-available-payment-methods',
        'player-resources/general/recording-and-screenshot-tools-for-hytale',
      ],
    },
  ],
  gameFeaturesSidebar: [
    {
      type: 'category',
      label: '多人游戏',
      collapsed: false,
      items: [
        'game-features/multiplayer/joining-friends',
        'game-features/multiplayer/slow-connection-or-world-not-loading-on-server',
        'game-features/multiplayer/server-provider-authentication-guide',
        'game-features/multiplayer/hytale-server-manual',
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
