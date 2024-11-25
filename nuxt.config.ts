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
      newsApiKey: "pub_597668b87fa2f4bb848ef4c8a77012c633cd2",
    },
  },
});
