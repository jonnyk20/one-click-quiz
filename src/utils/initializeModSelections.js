import { colors } from '../components/Medoosa/Body/Mods/colors';
import { getRandomIndex } from './utils';

const randomColor = getRandomIndex(colors.length);

const initializeModSelections = () => {
  return [
    {
      name: 'color',
      value: randomColor
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
  ];
};

export default initializeModSelections;
