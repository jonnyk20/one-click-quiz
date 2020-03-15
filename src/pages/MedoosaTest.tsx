import React from 'react';
import Body from '../components/Medoosa/Body';

const modSelections = [
  {
    name: 'color',
    value: 0
  },
  {
    name: 'eyes',
    value: 0
  },
  {
    name: 'mouth',
    value: 0
  },
  {
    name: 'arms',
    value: 0
  },
  {
    name: 'head',
    value: 0
  }
];

const MedoosaTest = () => {
  return (
    <div>
      <Body stage={5} modSelections={modSelections} />
    </div>
  );
};

export default MedoosaTest;
