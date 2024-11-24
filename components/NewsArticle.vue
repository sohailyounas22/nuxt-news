<template>
  <NuxtLink
    class="bg-gray-100 hover:bg-white shadow rounded p-4 mb-2 block hover:text-[#00C16A]"
    :to="`/news-detail/${id}`"
  >
    {{ title }}
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  id: String,
});
</script>
