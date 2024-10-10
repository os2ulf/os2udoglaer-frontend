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
    prefetchLinks: true,

    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'http-equiv="Content-Security-Policy"',
          content: "script-src 'self';",
        },
      ],

      htmlAttrs: {
        lang: 'da',
      },
    },
  },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      LOCAL_API_BASE_URL: process.env.LOCAL_API_BASE_URL,
    },

    REST_API_USER: process.env.REST_API_USER,
    REST_API_USER_PASS: process.env.REST_API_USER_PASS,
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
    '~/components/page-header',
    '~/components/view-components',
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

  modules: ['@pinia/nuxt', 'nuxt-icons'],

  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 250000,
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10,
        },
      },
    },
  },
});
