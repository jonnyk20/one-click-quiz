import { splitEvery, range, groupWith, flatten } from "ramda";
import { FormattedQuiz, FormattedChoice } from "./formatQuiz";
import { QUIZ_TYPES, QUIZ_TAGS } from "../constants/quizProperties";
import { isNilOrEmpty } from "./utils";

const filterOutEmptyNames = (taxa: Taxon[]): Taxon[] =>
  taxa.filter(taxon => !isNilOrEmpty(taxon.taxon.preferred_common_name));

type Taxon = {
  taxon: {
    preferred_common_name: string;
    default_photo: {
      medium_url: string;
    };
    ancestor_ids: number[];
  };
};

const MAX_CHOICE_COUNT = 4;
const MAX_QUESTION_COUNT = 10;

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

const buildTaxaQuiz = (
  taxa: Taxon[],
  quizName: string,
  tags: QUIZ_TAGS[] = []
): FormattedQuiz => {
  const sortedTaxa = filterOutEmptyNames(sortByAncestry(taxa));
  const groupedChoices = splitEvery(MAX_CHOICE_COUNT, sortedTaxa);
  const shuffledGroups = shuffle(groupedChoices).slice(0, MAX_QUESTION_COUNT);
  const questionCount = Math.min(shuffledGroups.length, MAX_QUESTION_COUNT);

  const questions = range(0, questionCount).map((i: number) => {
    const choices = shuffledGroups[i];
    const choiceCount = choices.length;

    return {
      correctAnswerIndex: Math.floor(Math.random() * choiceCount),
      choices: choices.map(
        (taxon: Taxon): FormattedChoice => ({
          name: taxon.taxon.preferred_common_name,
          image_url: taxon.taxon.default_photo.medium_url
        })
      )
    };
  });

  const quiz = {
    name: quizName,
    quizType: QUIZ_TYPES.IMAGE_QUIZ,
    questions,
    tags
  };

  return quiz;
};

export default buildTaxaQuiz;
