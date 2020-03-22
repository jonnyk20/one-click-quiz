import React, { forwardRef } from 'react';
import './EvolutionGlow.scss';

const EvolutionGlow = forwardRef(({ hidden }, ref) => {
  return (
    <div className="evolution-glow" id="evolution-glow" ref={ref}>
      <div className="evolution-glow__light" />
    </div>
  );
});

export default EvolutionGlow;
