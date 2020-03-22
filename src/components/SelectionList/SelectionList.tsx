import React, { useState, ReactElement } from 'react';

import './SelectionList.scss';

export type SelectionOptionValueType = string | number;

const SelectionListItem: React.SFC<SelecitonlistOptionType> = ({
  key,
  label
}): ReactElement => (
  <option value={key} className="seleciton-list__item" key={key}>
    {label}
  </option>
);

export type SelecitonlistOptionType = {
  key: SelectionOptionValueType;
  label: string;
};

type SelectionListPropsType = {
  options: SelecitonlistOptionType[];
  defaultText: string;
  onChange: (option: string) => void;
};

const SelectionList: React.SFC<SelectionListPropsType> = ({
  options,
  defaultText,
  onChange
}): ReactElement => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.FormEvent) => {
    const target = e.target as HTMLSelectElement;
    const { value } = target;
    setValue(target.value);
    onChange(value);
  };

  return (
    <select className="selection-list" value={value} onChange={handleChange}>
      <option value="" disabled>
        {defaultText}
      </option>
      {options.map(SelectionListItem)}
    </select>
  );
};

export default SelectionList;
