import { defineEventHandler } from 'h3';
const runtimeConfig = useRuntimeConfig();
const newsURL = 'https://newsdata.io/api/1/latest';
export default defineEventHandler(async (context) => {
  const url = context.node.req.url as string;
  const accessToken = runtimeConfig.public.newsApiKey;
  const pageToken = getQueryParameter(url, 'page');
  const articleId = getQueryParameter(url, 'id');

  if (!accessToken) {
    return {
      error: 'Parameter "accessToken" not found',
    };
  }
  let page = '';
  if (pageToken) {
    page = `&page=${pageToken}`;
  }

  let id = '';
  if (articleId) {
    id = `&id=${articleId}`;
  }

  const apiUrl = `${newsURL}?apikey=${accessToken}${page}${id}`;
  const response = await fetch(apiUrl, {
    method: 'GET',
  });

  if (!response.ok) {
    // Handle the case when the API request fails
    return {
      error: `Failed to fetch data from ${apiUrl}`,
    };
  }
  return await response.json();
});

function getQueryParameter(url: string, parameterName: string): string | null {
  try {
    const urlObject = new URL(newsURL + url);
    return urlObject.searchParams.get(parameterName);
  } catch {
    // Handle URL parsing errors
    return null;
  }
}
