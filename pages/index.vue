<template>
  <div>
    <h1 class="mb-3 mt-4 font-bold text-lg">Latest News</h1>
    <template v-if="articles.length && !loading">
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
import { useNewsArticles } from "~/composables/useNewsArticles";
import { useRoute, useRouter } from "vue-router";

const { articles, nextPage, prevPages, fetchNewsArticles } = useNewsArticles();

const route = useRoute();
const router = useRouter();
const currentPageToken = ref<string | null>(route.query.page as string | null);
const loading = useState("loading");

// Fetch articles when the route changes
watch(
  () => route.query.page,
  (newPageToken) => {
    // Ensure `newPageToken` is a string or null
    currentPageToken.value = Array.isArray(newPageToken)
      ? newPageToken[0]
      : newPageToken || null;
    fetchNewsArticles(currentPageToken.value);
  },
  { immediate: true }
);

// Navigation logic
const hasPrevPage = computed(() => prevPages.value.length > 0);

const gotoPrevPage = () => {
  if (!hasPrevPage.value) return;
  loading.value = true;
  prevPages.value.pop();
  const prevPageToken = prevPages.value[prevPages.value.length - 1] || null;
  navigateTo({ query: { page: prevPageToken } });
};

const gotoNextPage = () => {
  if (!nextPage.value) return;
  loading.value = true;

  navigateTo({ query: { page: nextPage.value } });
};

useHead({
  title: `Latest News`,
  meta: [
    {
      name: "description",
      content: "Read the latest news articles on our website.",
    },
    { name: "keywords", content: "latest news, news articles, breaking news" },
  ],
});
</script>
