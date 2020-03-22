import React from 'react';

import SelectionList, {
  SelectionOptionValueType,
  SelecitonlistOptionType
} from '../components/SelectionList/SelectionList';

const options: SelecitonlistOptionType[] = [];

const Sandbox = () => {
  const onChange = (value: SelectionOptionValueType) => {
    console.log('Selected', value);
  };

  return (
    <div className="sandbox container">
      <SelectionList
        options={options}
        defaultText="e.g. cats"
        onChange={onChange}
      />
    </div>
  );
};

export default Sandbox;
