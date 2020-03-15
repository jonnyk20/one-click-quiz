import React from 'react';

import StageBar from './StageBar';
import Body from './Medoosa/Body';

import './MedoosaProgress.scss';

type PropTypes = {
  correctAnswers: number;
  maxCorrectAnswers: number;
  modSelections: any;
};

const MedoosaProgress: React.SFC<PropTypes> = props => {
  const { correctAnswers, maxCorrectAnswers, modSelections } = props;
  const hasScored = correctAnswers > 0;

  const stage = (correctAnswers / maxCorrectAnswers) * 5;

  return (
    <div className="medoosa-progress">
      <div
        className={`medoosa-progress__avatar ${hasScored &&
          'medoosa-progress__avatar--show-color'}`}
      >
        <div className="medoosa-progress__avatar__medoosa">
          <Body stage={5} modSelections={modSelections} />
        </div>
      </div>
      <div>
        <StageBar
          stage={stage}
          onStartLevelUp={() => {}}
          isLevelingUp={false}
          levelUpPending={false}
        />
      </div>
    </div>
  );
};

export default MedoosaProgress;
