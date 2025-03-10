export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Orbitron: [100, 300, 400, 500, 700, 900]
    },
    display: 'swap'
  }
})
