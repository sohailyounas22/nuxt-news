<template>
  <div>
    <template v-if="loading">
      <Loader />
    </template>
    <template v-else-if="articles && articles.length > 0">
      <h1 class="mb-3 mt-4 font-bold text-lg">Latest News</h1>
      <NewsArticle
        v-for="article in articles"
        :key="article.article_id"
        :title="article.title"
        :id="article.article_id"
      />

      <div class="flex justify-center gap-5 my-8">
        <button
          class="bg-[#00C16A] text-white px-4 py-2 rounded-md text-2xl"
          :class="{ 'bg-gray-400 hover:cursor-not-allowed': !prevPage }"
          @click="gotoPrevPage"
          :disabled="!prevPage"
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
    <template v-else>
      <div
        class="flex items-center justify-center flex-col pt-24 pb-32"
        data-testid="cart-page-content"
      >
        <img
          src="/images/empty-results.svg"
          alt="No Results"
          width="192"
          height="192"
        />
        <h1 class="mt-8">No Results Found</h1>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { data: articles, loading, nextPage, prevPage, fetchNews } = useNews();
const route = useRoute();

const currentPageToken = ref<string | null>(route.query.page as string | null);

const pagesArray = ref<string[]>([""]);

await fetchNews(currentPageToken.value || "");

const gotoPrevPage = () => {
  const CurrentPageIndex = pagesArray.value.indexOf(prevPage.value);
  if (CurrentPageIndex === -1) return;
  if (CurrentPageIndex >= 0) {
    const PreviousPageIndex = CurrentPageIndex - 1;
    navigateTo({ query: { page: pagesArray.value[PreviousPageIndex] } });
  }
};

const gotoNextPage = () => {
  if (!nextPage.value) return;
  pagesArray.value.push(nextPage.value);
  navigateTo({ query: { page: nextPage.value } });
};

// Watch route changes
watch(
  () => route.fullPath,
  async () => {
    await fetchNews((route.query.page as string) || "");
  }
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
