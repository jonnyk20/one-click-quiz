import { getBingImages } from "./services/Azureservice";
import ItemType from "./db/models/ItemType";

const parseString = (str: string) => str.split("\n");

type buildQuizType = (data: string, socket: any) => void;

const buildQuiz: buildQuizType = async (data, socket) => {
  const items = parseString(data);
  // const itemsWithImages = await getBingImages(items, socket);

  const itemTtype = await ItemType.findOne();
  console.log("itemTtype", itemTtype);

  const itemsWithImages: string[] = [itemTtype?.name || ""];

  socket.emit("completed", { items: itemsWithImages });

  console.log("submitting with items", itemsWithImages);
};

export default buildQuiz;
