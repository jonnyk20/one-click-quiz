import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { update } from 'ramda';
import ChipInput from 'material-ui-chip-input';

import { sampleSentenceQuiz } from '../utils/sampleQuiz';
import { FormattedChoice, FormattedQuiz } from '../utils/formatQuiz';
import { hideWordInSentence } from '../utils/utils';
import Button from '../components/Button';
import TextAreaWithChips from '../components/ChipsInput/ChipsInput';

import './Sandbox.scss';

const getChoicesFromQuestion = (quiz: FormattedQuiz): FormattedChoice[] =>
  quiz.questions.reduce(
    (acc: FormattedChoice[], q) => [...acc, ...q.choices],
    []
  );

const choices = getChoicesFromQuestion(sampleSentenceQuiz);

type ClozeType = {
  word: string;
  sentence: string;
};

const BASE_CLASS = 'sandbox';

const Sandbox = () => {
  return (
    <div className={`${BASE_CLASS} container`}>
      <div style={{ background: 'white' }}>
        <TextAreaWithChips />
      </div>
    </div>
  );
};

export default Sandbox;
