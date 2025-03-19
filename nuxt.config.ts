export default defineNuxtConfig({
  fonts: {
    provider: 'google',
    families: {
      Roboto:   {
        name: 'Roboto',
        wght: [400, 700],
        style: ['normal', 'italic']
      }
    }
  },

  compatibilityDate: '2025-03-15'
})