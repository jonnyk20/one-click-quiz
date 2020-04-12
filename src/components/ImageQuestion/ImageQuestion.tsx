import React, { useState, useEffect } from 'react';

import { FormattedQuestion } from '../../utils/formatQuiz';
import { isNotNilOrEmpty } from '../../utils/utils';
import Image from '../Image';
import Button from '../Button';
import MedoosaProgress from '../MedoosaProgress';

import './ImageQuestion.scss';

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

const MULTIPLIER_START = 50;
const MULTIPLIER_END = 1;
const MIN_ADDED_SCORE = 10;
const totalTime = 5000;
const intervalTime = 100;

const BASE_CLASS = 'image-question';

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
  const [multiplier, setMultiplier] = useState(MULTIPLIER_START);
  const [addedScore, setAddedScore] = useState(0);

  useEffect(() => {
    if (state === states.UNANSWERED) {
      const interval: NodeJS.Timeout = setInterval(() => {
        const decrease = (intervalTime / totalTime) * MULTIPLIER_START;
        if (multiplier > MULTIPLIER_END) {
          setMultiplier(Math.max(multiplier - decrease, MULTIPLIER_END));
          return;
        }
        clearInterval(interval);
      }, intervalTime);

      return () => {
        clearInterval(interval);
      };
    }
  }, [multiplier, state]);

  const answerQuestion = (i: number) => {
    if (isAnswered) return;
    if (i === correctAnswerIndex) {
      setState(states.CORRECT);
      incrementCorrectAnswers();
      const addedScore = Math.trunc(MIN_ADDED_SCORE * multiplier);
      setAddedScore(addedScore);
      incrementScore(addedScore);
    } else {
      setState(states.INCORRECT);
    }

    setMultiplier(MULTIPLIER_START);
  };

  const moveToNexQuestion = () => {
    incrementQuestion();
    setAddedScore(0);
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
      <div className={`${BASE_CLASS}__prompt mb-20`}>
        {!isAnswered ? (
          <div className={`${BASE_CLASS}__instructions mb-10`}>
            <div className="mb-10">Find the...&nbsp;</div>
            <div className={`${BASE_CLASS}__prompt__correct-choice-info`}>
              <span>
                <b className="text-light-color">
                  {choices[correctAnswerIndex].name}
                </b>
              </span>
              {isNotNilOrEmpty(choices[correctAnswerIndex].details) && (
                <span>
                  <b className="text-light-color">
                    &nbsp;({choices[correctAnswerIndex].details})
                  </b>
                </span>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={`${BASE_CLASS}__prompt__feedback`}>
              <div className="mr-10">{answerFeedback}</div>
              {isAnsweredCorrectly && (
                <div className={`${BASE_CLASS}__scoreboard__added-score mr-10`}>
                  <b>&nbsp;+{addedScore}</b>
                </div>
              )}
            </div>
            <div className="mv-20">
              <Button onClick={moveToNexQuestion}>Next</Button>
            </div>
          </>
        )}
      </div>
      <div className={`${BASE_CLASS}__image-container`}>
        {choices.map(({ image_url, name }, i) => (
          <Image
            key={name}
            answerQuestion={answerQuestion}
            i={i}
            image_url={image_url || ''}
            name={name}
            isCorrect={i === correctAnswerIndex}
            isAnswered={isAnswered}
          />
        ))}
      </div>
    </div>
  );
};

export default Question;
