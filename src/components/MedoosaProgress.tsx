import React from 'react';

import StageBar from './StageBar';

import './MedoosaProgress.scss';

type PropTypes = {
  correctAnswers: number;
  maxCorrectAnswers: number;
};

const MedoosaProgress: React.SFC<PropTypes> = props => {
  const { correctAnswers, maxCorrectAnswers } = props;

  const stage = (correctAnswers / maxCorrectAnswers) * 5;

  return (
    <div className="medoosa-progress">
      <StageBar
        stage={stage}
        onStartLevelUp={() => {}}
        isLevelingUp={false}
        levelUpPending={false}
      />
    </div>
  );
};

export default MedoosaProgress;
