// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxtjs/google-fonts", "@pinia/nuxt"],
  css: ["~/assets/scss/main.scss"],
  googleFonts: {
    families: {
      Orbitron: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      "Big Shoulders Stencil": [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Ubuntu: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  compatibilityDate: "2025-12-10",
    app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})