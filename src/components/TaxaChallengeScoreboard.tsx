import React from 'react';
import Body from '../components/Medoosa/Body';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatScore } from '../utils/utils';

import './TaxaChallengeScoreboard.scss';

const scoreRecord = {
  name: 'Jonny',
  quizName: 'Sharks of the Pacific',
  correctAnswers: 5,
  score: 12323,
  modSelections: [
    {
      name: 'color',
      value: 1
    },
    {
      name: 'eyes',
      value: 6
    },
    {
      name: 'mouth',
      value: 7
    },
    {
      name: 'arms',
      value: 4
    },
    {
      name: 'head',
      value: 5
    }
  ]
};

const scoreRecords = [scoreRecord, scoreRecord, scoreRecord, scoreRecord];

const TaxaChallengeScoreboard = () => {
  return (
    <div className="taxa-challenge-scoreboard">
      <div className="taxa-challenge-scoreboard__title mt-10 border-bottom pb-10">
        ScoreBoard
      </div>
      <div className="taxa-challenge-scoreboard__records">
        {scoreRecords.map((record, i) => {
          return (
            <div
              className="taxa-challenge-scoreboard__records__record"
              key={`record${i}`}
            >
              <div className="taxa-challenge-scoreboard__records__record__avatar-container">
                <div className="taxa-challenge-scoreboard__records__record__avatar-container__avatar">
                  <Body stage={5} modSelections={record.modSelections} />
                </div>
              </div>
              <div className="taxa-challenge-scoreboard__records__record__details">
                <div>{record.name}</div>
                <div>{record.quizName}</div>
                <div>
                  <span className="text-light-color">
                    <b>{formatScore(record.score)}&nbsp;-&nbsp;</b>
                  </span>
                  <span>({record.correctAnswers}/10)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="taxa-challenge-scoreboard__scroll-indicator">
        <FontAwesomeIcon icon={faChevronDown} size="xs" />
      </div>
    </div>
  );
};

export default TaxaChallengeScoreboard;
