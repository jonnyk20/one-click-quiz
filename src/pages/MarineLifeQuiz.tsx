import React, { useState, useEffect } from 'react';

import ProgressBar from '../components/ProgressBar';
import { FormattedQuiz } from '../utils/formatQuiz';
import { fetchTaxaAndBuildQuiz } from '../services/InaturalistService';
import { isNotNilOrEmpty } from '../utils/utils';
import { QUIZ_TAGS } from '../constants/quizProperties';
import TaxaQuizInstructions from '../components/TaxaQuizInstructions/TaxaQuizInstructions';

import './MarineLifeQuiz.scss';

const projectId = 'marine-life-meta';

enum QuizBuildingState {
  INITIAL,
  BUILDING,
  COMPLETE
}

const BASE_CLASS = 'marine-life-quiz';

const MarineLifeQuiz = () => {
  const [quizBuildingState, setQuizBuildingState] = useState<QuizBuildingState>(
    QuizBuildingState.BUILDING
  );
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  useEffect(() => {
    const buildQuiz = async () => {
      setQuizBuildingState(QuizBuildingState.INITIAL);

      const quiz: FormattedQuiz | null = await fetchTaxaAndBuildQuiz({
        name: 'Marine Life of B.C.',
        tags: [QUIZ_TAGS.MARINE_LIFE],
        projectId
      });

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
    <div className={`${BASE_CLASS} container`}>
      {showQuizBuildingProgress && (
        <div className={`${BASE_CLASS}__progress mv-10`}>
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {isNotNilOrEmpty(quiz) && <TaxaQuizInstructions quiz={quiz!} />}
    </div>
  );
};

export default MarineLifeQuiz;
