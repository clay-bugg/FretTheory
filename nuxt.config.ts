// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    // Temporarily hardcoded for testing - will move back to env var
    geminiApiKey: "AIzaSyAqBRRfIDouBgfaj5umGtU9m-3922A4gvU",
  },
  modules: ["@nuxt/icon", "@nuxtjs/google-fonts", "@pinia/nuxt"],
  css: ["~/assets/scss/main.scss"],
  googleFonts: {
    families: {
      Orbitron: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      "AR One Sans": [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Lexend: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Rubik: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  compatibilityDate: "2025-12-10",
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
});
