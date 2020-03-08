import { splitEvery, range, groupWith, flatten } from "ramda";
import {
  FormattedQuiz,
  FormattedChoice,
  FormattedQuestion
} from "./formatQuiz";

type Taxon = {
  taxon: {
    preferred_common_name: string;
    default_photo: {
      medium_url: string;
    };
    ancestor_ids: number[];
  };
};

const CHOICE_COUNT = 4;

const shuffle = (a: FormattedQuestion[]): FormattedQuestion[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

const sortByAncestry = (arr: Taxon[]) => {
  let sorted = [...arr];
  for (let i = 0; i < 9; i++) {
    sorted = sorted.sort((a, b) => {
      const val = a.taxon.ancestor_ids[i] - b.taxon.ancestor_ids[i];

      return val;
    });
  }

  return sorted;
};

const formatTaxaQuiz = (taxa: Taxon[]): FormattedQuiz => {
  const numQuestions = Math.ceil(taxa.length / CHOICE_COUNT);

  const sortedTaxa = sortByAncestry(taxa);

  const groupedChoices = splitEvery(CHOICE_COUNT, sortedTaxa);
  const lastQuestionChoiceCount =
    groupedChoices[groupedChoices.length - 1].length;

  const questions = range(0, numQuestions).map((i: number) => {
    const isLastQuestion: boolean = i === numQuestions - 1;
    const choiceCount: number = isLastQuestion
      ? lastQuestionChoiceCount
      : CHOICE_COUNT;

    return {
      correctAnswerIndex: Math.floor(Math.random() * choiceCount),
      choices: groupedChoices[i].map(
        (taxon: Taxon): FormattedChoice => ({
          name: taxon.taxon.preferred_common_name,
          image_url: taxon.taxon.default_photo.medium_url
        })
      )
    };
  });

  // Omitting the last question from the shuffle
  const shuffledQuestions: FormattedQuestion[] = [
    ...shuffle(questions.slice(0, -1)),
    ...questions.slice(-1)
  ];

  const quiz = {
    name: "Taxa Challenge",
    quizType: "image-quiz",
    questions: shuffledQuestions
  };

  return quiz;
};

export default formatTaxaQuiz;
