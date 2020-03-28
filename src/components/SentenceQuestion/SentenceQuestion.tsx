import React, { useState } from 'react';

import { FormattedQuestion } from '../../utils/formatQuiz';
import Button from '../Button';
import MedoosaProgress from '../MedoosaProgress';

import './SentenceQuestion.scss';
import Sentence from '../Sentence/Sentence';
import WordChoices from '../WordChoices/WordChoices';

const SCORE_INCREMENT = 50;

const states = {
  UNANSWERED: 'UNANSWERED',
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT'
};

type PropTypes = {
  question: FormattedQuestion;
  incrementCorrectAnswers: () => void;
  incrementQuestion: () => void;
  incrementScore: (addedScore: number) => void;
  score: number;
  correctAnswerCount: number;
  maxCorrectAnswers: number;
  modSelections: any;
};

const BASE_CLASS = 'sentence-question';

const Question: React.SFC<PropTypes> = ({
  question,
  incrementCorrectAnswers,
  incrementQuestion,
  correctAnswerCount,
  maxCorrectAnswers,
  score,
  incrementScore,
  modSelections
}) => {
  const { choices, correctAnswerIndex } = question;
  const [state, setState] = useState(states.UNANSWERED);

  const answerQuestion = (i: number) => {
    if (isAnswered) return;
    if (i === correctAnswerIndex) {
      setState(states.CORRECT);
      incrementCorrectAnswers();
      incrementScore(SCORE_INCREMENT);
    } else {
      setState(states.INCORRECT);
    }
  };

  const moveToNexQuestion = () => {
    incrementQuestion();
    setState(states.UNANSWERED);
  };

  const isAnswered = state !== states.UNANSWERED;
  const isAnsweredCorrectly = state === states.CORRECT;

  const answerFeedback = isAnsweredCorrectly ? 'Correct!' : 'So Close!';

  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}__scoreboard mb-20`}>
        <MedoosaProgress
          correctAnswerCount={correctAnswerCount}
          maxCorrectAnswers={maxCorrectAnswers}
          modSelections={modSelections}
          isAnswered={isAnswered}
        />
        <div className={`${BASE_CLASS}__scoreboard__scores`}>
          <div>
            questions:&nbsp;
            <span className="text-light-color">{maxCorrectAnswers}</span>
          </div>
          <div>
            correct:&nbsp;
            <span className="text-light-color">{correctAnswerCount}</span>
          </div>
          <div>
            score:&nbsp;<span className="text-light-color">{score}</span>
          </div>
        </div>
      </div>
      <div className={`${BASE_CLASS}__prompt mb-10`}>
        {!isAnswered ? (
          <div className={`${BASE_CLASS}__instructions`}>
            <div className="mb-10 text-large">
              Find the word that fits&nbsp;
            </div>
          </div>
        ) : (
          <>
            <div className={`${BASE_CLASS}__prompt__feedback`}>
              <div className="mr-10">{answerFeedback}</div>
              {isAnsweredCorrectly && (
                <div className={`${BASE_CLASS}__scoreboard__added-score mr-10`}>
                  <b>&nbsp;+{SCORE_INCREMENT}</b>
                </div>
              )}
            </div>
            <div className="mv-10">
              <Button onClick={moveToNexQuestion}>Next</Button>
            </div>
          </>
        )}
      </div>
      <div>
        <Sentence
          word={choices[correctAnswerIndex].name}
          snippets={choices[correctAnswerIndex].snippets || []}
          isAnswered={isAnswered}
        />
      </div>
      <div>
        <WordChoices
          choices={choices}
          answerQuestion={answerQuestion}
          isAnswered={isAnswered}
          correctAnswerIndex={correctAnswerIndex}
        />
      </div>
    </div>
  );
};

export default Question;
