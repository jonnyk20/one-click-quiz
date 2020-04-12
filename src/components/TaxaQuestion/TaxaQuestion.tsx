import React, { useState, useEffect } from 'react';

import TaxaChoice from '../TaxaChoice/TaxaChoice';
import { FormattedChoice } from '../../utils/formatQuiz';
import Button from '../Button';
import MedoosaProgress from '../MedoosaProgress';
import { isNotNilOrEmpty } from '../../utils/utils';
import ProgressBar from '../ProgressBar';
import { FormattedObservationPhoto } from '../../services/InaturalistService';

import './TaxaQuestion.scss';

enum states {
  UNANSWERED,
  CORRECT,
  INCORRECT
}

type PropTypes = {
  incrementCorrectAnswers: () => void;
  incrementQuestion: () => void;
  incrementScore: (addedScore: number) => void;
  score: number;
  correctAnswerCount: number;
  maxCorrectAnswers: number;
  modSelections: any;
  choicesWithPhotos: ChoiceWithPhotos[];
  correctAnswerIndex: number;
  areAdditionalImagesFetched: boolean;
  addCurrentQuestionToRedemption: () => void;
  isRedemptionRun: boolean;
};

const MULTIPLIER_START = 50;
const MULTIPLIER_END = 1;
const MIN_ADDED_SCORE = 10;
const totalTime = 5000;
const intervalTime = 100;

const BASE_CLASS = 'taxa-question';

export interface ChoiceWithPhotos extends FormattedChoice {
  photos: FormattedObservationPhoto[];
}

const TaxaQuestion: React.SFC<PropTypes> = ({
  choicesWithPhotos,
  incrementCorrectAnswers,
  incrementQuestion,
  correctAnswerCount,
  maxCorrectAnswers,
  score,
  incrementScore,
  modSelections,
  areAdditionalImagesFetched,
  correctAnswerIndex,
  addCurrentQuestionToRedemption,
  isRedemptionRun
}) => {
  const [state, setState] = useState<states>(states.UNANSWERED);
  const [multiplier, setMultiplier] = useState<number>(MULTIPLIER_START);
  const [addedScore, setAddedScore] = useState<number>(0);
  const [loadedImagesCount, setLoadedImagesCount] = useState<number>(0);

  const choiceCount = choicesWithPhotos.length;
  const correctChoice = choicesWithPhotos[correctAnswerIndex];
  const isReady =
    areAdditionalImagesFetched &&
    loadedImagesCount === choicesWithPhotos.length;

  useEffect(() => {
    if (state === states.UNANSWERED && isReady) {
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
  }, [isReady, multiplier, state]);

  const answerQuestion = (i: number) => {
    if (isAnswered) return;
    if (i === correctAnswerIndex) {
      setState(states.CORRECT);
      incrementCorrectAnswers();
      let addedScore = Math.trunc(MIN_ADDED_SCORE * multiplier);
      if (isRedemptionRun) addedScore = Math.floor(addedScore / 2);

      setAddedScore(addedScore);
      incrementScore(addedScore);
    } else {
      setState(states.INCORRECT);
      addCurrentQuestionToRedemption();
    }

    setMultiplier(MULTIPLIER_START);
  };

  const moveToNexQuestion = () => {
    incrementQuestion();
    setAddedScore(0);
    setState(states.UNANSWERED);
    setLoadedImagesCount(0);
  };

  const setImageFetched = () => {
    setLoadedImagesCount(loadedImagesCount + 1);
  };

  const isAnswered = state !== states.UNANSWERED;
  const isAnsweredCorrectly = state === states.CORRECT;

  const answerFeedback = isAnsweredCorrectly ? 'Correct!' : 'So Close!';

  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}__hud mb-20`}>
        <MedoosaProgress
          correctAnswerCount={correctAnswerCount}
          maxCorrectAnswers={maxCorrectAnswers}
          modSelections={modSelections}
          isAnswered={isAnswered}
          isRedemptionRun={isRedemptionRun}
        />

        <div className={`${BASE_CLASS}__hud__scores`}>
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
        {!isAnswered && isReady && (
          <div className={`${BASE_CLASS}__instructions`}>
            <div>Find the...&nbsp;</div>

            <div className={`${BASE_CLASS}__prompt__correct-choice-info`}>
              <span>
                <b className="text-light-color text-large">
                  {correctChoice.name}
                </b>
              </span>
              {isNotNilOrEmpty(correctChoice.details) && (
                <span>
                  <b className="text-light-color">
                    &nbsp;({correctChoice.details})
                  </b>
                </span>
              )}
            </div>
          </div>
        )}

        {isAnswered && (
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
      {!isReady && (
        <div className={`${BASE_CLASS}__loading`}>
          <div className="mb-20">
            Loading Images... {`${loadedImagesCount}/${choiceCount}`}
          </div>
          <ProgressBar progress={loadedImagesCount / choiceCount} />
        </div>
      )}

      {
        <div
          className={`${BASE_CLASS}__choices ${
            !isReady ? `${BASE_CLASS}__choices--hide` : ''
          }`}
        >
          {choicesWithPhotos.map(({ image_url, name, details, photos }, i) => (
            <TaxaChoice
              key={name}
              answerQuestion={answerQuestion}
              i={i}
              image_url={image_url || ''}
              name={name}
              isCorrect={i === correctAnswerIndex}
              isAnswered={isAnswered}
              details={details}
              setImageFetched={setImageFetched}
              photos={photos}
            />
          ))}
        </div>
      }
    </div>
  );
};

export default TaxaQuestion;
