import React, { useState } from 'react';

import MoreFeaturesCTA from '../components/MoreFeaturesCTA';
import ProjectInfo from '../components/ProjectInfo';
import { FormattedQuiz } from '../utils/formatQuiz';
import { useLocation, Link } from 'react-router-dom';
import { isNilOrEmpty, encodeQueryString } from '../utils/utils';
import { QUIZ_TAGS } from '../constants/quizProperties';
import Body from '../components/Medoosa/Body';

import './FinishScreen.scss';
import Button from '../components/Button';
import TaxaChallengeScoreboard from '../components/TaxaChallengeScoreboard';
import ColorSelector from '../components/ColorSelector';

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

const FinishScreen: React.SFC = () => {
  const location: Location = useLocation();

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

  if (!quiz) return null;

  const isTaxaChallengeQuiz = quiz.tags.includes(QUIZ_TAGS.TAXA_CHALLENGE);

  const selectColor = (value: number) => {
    const newColorMod = { name: 'color', value };

    const newModSelections = [newColorMod, ...modSelections.slice(1)];

    setModSelectons(newModSelections);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const submitScore = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
  };

  return (
    <div className="finish-screen container">
      {isTaxaChallengeQuiz && <TaxaChallengeScoreboard />}
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

      {isTaxaChallengeQuiz && (
        <form
          onSubmit={submitScore}
          className="finish-screen__form mb-50 mt-20"
        >
          <input
            value={inputValue}
            placeholder="Your name..."
            className="finish-screen__form__input"
            onChange={handleChange}
          />
          <Button onClick={() => {}}>Submit Score</Button>
        </form>
      )}

      <div className="mt-50 text-medium">
        <MoreFeaturesCTA />
      </div>

      <div className="mt-20 text-medium">
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default FinishScreen;
