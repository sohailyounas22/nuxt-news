import type {
  UseNewsReturn,
  UseNewsState,
  FetchNewsPosts,
  FetchSingleNewsPost,
} from "~/composables/useNews/types";

export const useNews: UseNewsReturn = () => {
  const route = useRoute();
  const state = useState<UseNewsState>(`News-posts-${route.fullPath}`, () => ({
    data: null,
    singleArticleData: null,
    loading: false,
    nextPage: "",
    prevPage: "",
  }));
  const fetchNews: FetchNewsPosts = async (pageToken: string) => {
    state.value.prevPage = pageToken;
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(
        "fetchnewsposts",
        async () =>
          await $fetch("/fetchNewsPosts", {
            method: "GET",
            params: {
              page: pageToken || "",
            },
          })
      );
      if (error.value || data.value.error) {
        state.value.data = null;
        state.value.nextPage = "";
        state.value.loading = false;
        return;
      }
      const NewsDataResponse = data.value as NewsResults;
      if (NewsDataResponse && NewsDataResponse.status === "success") {
        state.value.data = NewsDataResponse.results;
        state.value.nextPage = NewsDataResponse.nextPage;
        state.value.loading = false;
        return NewsDataResponse;
      }
      return;
    } catch (error) {
      console.error("An error occurred during address lookup:", error);
      throw error;
    }
  };

  const fetchSingleNewsPost: FetchSingleNewsPost = async (
    articleId: string
  ) => {
    state.value.loading = true;
    try {
      const { data, error } = await useAsyncData(
        "fetchnewsposts",
        async () =>
          await $fetch("/fetchNewsPosts", {
            method: "GET",
            params: {
              id: articleId || "",
            },
          })
      );
      if (error.value || data.value.error) {
        state.value.singleArticleData = null;
        state.value.loading = false;
        return;
      }
      const SingleNewsDataResponse = data.value as NewsResults;
      if (
        SingleNewsDataResponse &&
        SingleNewsDataResponse.status === "success"
      ) {
        state.value.singleArticleData = SingleNewsDataResponse.results[0];
        state.value.loading = false;
        return SingleNewsDataResponse;
      }
      return;
    } catch (error) {
      console.error("An error occurred during address lookup:", error);
      throw error;
    }
  };

  return {
    fetchNews,
    fetchSingleNewsPost,
    ...toRefs(state.value),
  };
};
