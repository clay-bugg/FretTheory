// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Music Theory',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width-device-width, initial-scale=1'}
      ],
      link: [
        { rel: 'stylesheet', href: "https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap" },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/styles/global.css'],
  modules: ['@nuxt/icon']
})