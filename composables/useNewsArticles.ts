import { ref } from "vue";

// Define types for news articles and API response
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

export function useNewsArticles() {
  const articles = ref<Article[]>([]); // For list of articles
  const article = ref<Article | null>(null); // For single article details
  const nextPage = ref<string | null>(null); // Token for the next page
  const prevPages = ref<string[]>([]); // Stack to store previous pages
  const loading = useState("loading", () => false);
  const error = ref<string | null>(null);

  // Fetch a list of articles
  const fetchNewsArticles = async (pageToken?: string | null) => {
    loading.value = true;
    error.value = null;
    console.log("loading.value", loading.value);

    const apiKey = useRuntimeConfig().public.newsApiKey;
    const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}${
      pageToken ? `&page=${pageToken}` : ""
    }`;

    try {
      const response = (await $fetch(apiUrl)) as ApiResponse;
      articles.value = response.results || [];
      nextPage.value = response.nextPage || null;

      // Store the current page token in the stack
      if (pageToken && !prevPages.value.includes(pageToken)) {
        prevPages.value.push(pageToken);
      }
    } catch (err) {
      error.value = "Failed to load news articles.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch details for a single article
  const fetchNewsDetail = async (articleId: string) => {
    loading.value = true;
    error.value = null;

    const apiKey = useRuntimeConfig().public.newsApiKey;
    const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&id=${articleId}`;

    try {
      const response = (await $fetch(apiUrl)) as ApiResponse;
      article.value = response.results[0] || null;
    } catch (err) {
      error.value = "Failed to fetch news details.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    articles,
    article,
    nextPage,
    prevPages,
    loading,
    error,
    fetchNewsArticles,
    fetchNewsDetail,
  };
}
