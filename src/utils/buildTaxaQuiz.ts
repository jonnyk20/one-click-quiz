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
const QUESTION_COUNT = 10;

const shuffle = (a: Taxon[][]): Taxon[][] => {
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

const buildTaxaQuiz = (taxa: Taxon[]): FormattedQuiz => {
  const sortedTaxa = sortByAncestry(taxa);
  const groupedChoices = splitEvery(CHOICE_COUNT, sortedTaxa);
  const shuffledGroups = shuffle(groupedChoices).slice(0, QUESTION_COUNT);

  const questions = range(0, QUESTION_COUNT).map((i: number) => {
    return {
      correctAnswerIndex: Math.floor(Math.random() * CHOICE_COUNT),
      choices: shuffledGroups[i].map(
        (taxon: Taxon): FormattedChoice => ({
          name: taxon.taxon.preferred_common_name,
          image_url: taxon.taxon.default_photo.medium_url
        })
      )
    };
  });

  const quiz = {
    name: "Taxa Challenge",
    quizType: "image-quiz",
    questions
  };

  return quiz;
};

export default buildTaxaQuiz;
