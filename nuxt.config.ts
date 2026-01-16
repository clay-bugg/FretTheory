// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  runtimeConfig: {
    // Server-only API key - reads from NUXT_GEMINI_API_KEY env variable
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY || "",
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
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },
});
