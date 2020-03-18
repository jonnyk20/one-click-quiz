import request, { RequestPromiseOptions } from 'request-promise';
import { isNotNilOrEmpty } from '../utils/utils';

const BASE_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search';
const MAX_RESULTS = 1;

const options: RequestPromiseOptions = {
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY
  },
  family: 4
};

type Value = {
  thumbnailUrl: string;
};

type Result = {
  _type: string;
  value: Value[];
};

type ItemWithImage = {
  data?: {
    image_url: string;
    name: string;
  };
};

const getImageUrl = (result: Result): string =>
  result?.value?.[0].thumbnailUrl || '';

const delay = (interval: number) =>
  new Promise(resolve => setTimeout(resolve, interval));

const getImage = async (searchQuery: string): Promise<string | null> => {
  const encodedQuery = encodeURI(searchQuery);
  const url = `${BASE_URL}?q=${encodedQuery}&count=${MAX_RESULTS}`;

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

  const itemsWithImage: ItemWithImage[] = [];

  for (let item in items) {
    await delay(1000);
    const itemWithImage = await getImageAndUpdateCount(item);

    if (isNotNilOrEmpty(itemWithImage?.data)) {
      itemsWithImage.push(itemWithImage);
    }
  }

  return itemsWithImage;
};
