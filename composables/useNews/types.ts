import type { Ref } from 'vue';

export interface NewsPosts {
  article_id: string;
  title: string;
  link: string;
  keywords: string[];
  creator: string | null;
  video_url: string | null;
  description: string;
  content: string;
  pubDate: string;
  pubDateTZ: string;
  image_url: string;
  source_id: string;
  source_priority: number;
  source_name: string;
  source_url: string;
  source_icon: string;
  country: string[];
  category: string[];
  ai_tag: string;
  sentiment: string;
  sentiment_stats: string;
  ai_region: string;
  ai_org: string;
  duplicate: boolean;
}

export interface NewsResults {
  status: string;
  totalResults: number;
  results: NewsPosts[];
  nextPage: string;
}

export interface UseNewsState {
  data: NewsPosts[] | null;
  singleArticleData: NewsPosts | null;
  loading: boolean;
  nextPage: string;
  prevPage: string;
}

export type FetchNewsPosts = (pageToken: string) => Promise<NewsResults | null | undefined>;
export type FetchSingleNewsPost = (articleId: string) => Promise<NewsResults | null | undefined>;

export interface UseNews {
  data: Readonly<Ref<UseNewsState['data']>>;
  singleArticleData: Readonly<Ref<UseNewsState['singleArticleData']>>;
  fetchNews: FetchNewsPosts;
  fetchSingleNewsPost: FetchSingleNewsPost;
  loading: Readonly<Ref<boolean>>;
  nextPage: Ref<string>;
  prevPage: Ref<string>;
}

export type UseNewsReturn = () => UseNews;
