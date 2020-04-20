import React, { useState, ChangeEvent } from 'react';

import TextField from '@material-ui/core/TextField';
import { Chip } from '@material-ui/core';
import pink from '@material-ui/core/colors/pink';
import { isNotNilOrEmpty } from '../../utils/utils';
import { isEmpty, isNil } from 'ramda';
import keycodes from '../../constants/keycodes';

import './ChipsInput.scss';

const BASE_CLASS = 'chips-input';

type ChipsRendererPropsType = {
  text: string;
  isFocused: boolean;
  handleClick: () => void;
  handleDelete: () => void;
  className?: string;
};

const chipRenderer = (
  {
    text,
    isFocused,
    handleClick,
    handleDelete,
    className,
  }: ChipsRendererPropsType,
  key: number
) => (
  <Chip
    key={key}
    className={`${BASE_CLASS}__chips__chip`}
    style={{
      backgroundColor: isFocused ? pink[300] : undefined,
    }}
    onClick={handleClick}
    onDelete={handleDelete}
    label={text}
  />
);

const ChipsInput = () => {
  const [chips, setChips] = useState<Set<string>>(
    new Set(['one', 'two', 'three'])
  );
  const [focusedChip, setFocusedChip] = useState<number>(3);
  const [inputValue, setInputValue] = useState<string>('');
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const handleDeleteChip = (text: string, i: number) => {
    const newChipsSet = new Set(chips);
    newChipsSet.delete(text);
    setChips(newChipsSet);
  };

  const setDeleteModeOrDelete = () => {
    if (!isDeleteMode) {
      const lastChipIndex = chips.size - 1;
      setIsDeleteMode(true);
      setFocusedChip(lastChipIndex);
      return;
    }

    const lastItem = Array.from(chips).pop();
    if (!isNil(lastItem)) {
      const newChipsSet = new Set(chips);
      newChipsSet.delete(lastItem);
      setChips(newChipsSet);
    }

    setIsDeleteMode(false);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const element = event.target as HTMLInputElement;
    const { value } = element;
    const regex = /; |;|, |,|\n/;
    const containsSeparator = regex.test(value);

    if (isEmpty(value)) {
      setDeleteModeOrDelete();
      return;
    }

    if (containsSeparator) {
      const newItems = value.trim().split(regex);
      const newChipsSet = new Set(chips);
      newItems.forEach((item) => {
        if (isNotNilOrEmpty(item)) {
          newChipsSet.add(item);
        }
      });

      setChips(newChipsSet);
      setInputValue('');

      return;
    }

    setInputValue(element.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEmpty(inputValue) && event.keyCode === keycodes.BACKSPACE) {
      setDeleteModeOrDelete();
    }
  };

  const chipComponents = Array.from(chips).map((text, i) => {
    return chipRenderer(
      {
        text,
        isFocused: focusedChip === i && isDeleteMode,
        handleClick: () => setFocusedChip(i),
        handleDelete: () => handleDeleteChip(text, i),
        className: 'text',
      },
      i
    );
  });

  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}__chips`}>{chipComponents}</div>
      <TextField
        id="standard-textarea"
        multiline
        className="{classes.textField}"
        margin="normal"
        value={inputValue}
        fullWidth
        onChange={handleChange}
        placeholder="Enter words here, separated by new lines or commas, then press enter"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChipsInput;
