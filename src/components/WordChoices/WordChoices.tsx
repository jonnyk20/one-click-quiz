import React, { ReactElement } from 'react';
import { FormattedChoice } from '../../utils/formatQuiz';
import classNames from 'classnames';

import './WordChoices.scss';

const BASE_CLASS = 'word-choices';

type WordChoicePropsType = {
  index: number;
  choice: FormattedChoice;
  answerQuestion: (index: number) => void;
  isAnswered: boolean;
  isCorrect: boolean;
};

const WordChoice: React.SFC<WordChoicePropsType> = ({
  choice,
  answerQuestion,
  index,
  isAnswered,
  isCorrect
}): ReactElement => {
  const onClick = () => {
    answerQuestion(index);
  };

  const choiceBaseClass = `${BASE_CLASS}__choice`;

  const className = classNames(choiceBaseClass, {
    [`${choiceBaseClass}--${isCorrect ? 'correct' : 'incorrect'}`]: isAnswered
  });

  return (
    <div className={className} onClick={onClick}>
      {choice.name}
    </div>
  );
};

type WordChoicesPropsType = {
  choices: FormattedChoice[];
  answerQuestion: (index: number) => void;
  isAnswered: boolean;
  correctAnswerIndex: number;
};

const WordChoices: React.SFC<WordChoicesPropsType> = ({
  choices,
  answerQuestion,
  isAnswered,
  correctAnswerIndex
}): ReactElement => (
  <div className={BASE_CLASS}>
    {choices.map((c, i) => (
      <WordChoice
        key={c.name}
        choice={c}
        answerQuestion={answerQuestion}
        index={i}
        isAnswered={isAnswered}
        isCorrect={i === correctAnswerIndex}
      />
    ))}
  </div>
);

export default WordChoices;
