const parseString = (str: string) => str.split("\n");
const mockRequest = (item: any, i: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (i !== 2) {
        return resolve(`image-${item}`);
      }
      reject("error fetching");
    }, 0);
  });
};

const getImage = async (item: any, i: number) => {
  let image = null;
  try {
    image = await mockRequest(item, i);
  } catch (error) {
    console.log("ERR", error);
  }
  return { item, image };
};

type getAllImagesType = (items: any, socket: SocketIO.Socket) => any[];

const getAllImages = async (items: any, socket: SocketIO.Socket) => {
  const itemCount = items.length;
  let completed = 0;

  const getImageAndUpdateCount = async (item: any, i: number) => {
    const value = await getImage(item, i);
    if (value.image) {
      completed += 1;
      socket.emit("update", { total: itemCount, completed });
    }
    return value;
  };

  const values = await Promise.all(items.map(getImageAndUpdateCount));
  socket.emit("completed", { total: itemCount, completed });
  return values;
};

type buildQuizType = (data: string, socket: any) => void;

const buildQuiz: buildQuizType = async (data, socket) => {
  const items = parseString(data);
  const itemsWithImages = await getAllImages(items, socket);
  console.log("submitting with items", itemsWithImages);
};

export default buildQuiz;
