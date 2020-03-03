// export type formattedQuiz = {
//     type: string;

// }

const formatChoice = (choice: any) => {
  return choice.item.data;
};

const formatQuestion = (question: any) => {
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

export default (rawQuiz: any) => {
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
