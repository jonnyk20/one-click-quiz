import request, { RequestPromiseOptions } from "request-promise";

const BASE_URL = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
const MAX_RESULTS = 1;

const options: RequestPromiseOptions = {
  headers: {
    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY
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

type RawItemData = {
  data: {
    image_url: string;
    name: string;
  };
};

const getImageUrl = (result: Result) => result?.value?.[0].thumbnailUrl || "";

const delay = (interval: number) =>
  new Promise(resolve => setTimeout(resolve, interval));

const getImage = async (searchQuery: string) => {
  const encodedQuery = encodeURI(searchQuery);
  const url = `${BASE_URL}?q=${encodedQuery}&count=${MAX_RESULTS}`;

  await delay(1000);

  const res = await request(url, options);
  const json = JSON.parse(res);
  const imageUrl = getImageUrl(json);
  const decodedUrl = decodeURI(imageUrl);

  return decodedUrl || null;
};

type GetImageOrReturnNull = (item: string) => RawItemData;

const getImageOrReturnNull = async (item: string) => {
  let image = null;
  try {
    image = await getImage(item);
  } catch (error) {
    console.log("ERR", error);
  }
  return { data: { name: item, image_url: image } };
};

type GetBingImages = (items: string[], socket: SocketIO.Socket) => RawItemData;
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

  const getImageAndUpdateCount = async (item: string) => {
    const value: any = await getImageOrReturnNull(item);

    const update: BuilderProgress = { total: itemCount, completed };
    if (value.data.image_url) {
      completed += 1;
      socket.emit("builder-progress-update", update);
    }
    return value;
  };

  const values = await Promise.all(items.map(getImageAndUpdateCount));

  return values;
};
