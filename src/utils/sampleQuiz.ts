import { range } from 'ramda';
import {
  FormattedQuiz,
  FormattedQuestion,
  FormattedChoice
} from './formatQuiz';
import { QUIZ_TYPES, QUIZ_TAGS } from '../constants/quizProperties';

const makeImageChoice = (i: number): FormattedChoice => ({
  name: `shark-${i}`,
  details: 'Scientific Name',
  image_url:
    'https://static.scientificamerican.com/blogs/cache/file/2ADE5D5E-8489-4BC6-8AABF71C66ACB9B4_source.jpg'
});

const makeSentenceChoice = (i: number): FormattedChoice => ({
  name: `word-${i}`,
  snippets: [
    {
      snippet: `This text has word-${i} in the middle of it.`,
      displayUrl: 'https://www.example.com'
    },
    {
      snippet: `word-${i} is in this text, along with other words`,
      displayUrl: 'https://www.example.com'
    },
    {
      snippet: `The texts ends with with word-${i}`,
      displayUrl: 'https://www.example.com'
    }
  ]
});

const makeImageQuestion = (): FormattedQuestion => ({
  correctAnswerIndex: 0,
  choices: range(0, 1).map(makeImageChoice)
});

export const sampleImageQuiz: FormattedQuiz = {
  name: 'Sharks of the Pacific',
  quizType: QUIZ_TYPES.IMAGE_QUIZ,
  questions: range(0, 4).map(makeImageQuestion),
  tags: [QUIZ_TAGS.TAXA_CHALLENGE]
};

const makeSentenceQuestion = (): FormattedQuestion => ({
  correctAnswerIndex: 0,
  choices: range(0, 1).map(makeSentenceChoice)
});

export const sampleSentenceQuiz: FormattedQuiz = {
  name: 'Words',
  quizType: QUIZ_TYPES.SENTENCE_QUIZ,
  questions: range(0, 4).map(makeSentenceQuestion),
  tags: []
};
