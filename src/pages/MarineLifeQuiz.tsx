import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import ProgressBar from '../components/ProgressBar';
import { FormattedQuiz } from '../utils/formatQuiz';
import { fetchTaxaAndBuildQuiz } from '../services/InaturalistService';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { isNilOrEmpty } from '../utils/utils';
import { QUIZ_TAGS } from '../constants/quizProperties';

import './MarineLifeQuiz.scss';

const projectId = 'marine-life-meta';

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
        'Marine Life of B.C.',
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
    <div className="marine-life-quiz container">
      {showQuizBuildingProgress && (
        <div className="taxa-challange__progress mv-10">
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {!isNilOrEmpty(quiz) && (
        <>
          <h3 className="text-medium text-light-color">Your Quiz is Ready</h3>

          <div className="mv-20 text-medium">
            <b>Tips</b>
          </div>

          <ul className="marine-life-quiz__tips mv-20">
            <li className="marine-life-quiz__tips__tip">
              Answering faster gets you a higher score
            </li>
            <li className="marine-life-quiz__tips__tip">
              You can click&nbsp;
              <span className="text-light-color">
                <FontAwesomeIcon icon={faSyncAlt} size="sm" />
              </span>
              &nbsp;to see different photos
            </li>
          </ul>
          <Link
            to={{ pathname: '/taxa-quiz', state: { quiz } }}
            className="mt-20 text-link"
          >
            <Button onClick={() => {}}> Start</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default MarineLifeQuiz;
