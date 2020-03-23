import { FormattedQuestion } from './formatQuiz';
import { ChoiceWithPhotos } from '../components/TaxaQuestion/TaxaQuestion';
import { getRandomIndex, shuffle } from './utils';

export interface QuestionWithAdditionalPhotos extends FormattedQuestion {
  choices: ChoiceWithPhotos[];
}

export const formatTaxaQuestion = (
  question: QuestionWithAdditionalPhotos
): QuestionWithAdditionalPhotos => {
  const shuffledChoices = shuffle(question.choices) as ChoiceWithPhotos[];

  return {
    ...question,
    correctAnswerIndex: getRandomIndex(question.choices.length),
    choices: shuffledChoices.map(c => ({ ...c, photos: shuffle(c.photos) }))
  };
};
