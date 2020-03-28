import {
  getBingImages,
  getWebSnippets,
  ItemWithImage,
  ItemWithSnippetsType
} from './services/Azureservice';
import Quiz from './db/models/Quiz';
import QuizType from './db/models/QuizType';
import Question from './db/models/Question';
import ItemType from './db/models/ItemType';
import Item from './db/models/Item';
import { splitEvery, range } from 'ramda';
import words from './constants/words';
import { isNilOrEmpty, isNotNilOrEmpty } from './utils/utils';

const { animals, adjectives } = words;

const getRandomItem = (items: Array<any>) =>
  items[Math.floor(Math.random() * items.length)];

const makeSlug = () =>
  `${getRandomItem(adjectives)}-${getRandomItem(animals)}`
    .replace(' ', '-')
    .replace(/(?!-)[^a-z]+/gi, '')
    .toLocaleLowerCase();

const generateSlug = async (): Promise<string> => {
  let slug: string | null = null;

  while (!slug) {
    const generatedSlug = makeSlug();
    const existingRecord = await Quiz.findOne({
      where: { url: generatedSlug }
    });
    if (isNilOrEmpty(existingRecord)) {
      slug = generatedSlug;
    }
  }

  return slug;
};

enum QuizFormatType {
  IMAGE = 'image',
  SENTENCE = 'sentence'
}

type QuizItemType = ItemWithImage | ItemWithSnippetsType;

const buildQuiz = async (
  rawItemData: QuizItemType[],
  socket: SocketIO.Socket,
  type: QuizFormatType
): Promise<Quiz | null> => {
  try {
    if (isNilOrEmpty(rawItemData)) {
      socket.emit('builder-fail', {});
      return null;
    }
    // make quiz
    const quizType = await QuizType.findOne({
      where: { name: `${type}-quiz` }
    });
    const quizTypeId = quizType?.id;
    const itemType = await ItemType.findOne({
      where: { name: `${type}-item` }
    });
    const itemTypeId = itemType?.id;
    const numChoices = 4;
    const numQuestions = Math.ceil(rawItemData.length / numChoices);

    const formattedItems = rawItemData.map(item => ({ ...item, itemTypeId }));
    const items = await Item.bulkCreate(formattedItems);
    const itemIds = items.map(({ id }) => id);
    const groupedItemIds = splitEvery(numChoices, itemIds);
    const lastQuestionChoiceCount =
      groupedItemIds[groupedItemIds.length - 1].length;

    const questions = range(0, numQuestions).map((i: number) => {
      const isLastQuestion: boolean = i === numQuestions - 1;
      const choiceCount: number = isLastQuestion
        ? lastQuestionChoiceCount
        : numChoices;

      return {
        correctAnswerIndex: Math.floor(Math.random() * choiceCount),
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
      { include: [{ model: Question, as: 'questions' }] }
    );

    const { id: quizId } = quiz;
    const formattedQuiz = Quiz.findOne({ where: { id: quizId } });

    return formattedQuiz;
  } catch (error) {
    console.log('FAILED TO CREATE QUIZ', error);
    return null;
  }
};

type CompletedQuizPayload = {
  url?: string;
};

export const getImageQuiz = async (data: string[], socket: SocketIO.Socket) => {
  const items = data;
  const formattedItems: ItemWithImage[] = await getBingImages(items, socket);
  const quiz: Quiz | null = await buildQuiz(
    formattedItems,
    socket,
    QuizFormatType.IMAGE
  );
  if (isNotNilOrEmpty(quiz)) {
    const payload: CompletedQuizPayload = { url: quiz?.url };
    socket.emit('completed', payload);
  }
};

export const getSentenceQuiz = async (
  data: string[],
  socket: SocketIO.Socket
) => {
  const items = data;
  const formattedItems: ItemWithSnippetsType[] = await getWebSnippets(
    items,
    socket
  );
  const quiz: Quiz | null = await buildQuiz(
    formattedItems,
    socket,
    QuizFormatType.SENTENCE
  );

  if (isNotNilOrEmpty(quiz)) {
    const payload: CompletedQuizPayload = { url: quiz?.url };
    socket.emit('completed', payload);
  }
};

export default getImageQuiz;
