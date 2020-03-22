import React, { useState, useEffect, CSSProperties } from 'react';
import Body from './Medoosa/Body/Body';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FixedSizeList as List } from 'react-window';
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

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const record = scoreRecords[index];
    const questionCount = record.questionCount || 10;
    const correctAnswerCount =
      record.correctAnswerCount || record.correctAnswers;
    const stage = (correctAnswerCount / questionCount) * 5;
    const medoosaStage = Math.floor(stage);

    return (
      <div
        className="taxa-challenge-scoreboard__records__record"
        key={`record${index}`}
        style={style}
      >
        <div className="taxa-challenge-scoreboard__records__record__avatar-container">
          <div className="taxa-challenge-scoreboard__records__record__avatar-container__avatar">
            <Body stage={medoosaStage} modSelections={record.modSelections} />
          </div>
        </div>
        <div className="taxa-challenge-scoreboard__records__record__details">
          <div>{record.name}</div>
          <div>{record.quizName}</div>
          <div>
            <span className="text-light-color">
              <b>{formatScore(record.score)}&nbsp;-&nbsp;</b>
            </span>
            <span>
              ({correctAnswerCount}/{questionCount})
            </span>
          </div>
        </div>
      </div>
    );
  };

  return isNotNilOrEmpty(scoreRecords) ? (
    <div className="taxa-challenge-scoreboard">
      <div className="taxa-challenge-scoreboard__title mt-10 border-bottom pb-10">
        ScoreBoard
      </div>
      <div className="taxa-challenge-scoreboard__records">
        <List
          height={300}
          itemCount={scoreRecords.length}
          itemSize={75}
          width={500}
        >
          {Row}
        </List>
      </div>
      <div className="taxa-challenge-scoreboard__scroll-indicator">
        <FontAwesomeIcon icon={faChevronDown} size="xs" />
      </div>
    </div>
  ) : null;
};

export default TaxaChallengeScoreboard;
