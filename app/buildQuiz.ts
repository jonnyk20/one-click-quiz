import faker from "faker";
import { getBingImages } from "./services/Azureservice";
import Quiz from "./db/models/Quiz";
import QuizType from "./db/models/QuizType";
import Question from "./db/models/Question";
import ItemType from "./db/models/ItemType";
import Item from "./db/models/Item";
import { splitEvery, range } from "ramda";
import words from "./constants/words";

const { animals, adjectives } = words;

const parseString = (str: string) => str.split("\n");
const getRandomItem = (items: any) =>
  items[Math.floor(Math.random() * items.length)];

const makeSlug = () =>
  `${getRandomItem(adjectives)}-${getRandomItem(animals)}`
    .replace(/[^a-z]+/gi, "")
    .toLocaleLowerCase();

const generateSlug = async (): Promise<string> => {
  let slug: string | null = null;

  while (!slug) {
    const generatedSlug = makeSlug();
    const existingRecord = await Quiz.findOne({
      where: { url: generatedSlug }
    });
    if (!existingRecord) {
      slug = generatedSlug;
    }
  }

  return slug;
};

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

    const slug = await generateSlug();

    const quiz = await Quiz.create(
      {
        name: slug,
        url: slug,
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
