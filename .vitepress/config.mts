import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "H3ravel",
  cleanUrls: true,
  description: "Modern TypeScript runtime-agnostic web framework built on top of H3.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,
    logo: '/logo-full.svg',
    nav: [
      { text: 'Get Started', link: '/introduction' }
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Installation', link: '/guide/installation' },
          {
            text: 'Architecture',
            collapsed: true,
            items: [
              { text: 'Service Providers', link: '/guide/architecture/providers' },
              { text: 'Request Life Circle', link: '/guide/architecture/request-life-circle' },
              { text: 'Service Container', link: '/guide/architecture/container' },
            ]
          },
          {
            text: 'The Basics',
            collapsed: true,
            items: [
              { text: 'Routing', link: '/guide/routing' },
              { text: 'Controllers', link: '/guide/controllers' },
              { text: 'Middleware', link: '/guide/middleware' },
              { text: 'Requests', link: '/guide/requests' },
              { text: 'Responses', link: '/guide/responses' },
              { text: 'API Resource & Collections', link: '/guide/api-resources' },
              { text: 'Views', link: '/guide/views' },
            ]
          },
          {
            text: 'Advanced',
            collapsed: true,
            items: [
              { text: 'Mail', link: '/guide/deeper/mail' },
            ]
          },
          {
            text: 'Arquebus ORM',
            collapsed: true,
            items: [
              {
                text: 'Introduction', items: [
                  { text: 'Getting Started', link: '/arquebus/' },
                  { text: 'Installation', link: '/arquebus/installation' },
                ]
              },
              {
                text: 'Basics', items: [
                  { text: 'Query Builder', link: '/arquebus/query-builder' },
                  { text: 'Models', link: '/arquebus/models' },
                  { text: 'Pagination', link: '/arquebus/pagination' },
                  { text: 'Relationships', link: '/arquebus/relationships' },
                  { text: 'Collections', link: '/arquebus/collections' },
                  { text: 'Mutators', link: '/arquebus/mutators' },
                  { text: 'Serialization', link: '/arquebus/serialization' },
                  { text: 'Transactions', link: '/arquebus/transactions' },
                  { text: 'Migrations', link: '/arquebus/migrations' },
                  { text: 'Hooks', link: '/arquebus/hooks' },
                  { text: 'Typescript', link: '/arquebus/typescript' },
                  { text: 'Browser', link: '/arquebus/browser' },
                ]
              },
              {
                text: 'Plugins', items: [
                  { text: 'Introduction', link: '/arquebus/plugin' },
                  { text: 'Plugin List', link: '/arquebus/plugin-list' },
                ]
              },
            ]
          },
          { text: 'Contributing', link: '/contributing' },
        ]
      }
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/h3ravel/framework/blob/main/LICENSE">MIT License</a>.',
      copyright: `© ${new Date().getFullYear()} H3ravel. All rights reserved.`
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/h3ravel' },
      { icon: 'discord', link: 'https://discord.gg/hsG2A8PuGb' }
    ]
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'script',
      { crossorigin: 'anonymous', src: 'https://kit.fontawesome.com/c62c7da348.js' }
    ],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-ZFZEMNDJTV' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZFZEMNDJTV');`
    ]
  ],
})
