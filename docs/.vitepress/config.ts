import { defineConfig } from 'vitepress'
import { bookSidebars } from './theme/data/books'

export default defineConfig({
  title: 'Koyuki Palace',
  description: 'Koyuki Palace — 纯净智能，有生命的科技',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    html: true,
    math: true,
  },

  ignoreDeadLinks: [
    /^https?:\/\/localhost/,
    /^https?:\/\/127\.0\.0\.1/,
  ],

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3BA7FF' }],
  ],

  themeConfig: {
    logo: '/KoyukiChan.png',
    siteTitle: 'Koyuki Palace',

    nav: [
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/': [],
      ...bookSidebars,
    },

    outline: {
      level: [1, 3],
      label: '本页目录',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [],

    footer: {
      message: 'Built with VitePress · Koyuki Palace',
      copyright: 'Copyright © Chino Koyuki',
    },
  },
})