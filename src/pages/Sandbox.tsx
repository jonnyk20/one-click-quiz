import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { update } from 'ramda';

import { sampleSentenceQuiz } from '../utils/sampleQuiz';
import { FormattedChoice, FormattedQuiz } from '../utils/formatQuiz';
import { hideWordInSentence } from '../utils/utils';

import './Sandbox.scss';
import Button from '../components/Button';

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
  const [sentenceIndices, setSenctenceIndices] = useState<number[]>(
    choices.map(() => 0)
  );
  const ref = useRef<HTMLAnchorElement>(null);

  const saveCSV = () => {
    const data = choices.map((c, i) => ({
      word: c.name,
      sentence: hideWordInSentence(
        c.name,
        c.snippets![sentenceIndices[i]].snippet || ''
      )
    }));
    var csv = Papa.unparse(data);

    var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = window.URL.createObjectURL(csvData);

    const a = ref.current;

    if (a?.href) {
      a.href = url;
      a.click();
    }
  };

  const cycleSentence = (i: number) => {
    const currentIndex = sentenceIndices[i];
    const maxIndex = (choices[i].snippets?.length || 1) - 1;

    const nextIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
    const updatedIndices = update(i, nextIndex, sentenceIndices);

    setSenctenceIndices(updatedIndices);
  };

  return (
    <div className={`${BASE_CLASS} container`}>
      <div className={`${BASE_CLASS}__vocab-items`}>
        {choices.map((c, i) => (
          <div key={i} className={`${BASE_CLASS}__vocab-items__item`}>
            <div className="border-right padding-5">{c.name}</div>
            <div className="border-right padding-5">
              {hideWordInSentence(
                c.name,
                c.snippets![sentenceIndices[i]].snippet || ''
              )}
            </div>
            <div onClick={() => cycleSentence(i)} className="padding-5">
              Change
            </div>
          </div>
        ))}
      </div>
      <Button onClick={saveCSV}>Build CSV</Button>
      <a href="null" download="vocab.csv" ref={ref} style={{ display: 'none' }}>
        Download
      </a>
    </div>
  );
};

export default Sandbox;
