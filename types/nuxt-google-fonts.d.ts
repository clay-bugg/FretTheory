
import { Config as GoogleFontsOptions } from '@nuxtjs/google-fonts'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    googleFonts?: GoogleFontsOptions
  }
  interface NuxtOptions {
    googleFonts?: GoogleFontsOptions
  }
}

export {}