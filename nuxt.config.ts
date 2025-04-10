// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxtjs/google-fonts"],

  googleFonts: {
    families: {
      "Orbitron": [100, 200, 300, 400, 500, 600, 700, 800, 900],
      "Big Shoulders Stencil": [100, 200, 300, 400, 500, 600, 700, 800, 900],
      "Ubuntu": [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
});