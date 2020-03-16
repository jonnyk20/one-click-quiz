import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import { FormattedQuiz } from '../utils/formatQuiz';
import { fetchTaxaAndBuildQuiz } from '../services/InaturalistService';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { isNilOrEmpty } from '../utils/utils';
import { QUIZ_TAGS } from '../constants/quizProperties';

const projectId = 'b-c-marine-life';

enum QuizBuildingState {
  INITIAL,
  BUILDING,
  COMPLETE
}

const MarineLifeQuiz = () => {
  const [quizBuildingState, setQuizBuildingState] = useState<QuizBuildingState>(
    QuizBuildingState.INITIAL
  );
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  useEffect(() => {
    const buildQuiz = async () => {
      setQuizBuildingState(QuizBuildingState.BUILDING);

      const quiz: FormattedQuiz | null = await fetchTaxaAndBuildQuiz(
        null,
        [],
        '',
        'Marine Life',
        [QUIZ_TAGS.MARINE_LIFE],
        projectId,
        5
      );

      if (quiz) {
        setQuiz(quiz);
        setQuizBuildingState(QuizBuildingState.COMPLETE);
      }
    };

    buildQuiz();
  }, []);

  const showQuizBuildingProgress =
    quizBuildingState === QuizBuildingState.BUILDING;

  return (
    <div className="project-quiz container">
      {showQuizBuildingProgress && (
        <div className="taxa-challange__progress mv-10">
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {!isNilOrEmpty(quiz) && (
        <div>
          <div className="mv-20">
            <b>Start the Quiz!</b> - Tip: answering faster gets you a higher
            score
          </div>
          <Link to={{ pathname: '/quiz/taxa-challenge', state: { quiz } }}>
            <Button onClick={() => {}}> Start</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MarineLifeQuiz;
