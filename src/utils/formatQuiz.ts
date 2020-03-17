import { QUIZ_TAGS, QUIZ_TYPES } from '../constants/quizProperties';

export type FormattedChoice = {
  name: string;
  image_url: string;
  details?: string;
  id?: number;
};

export type FormattedQuestion = {
  correctAnswerIndex: number;
  choices: FormattedChoice[];
};

export type FormattedQuiz = {
  name: string;
  quizType: QUIZ_TYPES;
  questions: FormattedQuestion[];
  tags: QUIZ_TAGS[];
};

type RawItem = {
  data: any;
};

type RawChoice = {
  item: RawItem;
};

type RawQuestion = {
  correctAnswerIndex: number;
  choices: RawChoice[];
};

type RawQuiz = {
  name: string;
  quizType: {
    name: QUIZ_TYPES;
  };
  questions: RawQuestion[];
};

const formatChoice = (choice: RawChoice): any => {
  return choice.item.data;
};

const formatQuestion = (question: RawQuestion): FormattedQuestion => {
  const {
    choices,
    correctAnswerIndex
  }: { choices: any; correctAnswerIndex: any } = question;
  const formattedQuestion = {
    correctAnswerIndex,
    choices: choices.map(formatChoice)
  };

  return formattedQuestion;
};

export default (rawQuiz: RawQuiz, tags: QUIZ_TAGS[] = []): FormattedQuiz => {
  const { name } = rawQuiz;
  const quizType = rawQuiz.quizType.name;
  const questions = rawQuiz.questions.map(formatQuestion);
  const quiz = {
    name,
    quizType,
    questions,
    tags
  };

  return quiz;
};
