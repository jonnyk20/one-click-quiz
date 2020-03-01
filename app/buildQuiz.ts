import { getBingImages } from "./services/Azureservice";
import models from "./db/models/index";

const parseString = (str: string) => str.split("\n");

type buildQuizType = (data: string, socket: any) => void;

const buildQuiz: buildQuizType = async (data, socket) => {
  const items = parseString(data);
  const itemsWithImages = await getBingImages(items, socket);

  socket.emit("completed", { items: itemsWithImages });

  console.log("submitting with items", itemsWithImages);
};

export default buildQuiz;
