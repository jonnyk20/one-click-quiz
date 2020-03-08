export type FormattedChoice = {
  name: string;
  image_url: string;
};

export type FormattedQuestion = {
  correctAnswerIndex: number;
  choices: FormattedChoice[];
};

export type FormattedQuiz = {
  name: string;
  quizType: string;
  questions: FormattedQuestion[];
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
    name: string;
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

export default (rawQuiz: RawQuiz): FormattedQuiz => {
  const { name } = rawQuiz;
  const quizType = rawQuiz.quizType.name;
  const questions = rawQuiz.questions.map(formatQuestion);
  const quiz = {
    name,
    quizType,
    questions
  };

  return quiz;
};
