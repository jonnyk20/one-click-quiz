import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import ProgressBar, { Height } from './ProgressBar';
import './StageBar.scss';

const StageBar = ({ stage, levelUpPending, onStartLevelUp, isLevelingUp }) => {
  const [currentStage, setCurrentStage] = useState(stage);
  const [isPulsing, setIsPulsing] = useState(stage);
  const nextStage = currentStage + 1;

  const handleClick = num => {
    if (num === stage + 1 && levelUpPending) {
      onStartLevelUp();
    }
  };

  useEffect(() => {
    if (!isLevelingUp && !levelUpPending) {
      setCurrentStage(stage);
    }
  }, [stage, isLevelingUp]);

  useEffect(() => {
    if (levelUpPending) {
      setTimeout(() => {
        setIsPulsing(true);
      }, 2000);
    } else {
      setIsPulsing(false);
    }
  }, [levelUpPending]);

  const renderStageIcon = num => {
    let modifierClass = '';

    if (num <= currentStage) {
      modifierClass = 'stage-icon--current';
    }

    if (levelUpPending && num === nextStage && isPulsing) {
      modifierClass = 'stage-icon--next';
    }

    if (isLevelingUp && num === nextStage) {
      modifierClass = 'stage-icon--current';
    }

    if (num === 5 && num !== currentStage) {
      modifierClass = 'stage-icon--final';
    }

    if (num === 0) {
      modifierClass = 'hidden';
    }

    return (
      <div
        key={`stage-${num}`}
        className={`stage-icon ${modifierClass}`}
        onClick={() => handleClick(num)}
      >
        {num === 5 && <FontAwesomeIcon icon={faCrown} size="xs" />}
      </div>
    );
  };

  return (
    <div className="stage-bar">
      <div className="stage-bar__bar">
        <ProgressBar
          rounded
          fullWidth
          height={Height.SMALL}
          progress={
            levelUpPending || isLevelingUp ? nextStage / 5 : currentStage / 5
          }
        />
      </div>
      <div className="stage-bar__icons">
        {[0, 1, 2, 3, 4, 5].map(renderStageIcon)}
      </div>
      <div className="stage-bar__avatar" />
    </div>
  );
};

export default StageBar;
