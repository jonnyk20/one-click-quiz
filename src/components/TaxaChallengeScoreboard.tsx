import React, { useState, useEffect } from 'react';
import Body from '../components/Medoosa/Body';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatScore, isNotNilOrEmpty } from '../utils/utils';

import './TaxaChallengeScoreboard.scss';

const fetchScores = async () => {
  const response = await fetch(
    `${window.location.origin}/api/taxa-challenge-scores`
  );
  const json = await response.json();

  return json;
};

type PropTypes = {
  isScoreSubmitted: boolean;
};

const TaxaChallengeScoreboard: React.SFC<PropTypes> = props => {
  const [scoreRecords, setScoreRecords] = useState<any>([]);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  const { isScoreSubmitted } = props;

  useEffect(() => {
    const fetchScoreRecords = async () => {
      const records = await fetchScores();

      if (records) {
        const formattedRecords = records
          .map(({ data }: { data: any }) => data)
          .sort((a: any, b: any) => b.score - a.score);
        setScoreRecords(formattedRecords);
      }
    };

    const needsToUpdate = hasInitialized && isScoreSubmitted;

    if (!hasInitialized || needsToUpdate) {
      fetchScoreRecords();
      setHasInitialized(true);
    }
  }, [isScoreSubmitted, hasInitialized]);

  return isNotNilOrEmpty(scoreRecords) ? (
    <div className="taxa-challenge-scoreboard">
      <div className="taxa-challenge-scoreboard__title mt-10 border-bottom pb-10">
        ScoreBoard
      </div>
      <div className="taxa-challenge-scoreboard__records">
        {scoreRecords.map((record: any, i: number) => {
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
  ) : null;
};

export default TaxaChallengeScoreboard;
