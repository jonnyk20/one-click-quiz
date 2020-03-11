import { range } from "ramda";
import {
  FormattedQuiz,
  FormattedQuestion,
  FormattedChoice
} from "./formatQuiz";
import { QUIZ_TYPES, QUIZ_TAGS } from "../constants/quizProperties";

const makeChoice = (i: number): FormattedChoice => ({
  name: `shark-${i}`,
  image_url:
    "https://static.scientificamerican.com/blogs/cache/file/2ADE5D5E-8489-4BC6-8AABF71C66ACB9B4_source.jpg"
});

const makeQuestion = (): FormattedQuestion => ({
  correctAnswerIndex: 0,
  choices: range(0, 4).map(makeChoice)
});

const testQuiz: FormattedQuiz = {
  name: "test",
  quizType: QUIZ_TYPES.IMAGE_QUIZ,
  questions: range(0, 4).map(makeQuestion),
  tags: [
    /*QUIZ_TAGS.TAXA_CHALLENGE*/
  ]
};

export default testQuiz;
