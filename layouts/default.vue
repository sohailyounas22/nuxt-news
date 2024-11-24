<template>
  <div class="container mt-8">
    <div class="flex justify-center">
      <NuxtLink to="/" class="text-2xl font-bold">News Site</NuxtLink>
    </div>
    <slot />
  </div>
  <Loader v-if="loading" />
</template>

<script setup lang="ts">
const loading = useState("loading");
</script>
