import { splitEvery, range } from "ramda";
import { FormattedQuiz, FormattedChoice } from "./formatQuiz";

type Taxon = {
  taxon: {
    preferred_common_name: string;
    default_photo: {
      medium_url: string;
    };
  };
};

const CHOICE_COUNT = 4;

const formatTaxaQuiz = (taxa: Taxon[]): FormattedQuiz => {
  const numQuestions = Math.ceil(taxa.length / CHOICE_COUNT);

  const groupedChoices = splitEvery(CHOICE_COUNT, taxa);
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

  const quiz = {
    name: "Taxa Challenge",
    quizType: "image-quiz",
    questions
  };

  return quiz;
};

export default formatTaxaQuiz;
