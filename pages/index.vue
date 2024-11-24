<template>
  <div>
    <h1 class="mb-3 mt-4 font-bold text-lg">Latest News</h1>
    <template v-if="loading">
      <Loader />
    </template>
    <template v-else-if="articles.length">
      <NewsArticle
        v-for="article in articles"
        :key="article.article_id"
        :title="article.title"
        :id="article.article_id"
      />

      <div class="flex justify-center gap-5 my-8">
        <button
          class="bg-[#00C16A] text-white px-4 py-2 rounded-md text-2xl"
          :class="{ 'bg-gray-400 hover:cursor-not-allowed': !hasPrevPage }"
          @click="gotoPrevPage"
          :disabled="!hasPrevPage"
          aria-label="Previous page"
        >
          Prev
        </button>
        <button
          class="bg-[#00C16A] text-white px-4 py-2 rounded-md text-2xl"
          @click="gotoNextPage"
          :disabled="!nextPage"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
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
const articles = ref<Article[]>([]);
const nextPage = ref<string | null>(null);
const prevPages = ref<string[]>([]);
const route = useRoute();

const currentPageToken = ref<string | null>(route.query.page as string | null);

const fetchNewsArticles = async (pageToken: string = "") => {
  loading.value = true;
  try {
    const runtimeConfig = useRuntimeConfig();
    const apiKey = runtimeConfig.public.newsApiKey;
    const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}${
      pageToken ? `&page=${pageToken}` : ""
    }`;

    const data = await $fetch<ApiResponse>(apiUrl);

    if (data) {
      articles.value = data.results || [];
      nextPage.value = data.nextPage || null;

      if (
        currentPageToken.value &&
        !prevPages.value.includes(currentPageToken.value)
      ) {
        prevPages.value.push(currentPageToken.value);
      }
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    articles.value = [];
    nextPage.value = null;
  } finally {
    loading.value = false;
  }
};

// Initial load
await fetchNewsArticles(currentPageToken.value || "");

const hasPrevPage = computed(() => prevPages.value.length > 0);

const gotoPrevPage = () => {
  if (!hasPrevPage.value) return;
  prevPages.value.pop();
  const prevPageToken = prevPages.value[prevPages.value.length - 1] || null;
  navigateTo({ query: { page: prevPageToken } });
};

const gotoNextPage = () => {
  if (!nextPage.value) return;
  navigateTo({ query: { page: nextPage.value } });
};

// Watch route changes
watch(
  () => route.query.page,
  async (newPageToken) => {
    currentPageToken.value = Array.isArray(newPageToken)
      ? newPageToken[0]
      : newPageToken || null;
    await fetchNewsArticles(currentPageToken.value || "");
  },
  { immediate: true }
);

useHead({
  title: `Latest News ${
    currentPageToken.value ? `- Page ${currentPageToken.value}` : ""
  }`,
  meta: [
    {
      name: "description",
      content: `Read the latest news articles${
        currentPageToken.value ? ` on page ${currentPageToken.value}` : ""
      }.`,
    },
    { name: "keywords", content: "latest news, news articles, breaking news" },
  ],
});
</script>
