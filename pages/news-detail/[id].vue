<template>
  <div>
    <h1 class="text-xl font-bold mb-3">News Details</h1>
    <template v-if="loading">
      <Loader />
    </template>
    <template v-else-if="article">
      <h2 class="font-bold md:text-lg mb-2">{{ article?.title }}</h2>
      <p class="mb-3 text-sm md:text-base">{{ article?.description }}</p>
      <div
        class="relative flex items-center justify-center"
        v-if="article?.image_url"
      >
        <div
          v-if="imageLoading"
          class="md:w-[600px] w-full h-[400px] absolute left-2/4 -translate-x-2/4 top-0 bg-gray-300 animate-pulse rounded-md"
        ></div>
        <img
          :src="article?.image_url"
          alt="Article Image"
          class="w-full max-w-[600px] object-cover rounded-md"
          @load="onImageLoad"
          loading="lazy"
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

<script setup lang="ts">
const { singleArticleData: article, loading, fetchSingleNewsPost } = useNews();

const route = useRoute();
const { id } = route.params;
const articleId = ref<string | null>(id as string | null);
// Initial load
if (articleId.value) {
  await fetchSingleNewsPost(articleId.value);
}

const imageLoading = ref(true);

const onImageLoad = () => {
  imageLoading.value = false;
};

useHead({
  title: `News - ${article.value?.title ?? ""}`,
  meta: [
    {
      name: "description",
      content: `Read the news: ${article.value?.description ?? ""}.`,
    },
    { name: "keywords", content: "latest news, news articles, breaking news" },
  ],
});
</script>
