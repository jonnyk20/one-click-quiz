const parseString = str => str.split("\n");
const mockRequest = (item, i) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (i !== 2) {
        return resolve(`image-${item}`);
      }
      reject("error fetching");
    }, 0);
  });
};

const getImage = async (item, i) => {
  let image = null;
  try {
    image = await mockRequest(item, i);
  } catch (error) {
    console.log("ERR", error);
  }
  return { item, image };
};

const getAllImages = async (items, socket) => {
  const itemCount = items.length;
  let completed = 0;

  const getImageAndUpdateCount = async (item, i) => {
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

const buildQuiz = async (data, socket) => {
  const items = parseString(data);
  const itemsWithImages = await getAllImages(items, socket);
  console.log("submitting with items", itemsWithImages);
};

module.exports = buildQuiz;
