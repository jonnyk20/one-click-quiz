import React, { useState, useEffect } from 'react';

import MoreFeaturesCTA from '../components/MoreFeaturesCTA';
import { FormattedQuiz } from '../utils/formatQuiz';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { isNotNilOrEmpty } from '../utils/utils';
import { QUIZ_TAGS } from '../constants/quizProperties';
import Body from '../components/Medoosa/Body';

import './FinishScreen.scss';
import Button from '../components/Button';
import TaxaChallengeScoreboard from '../components/TaxaChallengeScoreboard';
import ColorSelector from '../components/ColorSelector';
import ProgressBar from '../components/ProgressBar';
import ProjectInfo from '../components/ProjectInfo';
import SubmissionConfirmation from '../components/SubmissionConfirmation';

const submitScore = async (scoreRecord: any) => {
  const response = await fetch(
    `${window.location.origin}/api/taxa-challenge-scores`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scoreRecord)
    }
  );
  const json = await response.json();

  return json;
};

interface State {
  quiz: FormattedQuiz;
  user: string;
  modSelections: any;
  correctAnswers: number;
  maxCorrectAnswers: number;
  score: number;
}

type Location = {
  state: State;
};

enum ScoreSubmissionstate {
  INITIAL,
  SUBMITTING,
  SUBMITTED
}

const FinishScreen: React.SFC = () => {
  const location: Location = useLocation();
  const history = useHistory();

  const [state, setState] = useState<ScoreSubmissionstate>(
    ScoreSubmissionstate.INITIAL
  );

  const {
    quiz,
    user,
    modSelections: initialModSelections,
    correctAnswers,
    score,
    maxCorrectAnswers
  } = location.state;

  const [inputValue, setInputValue] = useState<string>('');
  const [modSelections, setModSelectons] = useState(initialModSelections);

  const hasNotSubmitted = state === ScoreSubmissionstate.INITIAL;
  const isSubmitting = state === ScoreSubmissionstate.SUBMITTING;
  const isSubmitted = state === ScoreSubmissionstate.SUBMITTED;

  const isTaxaChallengeQuiz = quiz.tags.includes(QUIZ_TAGS.TAXA_CHALLENGE);
  const isMyObservationQuiz = quiz.tags.includes(QUIZ_TAGS.MY_OBSERVATIONS);
  const isMarineLifeQuiz = quiz.tags.includes(QUIZ_TAGS.MARINE_LIFE);
  const isINaturalistQuiz =
    isTaxaChallengeQuiz || isMyObservationQuiz || isMarineLifeQuiz;

  if (!quiz) return null;

  const selectColor = (value: number) => {
    const newColorMod = { name: 'color', value };

    const newModSelections = [newColorMod, ...modSelections.slice(1)];

    setModSelectons(newModSelections);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const scoreRecord = {
      modSelections,
      correctAnswers,
      name: inputValue,
      quizName: quiz.name,
      score
    };

    if (isNotNilOrEmpty(inputValue.trim())) {
      setState(ScoreSubmissionstate.SUBMITTING);
      await submitScore(scoreRecord);
      setState(ScoreSubmissionstate.SUBMITTED);
    }
  };

  const renderScoreSubmissionContent = () => (
    <>
      <div>
        <Body stage={5} modSelections={modSelections} />
        <ColorSelector
          selectedColorIndex={modSelections[0].value}
          selectColor={selectColor}
        />
      </div>
      <div className="text-x-large text-light-color mb-10 mt-20">Well Done</div>
      <div className="mv-10">{quiz.name}</div>
      <div>
        Correct:&nbsp;
        <span className="text-light-color">{`${correctAnswers}/${maxCorrectAnswers}`}</span>
        <span>&nbsp;-&nbsp;Score:&nbsp;</span>
        <span className="text-light-color">{score}</span>
      </div>

      {isINaturalistQuiz && hasNotSubmitted && (
        <form onSubmit={onSubmit} className="finish-screen__form mb-50 mt-20">
          <input
            value={inputValue}
            placeholder="Your name..."
            className="finish-screen__form__input"
            onChange={handleChange}
          />
          <Button onClick={onSubmit}>Submit Score</Button>
        </form>
      )}

      {isSubmitting && <ProgressBar progress={0} />}
    </>
  );

  return (
    <div className="finish-screen container">
      {isINaturalistQuiz && (
        <TaxaChallengeScoreboard isScoreSubmitted={isSubmitted} />
      )}

      {hasNotSubmitted && renderScoreSubmissionContent()}

      {isSubmitted && (
        <SubmissionConfirmation
          isMyObservationQuiz={isMyObservationQuiz}
          user={user}
          isTaxaChallengeQuiz={isTaxaChallengeQuiz}
        />
      )}

      {!isMarineLifeQuiz && (
        <>
          <div className="mt-50 text-medium">
            <MoreFeaturesCTA />
          </div>
          <div className="mt-20 text-medium">
            <Link to="/">Home</Link>
          </div>
        </>
      )}

      {isMarineLifeQuiz && (
        <div className="mt-20">
          <Link to="/marine-life">
            <Button onClick={() => {}}>Try Again</Button>
          </Link>
        </div>
      )}

      {isSubmitted && (
        <div className="mt-50">
          <ProjectInfo />
        </div>
      )}
    </div>
  );
};

export default FinishScreen;
