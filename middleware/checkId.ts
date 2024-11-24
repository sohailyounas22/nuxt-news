export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.params.id) {
    return navigateTo("/"); // Redirect to homepage
  }
});
