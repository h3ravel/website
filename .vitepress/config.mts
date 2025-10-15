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
      { text: 'Get Started', link: '/guide/get-started' }
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Get Started', link: '/guide/get-started' },
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
              { text: 'Url Generation', link: '/guide/urls' },
            ]
          },
          {
            text: 'Security',
            collapsed: true,
            items: [
              { text: 'Hashing', link: '/guide/security/hashing' },
            ]
          },
          {
            text: 'Musket CLI',
            collapsed: true,
            items: [
              { text: 'Introduction', link: '/musket/' },
              { text: 'Configuration', link: '/musket/config' },
              { text: 'Usage', link: '/musket/usage' },
              { text: 'Writting Commands', link: '/musket/commands' },
              { text: 'Availability', link: '/musket/availability' },
            ]
          },
          {
            text: 'Advanced',
            collapsed: true,
            items: [
              { text: 'Mail', link: '/guide/deeper/mail' },
              { text: 'Storage', link: '/guide/deeper/filesystem' },
              { text: 'Helpers', link: '/guide/deeper/helpers' },
              { text: 'Strings', link: '/guide/deeper/strings' },
              { text: 'Debug', link: '/guide/deeper/debug' },
              { text: 'Deployment', link: '/guide/deeper/deployment' },
            ]
          },
          {
            text: 'Database & Arquebus ORM',
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
                  { text: 'Seeding', link: '/arquebus/seeding' },
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
          { text: 'Changelogs', link: '/changelog' },
        ]
      }
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/h3ravel/framework/blob/main/LICENSE">MIT License</a>.',
      copyright: `© ${new Date().getFullYear()} H3ravel Framework. All rights reserved.`
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/h3ravel' },
      { icon: 'discord', link: 'https://discord.gg/hsG2A8PuGb' },
      { icon: 'telegram', link: 'https://t.me/h3ravel' }
    ]
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://h3ravel.toneflix.com' }],
    ['meta', { property: 'og:title', content: 'The web framework that masks your fears' }],
    ['meta', { property: 'og:image', content: 'https://h3ravel.toneflix.net/banner.png' }],
    ['meta', { property: 'og:description', content: 'Modern TypeScript runtime-agnostic web framework built on top of H3 with Laravel\'s Elegance and TypeScript\'s Power' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:url', content: 'https://h3ravel.toneflix.com' }],
    ['meta', { property: 'twitter:title', content: 'The web framework that masks your fears' }],
    ['meta', { property: 'twitter:image', content: 'https://h3ravel.toneflix.net/banner.png' }],
    ['meta', { property: 'twitter:description', content: 'Modern TypeScript runtime-agnostic web framework built on top of H3 with Laravel\'s Elegance and TypeScript\'s Power' }],
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
