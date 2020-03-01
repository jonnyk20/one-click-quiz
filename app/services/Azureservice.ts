import request from "request-promise";

const BASE_URL = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
const MAX_RESULTS = 1;

const options = {
  headers: {
    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY
  }
};

type Value = {
  contentUrl: string;
};

type Result = {
  _type: string;
  value: Value[];
};

const getImageUrl = (result: Result) => result?.value?.[0].contentUrl || "";

const getImage = async (searchQuery: string) => {
  const encodedQuery = encodeURI(searchQuery);
  const url = `${BASE_URL}?q=${encodedQuery}&count=${MAX_RESULTS}`;
  const res = await request(url, options);
  const json = JSON.parse(res);
  const imageUrl = getImageUrl(json);
  const decodedUrl = decodeURI(imageUrl);

  return decodedUrl || null;
};

const getImageOrReturnNull = async (item: string) => {
  let image = null;
  try {
    image = await getImage(item);
  } catch (error) {
    console.log("ERR", error);
  }
  return { item, image };
};

export const getBingImages = async (
  items: string[],
  socket: SocketIO.Socket
) => {
  const itemCount = items.length;
  let completed = 0;

  const getImageAndUpdateCount = async (item: string) => {
    const value = await getImageOrReturnNull(item);
    if (value.image) {
      completed += 1;
      socket.emit("update", { total: itemCount, completed });
    }
    return value;
  };

  const values = await Promise.all(items.map(getImageAndUpdateCount));

  return values;
};
