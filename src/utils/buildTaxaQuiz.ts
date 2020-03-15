import { splitEvery, range } from "ramda";
import { FormattedQuiz, FormattedChoice } from "./formatQuiz";
import { QUIZ_TYPES, QUIZ_TAGS } from "../constants/quizProperties";
import { isNilOrEmpty } from "./utils";

const filterOutEmptyNames = (taxa: Taxon[]): Taxon[] =>
  taxa.filter(taxon => !isNilOrEmpty(taxon.taxon.preferred_common_name));

export type Taxon = {
  taxon: {
    preferred_common_name: string;
    name: string;
    default_photo: {
      medium_url: string;
    };
    ancestor_ids: number[];
  };
};

type TaxonChoiceGroup = {
  taxa: Taxon[];
  score: number;
  matchingAncestorIds: number[];
};

const UNIQUE_TAXONOMY_RANK = 6;
const UNIQUE_TAXONOMY_LIMIT = 2;
const MATCHING_SCORE_THRESHOLD = 7;

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

const formatChoiceGroup = (group: Taxon[]): TaxonChoiceGroup => {
  let differenceFound = false;
  let score = 0;
  let ancestorIndex = 0;
  const matchingAncestorIds = [];
  while (!differenceFound) {
    const groupAncestorId =
      group.reduce(
        // eslint-disable-next-line no-loop-func
        (
          ancestorIdToMatch: number | null,
          taxon: Taxon,
          currentIndex: number
        ) => {
          const ancestorId = taxon.taxon.ancestor_ids[ancestorIndex];
          const isFirst = currentIndex === 0;
          const isMatching = ancestorId === ancestorIdToMatch;

          if (isFirst || isMatching) return ancestorId;

          return null;
        },
        null
      ) || 0;

    ancestorIndex += 1;

    if (groupAncestorId > 0) {
      score += 1;
      matchingAncestorIds.push(groupAncestorId);
    } else {
      differenceFound = true;
    }
  }

  return { score, matchingAncestorIds, taxa: group };
};

interface TaxonCountIndex {
  [id: number]: number;
}

const limitByTaxonomy = (groups: TaxonChoiceGroup[]) => {
  const results: TaxonChoiceGroup[] = [];
  const taxonCountIndex: TaxonCountIndex = {};

  groups.forEach(group => {
    const limitingTaxonId = group.matchingAncestorIds[UNIQUE_TAXONOMY_RANK];

    // If it's the first
    if (isNilOrEmpty(taxonCountIndex[limitingTaxonId])) {
      taxonCountIndex[limitingTaxonId] = 1;
      results.push(group);
      return;
    }

    // If it's less than the limit
    if (taxonCountIndex[limitingTaxonId] <= UNIQUE_TAXONOMY_LIMIT) {
      taxonCountIndex[limitingTaxonId] += 1;
      results.push(group);
      return;
    }
  });

  return results;
};

const rankAndFilterTaxaGroups = (groups: Taxon[][]): Taxon[][] => {
  const formattedChoiceGroups: TaxonChoiceGroup[] = groups.map(taxa => {
    const { score, matchingAncestorIds } = formatChoiceGroup(taxa);

    return {
      taxa,
      score,
      matchingAncestorIds
    };
  });

  const filtered = formattedChoiceGroups.filter(
    group => group.score >= MATCHING_SCORE_THRESHOLD
  );

  const unique = limitByTaxonomy(filtered);

  return unique.map(group => group.taxa);
};

const buildTaxaQuiz = (
  taxa: Taxon[],
  quizName: string,
  tags: QUIZ_TAGS[] = []
): FormattedQuiz => {
  const sortedTaxa = filterOutEmptyNames(sortByAncestry(taxa));
  const groupedChoices = splitEvery(MAX_CHOICE_COUNT, sortedTaxa);
  const filteredGroupChoices = rankAndFilterTaxaGroups(groupedChoices);
  const shuffledGroups = shuffle(filteredGroupChoices).slice(
    0,
    MAX_QUESTION_COUNT
  );
  const questionCount = Math.min(shuffledGroups.length, MAX_QUESTION_COUNT);

  const questions = range(0, questionCount).map((i: number) => {
    const choices = shuffledGroups[i];
    const choiceCount = choices.length;

    return {
      correctAnswerIndex: Math.floor(Math.random() * choiceCount),
      choices: choices.map(
        (taxon: Taxon): FormattedChoice => ({
          name: taxon.taxon.preferred_common_name,
          image_url: taxon.taxon.default_photo.medium_url,
          details: taxon.taxon.name
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
