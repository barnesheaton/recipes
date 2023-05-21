import data from './content/recipes.json'
import {shuffle} from 'lodash'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  extractCSS: true,
  // mode: 'spa',

  generate: {
    fallback: '404.html',
    async routes() {
      const routes = data.map(recipe => {
        return {route: `/recipe/${recipe.slug}`, payload: shuffle(data)}
      })
      return [...routes, {
        route: '/', payload: data
      }]
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Recipe Reserves',
    htmlAttrs: {
      lang: 'en'
    },
    bodyAttrs: {
      class: 'text-md'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/content',
    // ['@nuxtjs/vuetify', { treeShake: false }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // '@nuxt/content',
    // ['@nuxtjs/vuetify', { treeShake: false }]
    // '@element-plus/icons-vue'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  }
}
