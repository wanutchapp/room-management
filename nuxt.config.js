export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  render: {
    resourceHints: false,
  },
  head: {
    title: 'Room Management',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/vuelidate', ssr: true }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/proxy',
    'vue-sweetalert2/nuxt',
  ],
  sweetalert: {
    confirmButtonColor: '#167df0',
    cancelButtonColor: '#cacaca',
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'user.token',
          },
          user: { url: '/auth/me', method: 'get', propertyName: 'user' },
          logout: false,
        },
      },
      // tokenName: 'Authorization'
    },
    redirect: {
      login: '/login',
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
  },
  // proxy: {
  //   '/api': 'http://localhost:8080', //map proxy url api server
  //   ws: true,
  // },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
