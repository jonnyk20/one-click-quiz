import React from 'react';
import Body from '../components/Medoosa/Body/Body';
import EvolutionGlow from '../components/EvolutionGlow/EvolutionGlow';

const modSelections = [
  {
    name: 'color',
    value: 3
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
    value: 0
  }
];

const MedoosaTest = () => {
  return (
    <div className="container">
      <div>
        <Body stage={2} modSelections={modSelections} />
        <EvolutionGlow />
      </div>
    </div>
  );
};

export default MedoosaTest;
