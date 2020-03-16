import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import { isEmpty } from 'ramda';
import Question from '../components/Question';
import formatQuiz, { FormattedQuiz } from '../utils/formatQuiz';
import {
  isNilOrEmpty,
  encodeQueryString,
  isNotNilOrEmpty
} from '../utils/utils';
import testQuiz from '../utils/testQuiz';
import { QUIZ_TYPES, QUIZ_TAGS } from '../constants/quizProperties';
import initializeModSelections from '../utils/initializeModSelections';

import './Quiz.scss';

const fetchQuiz = async (slug: string) => {
  const response = await fetch(`${window.location.origin}/api/quiz/${slug}`);
  const json = await response.json();

  return json;
};

interface State {
  quiz: FormattedQuiz;
  user: string;
}

type Location = {
  state: State;
};

const Quiz = () => {
  const { slug = '' } = useParams();
  const [quiz, setQuiz] = useState<FormattedQuiz>({
    name: '',
    quizType: QUIZ_TYPES.IMAGE_QUIZ,
    questions: [],
    tags: []
  });
  const [correctAnswers, setCorrectAnswerrs] = useState<number>(0);
  const [maxCorrectAnswers, setmaxCorrectAnswers] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [modSelections, setModSelections] = useState<any>(
    initializeModSelections()
  );
  const location: Location = useLocation();
  const user = location?.state?.user || '';
  const history = useHistory();

  const isTesting = slug === 'testing';

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);
      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
        setmaxCorrectAnswers(formattedQuiz.questions.length);
      } else {
        history.push('/');
      }
    };

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

    if (!isEmpty(slug)) {
      prepareQuiz();
    }
  }, [history, isTesting, location, slug]);

  useEffect(() => {
    if (isFinished) {
      history.push({
        pathname: '/finish',
        state: { quiz, modSelections, score, correctAnswers, maxCorrectAnswers }
      });
    }
  }, [
    correctAnswers,
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
    const newCorrectAnswersCount = correctAnswers + 1;
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

  const isEmptyQuiz = isNotNilOrEmpty(quiz) && isNilOrEmpty(quiz.questions);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isMyObservationQuiz = quiz.tags.includes(QUIZ_TAGS.MY_OBSERVATIONS);
  const isTaxaChallengeQuiz = quiz.tags.includes(QUIZ_TAGS.TAXA_CHALLENGE);
  const isINaturalistQuiz = isMyObservationQuiz || isTaxaChallengeQuiz;
  const isEmptyINaturalistQuiz = isINaturalistQuiz && isEmptyQuiz;

  return (
    <div className="quiz container">
      {isEmptyQuiz && (
        <h4 className="text-large">Looks like there are no questions</h4>
      )}
      {isEmptyINaturalistQuiz && (
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
      {!isNilOrEmpty(quiz.questions) && !isFinished && (
        <Question
          correctAnswers={correctAnswers}
          maxCorrectAnswers={maxCorrectAnswers}
          score={score}
          question={currentQuestion}
          incrementCorrectAnswers={incrementCorrectAnswers}
          incrementScore={incrementScore}
          incrementQuestion={incrementQuestion}
          modSelections={modSelections}
        />
      )}
    </div>
  );
};

export default Quiz;
