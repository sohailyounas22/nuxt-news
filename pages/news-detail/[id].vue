<template>
  <div>
    <h1 class="text-xl font-bold mb-3">News Details</h1>
    <template v-if="loading">
      <Loader />
    </template>
    <template v-else-if="article">
      <h2 class="font-bold text-lg mb-2">{{ article?.title }}</h2>
      <p class="mb-3">{{ article?.description }}</p>
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
interface Article {
  article_id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
}

interface ApiResponse {
  results: Article[];
  nextPage?: string;
}

const loading = useState("loading", () => false);

const route = useRoute();
const { id } = route.params;
const articleId = ref<string | null>(id as string | null);

const article = ref<Article | null>(null);

const fetchNewsDetail = async (id: string) => {
  loading.value = true;
  try {
    const runtimeConfig = useRuntimeConfig();
    const apiKey = runtimeConfig.public.newsApiKey;
    const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&id=${id}`;

    const response = (await $fetch(apiUrl)) as ApiResponse;
    article.value = response.results[0] || null;

    if (article.value) {
      useHead({
        title: article.value.title,
        meta: [{ name: "description", content: article.value.description }],
      });
    }
  } catch (error) {
    console.error("Failed to fetch article details:", error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// Initial load
if (articleId.value) {
  await fetchNewsDetail(articleId.value);
}

// Image loading state
const imageLoading = ref(true);

const onImageLoad = () => {
  imageLoading.value = false;
};
</script>
