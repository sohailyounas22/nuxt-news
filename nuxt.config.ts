// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  imports: {
    dirs: ["composables/**"],
  },
  runtimeConfig: {
    public: {
      newsApiKey: "pub_603246033ff668f350d23a635e9669cea5171",
    },
  },
});
