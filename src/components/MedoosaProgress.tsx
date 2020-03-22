import React, { useState, useEffect } from 'react';

import StageBar from './StageBar';
import Body from './Medoosa/Body/Body';

import './MedoosaProgress.scss';
import EvolutionGlow from './EvolutionGlow/EvolutionGlow';

type PropTypes = {
  correctAnswerCount: number;
  maxCorrectAnswers: number;
  modSelections: any;
  isAnswered: boolean;
};

const MedoosaProgress: React.SFC<PropTypes> = props => {
  const {
    correctAnswerCount,
    maxCorrectAnswers,
    modSelections,
    isAnswered
  } = props;
  const hasScored = correctAnswerCount > 0;

  const stage = (correctAnswerCount / maxCorrectAnswers) * 5;

  const medoosaStage = Math.floor(stage);

  const barstage = Number.isInteger(stage) ? stage : stage + 0.25;

  const [prevMedoosaStage, setPrevMedoosaStage] = useState<number>(
    medoosaStage
  );
  const [isGlowVisible, setIsGlowVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isAnswered) {
      setIsGlowVisible(false);
    }
    if (isAnswered && medoosaStage > prevMedoosaStage) {
      setPrevMedoosaStage(medoosaStage);
      setIsGlowVisible(true);
      return;
    }
  }, [isAnswered, medoosaStage, prevMedoosaStage]);

  return (
    <div className="medoosa-progress">
      <div
        className={`medoosa-progress__avatar ${hasScored &&
          'medoosa-progress__avatar--show-color'}`}
      >
        <div className="medoosa-progress__avatar__medoosa">
          <Body stage={medoosaStage} modSelections={modSelections} />
        </div>
        {isGlowVisible && <EvolutionGlow />}
      </div>
      <div>
        <StageBar
          stage={barstage}
          onStartLevelUp={() => {}}
          isLevelingUp={false}
          levelUpPending={false}
        />
      </div>
    </div>
  );
};

export default MedoosaProgress;
