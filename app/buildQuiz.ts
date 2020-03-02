import { getBingImages } from "./services/Azureservice";
import Quiz from "./db/models/Quiz";
import QuizType from "./db/models/QuizType";
import Question from "./db/models/Question";
import Choice from "./db/models/Choice";
import ItemType from "./db/models/ItemType";
import Item from "./db/models/Item";
import { splitEvery, range } from "ramda";

const parseString = (str: string) => str.split("\n");

type buildQuizType = (data: string, socket: any) => void;
const buildTestQuiz = async () => {
  const rawItemData = [
    {
      data: {
        image_url: "404",
        name: "Not found"
      }
    },
    {
      data: { image_url: "404", name: "Not found" }
    }
  ];

  try {
    // make quiz
    const quizType = await QuizType.findOne({ where: { name: "image-quiz" } });
    const quizTypeId = quizType?.id;
    const itemType = await ItemType.findOne({ where: { name: "image-item" } });
    const itemTypeId = itemType?.id;
    const numChoices = 4;
    const numQuestions = Math.ceil(rawItemData.length / numChoices);
    const fortmaChoiceData = (itemData: any, questions: any) => {
      // const groupedItemData = splitEvery(4, itemData);
      const formattedChoices = itemData.map((item: any, i: number) => {
        const questionIndex = Math.floor(i / numChoices);
        const questionId = questions[questionIndex].id;
        return {
          questionId,
          item: {
            ...item,
            itemTypeId
          }
        };
      });
      return formattedChoices;
    };

    const formattedItems = rawItemData.map(item => ({ ...item, itemTypeId }));
    const items = await Item.bulkCreate(formattedItems);
    const itemIds = items.map(({ id }) => id);
    const groupedItemIds = splitEvery(numChoices, itemIds);

    const questions = range(0, numQuestions).map(i => {
      return {
        choices: groupedItemIds[i].map(itemId => ({ itemId }))
      };
    });

    const quiz = await Quiz.create(
      {
        name: "no3",
        quizTypeId,
        questions
      },
      { include: [{ model: Question, as: "questions" }] }
    );

    const { id: quizId } = quiz;
    const formattedQuiz = Quiz.findOne({ where: { id: quizId } });

    console.log("CREATED QUIZ", quiz);
    return formattedQuiz;
  } catch (error) {
    console.log("FAILED TO CREATE QUIZ", error);
    return {};
  }
};

const buildQuiz: buildQuizType = async (data, socket) => {
  const items = parseString(data);
  const quiz = await buildTestQuiz();
  socket.emit("completed", { quiz });
};

export default buildQuiz;
