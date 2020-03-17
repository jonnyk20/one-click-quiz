import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import TaxaChoice from '../TaxaChoice/TaxaChoice';
import { FormattedQuestion, FormattedChoice } from '../../utils/formatQuiz';
import Button from '../Button';
import MedoosaProgress from '../MedoosaProgress';
import { isNotNilOrEmpty } from '../../utils/utils';
import ProgressBar from '../ProgressBar';
import {
  getObservationPhotosForTaxa,
  FormattedObservationPhoto
} from '../../services/InaturalistService';

import './TaxaQuestion.scss';

enum states {
  UNANSWERED,
  CORRECT,
  INCORRECT
}

type PropTypes = {
  question: FormattedQuestion;
  incrementCorrectAnswers: () => void;
  incrementQuestion: () => void;
  incrementScore: (addedScore: number) => void;
  score: number;
  correctAnswers: number;
  maxCorrectAnswers: number;
  modSelections: any;
};

const MULTIPLIER_START = 50;
const MULTIPLIER_END = 1;
const MIN_ADDED_SCORE = 10;
const totalTime = 5000;
const intervalTime = 100;

const BASE_CLASS = 'taxa-question';

interface ChoiceWithPhotos extends FormattedChoice {
  photos: FormattedObservationPhoto[];
}

const TaxaQuestion: React.SFC<PropTypes> = ({
  question,
  incrementCorrectAnswers,
  incrementQuestion,
  correctAnswers,
  maxCorrectAnswers,
  score,
  incrementScore,
  modSelections
}) => {
  const { choices, correctAnswerIndex } = question;
  const [state, setState] = useState<states>(states.UNANSWERED);
  const [multiplier, setMultiplier] = useState<number>(MULTIPLIER_START);
  const [addedScore, setAddedScore] = useState<number>(0);
  const [loadedImagesCount, setLoadedImagesCount] = useState<number>(0);
  const [
    choicesWithAdditionalPhotos,
    setChoicesWithAdditionalPhotos
  ] = useState<ChoiceWithPhotos[]>([]);

  const isReady = loadedImagesCount === choices.length;

  useEffect(() => {
    const addPhotosToChoices = async () => {
      const taxonIds = choices.map(({ id }) => id || 0);
      const observationPhotos = await getObservationPhotosForTaxa(taxonIds);
      const taxaWithObservationPhotos = observationPhotos.map((photos, i) => ({
        ...choices[i],
        photos
      }));
      setChoicesWithAdditionalPhotos(taxaWithObservationPhotos);
    };

    addPhotosToChoices();
  }, [choices]);

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
      <div className={`${BASE_CLASS}__scoreboard mb-20`}>
        <MedoosaProgress
          correctAnswers={correctAnswers}
          maxCorrectAnswers={maxCorrectAnswers}
          modSelections={modSelections}
        />
        <div className={`${BASE_CLASS}__scoreboard__scores`}>
          <div>
            questions:&nbsp;
            <span className="text-light-color">{maxCorrectAnswers}</span>
          </div>
          <div>
            correct:&nbsp;
            <span className="text-light-color">{correctAnswers}</span>
          </div>
          <div>
            score:&nbsp;<span className="text-light-color">{score}</span>
          </div>
        </div>
      </div>
      <div className={`${BASE_CLASS}__prompt mb-20`}>
        {!isAnswered && isReady && (
          <div className={`${BASE_CLASS}__instructions`}>
            <div className="mb-10">Find the...&nbsp;</div>

            <div className={`${BASE_CLASS}__prompt__correct-choice-info`}>
              <span>
                <b className="text-light-color text-large">
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
            <div className="text-medium mt-10">
              Click&nbsp;
              <span className="text-light-color">
                <FontAwesomeIcon icon={faSyncAlt} size="sm" />
              </span>
              &nbsp;to change photos
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
            Loading Images... {`${loadedImagesCount}/${choices.length}`}
          </div>
          <ProgressBar progress={loadedImagesCount / choices.length} />
        </div>
      )}

      {
        <div
          className={`${BASE_CLASS}__choices ${
            !isReady ? `${BASE_CLASS}__choices--hide` : ''
          }`}
        >
          {choicesWithAdditionalPhotos.map(
            ({ image_url, name, details, photos }, i) => (
              <TaxaChoice
                key={name}
                answerQuestion={answerQuestion}
                i={i}
                image_url={image_url}
                name={name}
                isCorrect={i === correctAnswerIndex}
                isAnswered={isAnswered}
                details={details}
                setImageFetched={setImageFetched}
                photos={photos}
              />
            )
          )}
        </div>
      }
    </div>
  );
};

export default TaxaQuestion;
