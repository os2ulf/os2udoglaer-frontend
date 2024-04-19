import { defineNuxtConfig } from 'nuxt/config';
import postcssConfig from '@novicell/postcss-config';

export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },

    head: {
      titleTemplate: '%s | Novicell',

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'http-equiv="Content-Security-Policy"',
          content: "script-src 'self';",
        },
      ],
      link: [{ rel: 'preconnect', href: 'https://consent.cookiebot.com' }],
      script: [
        {
          id: 'Cookiebot',
          src: 'https://consent.cookiebot.com/uc.js',
          'data-cbid': '226ecb7b-1eba-45cf-a066-6c4a0ce13318',
          'data-framework': 'IAB',
          type: 'text/javascript',
          async: true,
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },

  components: [
    '~/components',
    '~/components/base',
    '~/components/base/form',
    '~/components/blocks',
    '~/components/factory',
    '~/components/globals',
    '~/components/modals',
    '~/components/globals/footer',
    '~/components/globals/navigation',
    '~/components/views',
  ],

  webpack: {
    extractCSS: true,
  },

  css: ['/assets/css/app.css'],

  postcss: {
    config: false,

    plugins: {
      ...postcssConfig({
        'postcss-preset-env': {
          stage: 2,
          preserve: true,
        },
      }),
    },
  },

  modules: [
    ['@nuxtjs/robots', { configPath: '~/config/robots.config' }],
    '@pinia/nuxt',
    'nuxt-icons',
    '@nuxtjs/i18n',
  ],

  i18n: {
    vueI18n: './i18n.config.ts',
  },

  optimization: {
    splitChunks: {
      maxSize: 300000,
    },
  },
});
