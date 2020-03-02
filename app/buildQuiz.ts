import { getBingImages } from "./services/Azureservice";
import Quiz from "./db/models/Quiz";
import QuizType from "./db/models/QuizType";
import Question from "./db/models/Question";
import ItemType from "./db/models/ItemType";
import Item from "./db/models/Item";
import { splitEvery, range } from "ramda";

const parseString = (str: string) => str.split("\n");

type RawItemData = {
  data: {
    image_url: string;
    name: string;
  };
};

type buildQuizType = (data: string, socket: any) => void;
const buildTestQuiz = async (rawItemData: RawItemData[]) => {
  try {
    // make quiz
    const quizType = await QuizType.findOne({ where: { name: "image-quiz" } });
    const quizTypeId = quizType?.id;
    const itemType = await ItemType.findOne({ where: { name: "image-item" } });
    const itemTypeId = itemType?.id;
    const numChoices = 4;
    const numQuestions = Math.ceil(rawItemData.length / numChoices);

    const formattedItems = rawItemData.map(item => ({ ...item, itemTypeId }));
    const items = await Item.bulkCreate(formattedItems);
    const itemIds = items.map(({ id }) => id);
    const groupedItemIds = splitEvery(numChoices, itemIds);

    const questions = range(0, numQuestions).map(i => {
      return {
        correctAnswerIndex: Math.floor(Math.random() * numChoices),
        choices: groupedItemIds[i].map(itemId => ({ itemId }))
      };
    });

    const quiz = await Quiz.create(
      {
        name: "please",
        quizTypeId,
        questions
      },
      { include: [{ model: Question, as: "questions" }] }
    );

    const { id: quizId } = quiz;
    const formattedQuiz = Quiz.findOne({ where: { id: quizId } });

    return formattedQuiz;
  } catch (error) {
    console.log("FAILED TO CREATE QUIZ", error);
    return {};
  }
};

const buildQuiz: buildQuizType = async (data, socket) => {
  const items = parseString(data);
  const formattedItems: RawItemData[] = await getBingImages(items, socket);
  const quiz = await buildTestQuiz(formattedItems);
  socket.emit("completed", quiz);
};

export default buildQuiz;
