import { getBingImages } from "./services/Azureservice";
import Quiz from "./db/models/Quiz";
import Question from "./db/models/Question";

const parseString = (str: string) => str.split("\n");

type buildQuizType = (data: string, socket: any) => void;

const buildQuiz: buildQuizType = async (data, socket) => {
  const items = parseString(data);
  // const itemsWithImages = await getBingImages(items, socket);

  const quiz = await Quiz.findOne();
  const questions = "quiz?.questions";
  console.log("Questions", questions);

  // const itemsWithImages: string[] = [itemTtype?.name || ""];

  socket.emit("completed", { quiz });
};

export default buildQuiz;
