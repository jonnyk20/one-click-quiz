import React from 'react';
import { colors } from './Medoosa/Body/Mods/colors';
import classNames from 'classnames';

import './ColorSelector.scss';

type PropTypes = {
  selectedColorIndex: number;
  selectColor: (index: number) => void;
};

const ColorSelector: React.SFC<PropTypes> = props => {
  const { selectedColorIndex, selectColor } = props;

  return (
    <div className="color-selector">
      {colors.map((color, i) => {
        const baseClass = 'color-selector__color';
        const isSelected = i === selectedColorIndex;

        const className = classNames(baseClass, {
          [`${baseClass}--selected`]: isSelected
        });

        return (
          <div
            className={className}
            style={{
              backgroundColor: color,
              borderColor: isSelected ? 'white' : color
            }}
            key={color}
            onClick={() => selectColor(i)}
          />
        );
      })}
    </div>
  );
};

export default ColorSelector;
