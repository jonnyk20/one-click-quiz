import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import TaxaQuestion, {
  ChoiceWithPhotos
} from '../components/TaxaQuestion/TaxaQuestion';
import { FormattedQuiz, FormattedQuestion } from '../utils/formatQuiz';
import { isNilOrEmpty, isNotNilOrEmpty } from '../utils/utils';
import testQuiz from '../utils/testQuiz';
import { QUIZ_TYPES } from '../constants/quizProperties';
import initializeModSelections from '../utils/initializeModSelections';

import './Quiz.scss';
import { getObservationPhotosForTaxa } from '../services/InaturalistService';

interface State {
  quiz: FormattedQuiz;
  user: string;
}

type Location = {
  state: State;
};

export interface QuestionWithAdditionalPhotos extends FormattedQuestion {
  choices: ChoiceWithPhotos[];
}

const TaxaQuiz = () => {
  const { slug = '' } = useParams();
  const [quiz, setQuiz] = useState<FormattedQuiz>({
    name: '',
    quizType: QUIZ_TYPES.IMAGE_QUIZ,
    questions: [],
    tags: []
  });
  const [correctAnswerCount, setCorrectAnswerrs] = useState<number>(0);
  const [maxCorrectAnswers, setmaxCorrectAnswers] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [modSelections, setModSelections] = useState<any>(
    initializeModSelections()
  );
  const [
    questionsWithAdditionalPhotos,
    setQuestionsWithAdditionalPhotos
  ] = useState<QuestionWithAdditionalPhotos[]>([]);

  const location: Location = useLocation();
  const history = useHistory();

  const isTesting = slug === 'testing';

  const isEmptyQuiz = isNotNilOrEmpty(quiz) && isNilOrEmpty(quiz.questions);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentQuestionWithAdditionalPhotos =
    questionsWithAdditionalPhotos[currentQuestionIndex];
  const areAdditionalImagesFetched = isNotNilOrEmpty(
    currentQuestionWithAdditionalPhotos
  );

  useEffect(() => {
    const addPhotosToChoices = async (question: FormattedQuestion) => {
      const taxonIds = question.choices.map(({ id }) => id || 0);
      const observationPhotos = await getObservationPhotosForTaxa(taxonIds);
      const taxaWithObservationPhotos = observationPhotos.map((photos, i) => ({
        ...question.choices[i],
        photos
      }));
      const questionWithAdditionalPhotos: QuestionWithAdditionalPhotos = {
        ...question,
        choices: taxaWithObservationPhotos
      };
      setQuestionsWithAdditionalPhotos([
        ...questionsWithAdditionalPhotos,
        questionWithAdditionalPhotos
      ]);
    };

    const addPhotosToQuestions = async () => {
      const { questions } = quiz;

      for (let [i, question] of questions.entries()) {
        if (questionsWithAdditionalPhotos.length === i) {
          await addPhotosToChoices(question);
        }
      }
    };

    if (!isEmptyQuiz) {
      addPhotosToQuestions();
    }
  }, [isEmptyQuiz, questionsWithAdditionalPhotos, quiz]);

  useEffect(() => {
    if (!isNilOrEmpty(location?.state?.quiz)) {
      const { quiz } = location.state;
      setQuiz(quiz);
      setmaxCorrectAnswers(quiz.questions.length);
      return;
    }

    if (isTesting) {
      setQuiz(testQuiz);
      setmaxCorrectAnswers(testQuiz.questions.length);
      return;
    }
  }, [history, isTesting, location, slug]);

  useEffect(() => {
    if (isFinished) {
      history.push({
        pathname: '/finish',
        state: {
          quiz,
          modSelections,
          score,
          correctAnswerCount,
          maxCorrectAnswers
        }
      });
    }
  }, [
    correctAnswerCount,
    history,
    isFinished,
    maxCorrectAnswers,
    modSelections,
    quiz,
    score
  ]);

  const updateModsSelection = () => {
    const newHeadMod = {
      name: 'head',
      value: 5
    };
    const newModSelections = [...modSelections.slice(0, 4), newHeadMod];

    setModSelections(newModSelections);
  };

  const incrementCorrectAnswers = () => {
    const newCorrectAnswersCount = correctAnswerCount + 1;
    setCorrectAnswerrs(newCorrectAnswersCount);

    if (newCorrectAnswersCount === maxCorrectAnswers) {
      updateModsSelection();
    }
  };
  const incrementScore = (addedScore: number) => setScore(score + addedScore);

  const incrementQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }
    setIsFinished(true);
  };

  return (
    <div className="quiz container">
      {isEmptyQuiz && (
        <div>
          <div className="mb-20">
            There might not be any wildlife registered to this location
          </div>
          <div className="mv-20">
            <Link to="/taxa-challenge" className="text-light-color">
              Try a different one!
            </Link>
          </div>
        </div>
      )}
      {!isEmptyQuiz && !isFinished && (
        <TaxaQuestion
          correctAnswerCount={correctAnswerCount}
          maxCorrectAnswers={maxCorrectAnswers}
          score={score}
          incrementCorrectAnswers={incrementCorrectAnswers}
          incrementScore={incrementScore}
          incrementQuestion={incrementQuestion}
          modSelections={modSelections}
          areAdditionalImagesFetched={areAdditionalImagesFetched}
          correctAnswerIndex={currentQuestion.correctAnswerIndex}
          choicesWithPhotos={currentQuestionWithAdditionalPhotos?.choices || []}
        />
      )}
    </div>
  );
};

export default TaxaQuiz;
