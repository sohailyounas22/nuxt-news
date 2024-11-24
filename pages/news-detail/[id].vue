<template>
  <div>
    <h1 class="text-xl font-bold mb-3">News Details</h1>
    <template v-if="article">
      <h2 class="font-bold text-lg mb-2">{{ article?.title }}</h2>
      <p class="mb-3">{{ article?.description }}</p>
      <!-- Image Wrapper -->
      <div
        class="relative flex items-center justify-center"
        v-if="article?.image_url"
      >
        <div
          v-if="imageLoading"
          class="w-[600px] h-[400px] absolute left-2/4 -translate-x-2/4 top-0 bg-gray-300 animate-pulse rounded-md"
        ></div>
        <img
          :src="article?.image_url"
          alt="Article Image"
          class="w-full max-w-[600px] object-cover rounded-md"
          @load="onImageLoad"
        />
      </div>

      <NuxtLink
        :to="article?.link"
        class="text-blue-500 underline"
        target="_blank"
      >
        Read more on source
      </NuxtLink>
    </template>
  </div>
</template>

<script setup>
const route = useRoute();
const articleId = route.params.id;

const { article, fetchNewsDetail } = useNewsArticles();
fetchNewsDetail(articleId);

// Image loading state
const imageLoading = ref(true);

// Handle image load
const onImageLoad = () => {
  imageLoading.value = false;
};

useHead({
  title: article.value?.title,
  meta: [{ name: "description", content: article.value?.description }],
});
</script>
