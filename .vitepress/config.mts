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
              { text: 'Service Providers', link: '/guide/providers' },
              { text: 'Request Life Circle', link: '/guide/request-life-circle' },
              { text: 'Service Container', link: '/guide/container' },
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
              { text: 'Views', link: '/guide/views' }
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
      { icon: 'github', link: 'https://github.com/h3ravel' }
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
