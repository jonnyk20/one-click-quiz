import request, { RequestPromiseOptions } from 'request-promise';
import { isNotNilOrEmpty } from '../utils/utils';

const BASE_URL = 'https://api.cognitive.microsoft.com/bing/v7.0';
const MAX_IMAGE_RESULTS = 1;
const MAX_SNIPPET_RESULTS = 25;

const options: RequestPromiseOptions = {
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY
  },
  family: 4
};

type Value = {
  thumbnailUrl: string;
};

type ImageSearchResponseType = {
  _type: string;
  value: Value[];
};

export type ItemWithImage = {
  data?: {
    image_url: string;
    name: string;
  };
};

const getImageUrl = (result: ImageSearchResponseType): string =>
  result?.value?.[0]?.thumbnailUrl || '';

const getImage = async (searchQuery: string): Promise<string | null> => {
  const encodedQuery = encodeURI(searchQuery);
  const url = `${BASE_URL}/images/search?q=${encodedQuery}&safeSearch=Strict&count=${MAX_IMAGE_RESULTS}`;

  const res = await request(url, options);
  const json = JSON.parse(res);
  const imageUrl = getImageUrl(json);
  const decodedUrl = decodeURI(imageUrl);

  return decodedUrl || null;
};

const addImageToItem = async (item: string): Promise<ItemWithImage> => {
  let itemWithImage = {};

  try {
    const imageUrl = await getImage(item);

    if (isNotNilOrEmpty(imageUrl)) {
      itemWithImage = {
        data: {
          name: item,
          image_url: imageUrl
        }
      };
    }
  } catch (error) {
    console.log('ERR', error);
  }

  return itemWithImage;
};

type BuilderProgress = {
  completed: number;
  total: number;
};

export const getBingImages = async (
  items: string[],
  socket: SocketIO.Socket
) => {
  const itemCount = items.length;
  let completed = 0;

  const getImageAndUpdateCount = async (
    item: string
  ): Promise<ItemWithImage> => {
    const itemWithImage: any = await addImageToItem(item);

    // TODO: Sent update for failed images
    completed += 1;
    const update: BuilderProgress = { total: itemCount, completed };
    socket.emit('builder-progress-update', update);

    return itemWithImage;
  };

  const itemsWithImage: ItemWithImage[] = await Promise.all(
    items.map(getImageAndUpdateCount)
  );

  const filteredItemsWithImage = itemsWithImage.filter(i =>
    isNotNilOrEmpty(i.data)
  );

  return filteredItemsWithImage;
};

type WebSearchResultType = {
  displayUrl: string;
  snippet: string;
};

export type ItemWithSnippetsType = {
  data?: {
    snippets: WebSearchResultType[];
    name: string;
  };
};

type WebSearcResponseType = {
  webPages?: {
    value?: WebSearchResultType[];
  };
};

const getSnippetsFromResponse = (
  response: WebSearcResponseType
): WebSearchResultType[] =>
  response.webPages?.value?.slice(0, MAX_SNIPPET_RESULTS) || [];

const BLOG_PARAMETER = `site:wordpress.com `;

const fetchAndFormatSnippets = async (
  searchQuery: string,
  language: string
): Promise<WebSearchResultType[]> => {
  const languagePameter = `language:${language} `;
  const encodedQuery = encodeURI(
    `${BLOG_PARAMETER} ${languagePameter} ${searchQuery}`
  );
  const url = `${BASE_URL}/search?q=${encodedQuery}&safeSearch=Strict&count=${MAX_SNIPPET_RESULTS}`;

  const res = await request(url, options);
  const json = JSON.parse(res);
  const snippets = getSnippetsFromResponse(json);

  return snippets || [];
};

const addSnippetsToItem = async (
  item: string,
  language: string
): Promise<ItemWithSnippetsType> => {
  let itemWithImage = {};

  try {
    const snippets = await fetchAndFormatSnippets(item, language);

    const filteredSnippets = snippets.filter(s =>
      s.snippet.toLowerCase().includes(item.toLowerCase())
    );

    if (isNotNilOrEmpty(filteredSnippets)) {
      itemWithImage = {
        data: {
          name: item,
          snippets: filteredSnippets
        }
      };
    }
  } catch (error) {
    console.log('ERR', error);
  }

  return itemWithImage;
};

export const getWebSnippets = async (
  items: string[],
  socket: SocketIO.Socket,
  language: string
) => {
  const itemCount = items.length;
  let completed = 0;

  const getSnippetsAndUpdateCount = async (
    item: string
  ): Promise<ItemWithSnippetsType> => {
    const itemWithImage: any = await addSnippetsToItem(item, language);

    // TODO: Sent update for failed images
    completed += 1;
    const update: BuilderProgress = { total: itemCount, completed };
    socket.emit('builder-progress-update', update);

    return itemWithImage;
  };

  const itemsWithSnippets: ItemWithSnippetsType[] = await Promise.all(
    items.map(getSnippetsAndUpdateCount)
  );

  const filteredItemsWithSnippets = itemsWithSnippets.filter(i =>
    isNotNilOrEmpty(i.data)
  );

  return filteredItemsWithSnippets;
};
