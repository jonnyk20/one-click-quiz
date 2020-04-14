import React, { useState, useRef, ReactElement } from 'react';
import Papa from 'papaparse';
import { update } from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { FormattedChoice, FormattedQuiz } from '../../utils/formatQuiz';
import { hideWordInSentence } from '../../utils/utils';
import Button, { ButtonSize } from '../../components/Button';

import './WordsExport.scss';

const getChoicesFromQuestion = (quiz: FormattedQuiz): FormattedChoice[] =>
  quiz.questions.reduce(
    (acc: FormattedChoice[], q) => [...acc, ...q.choices],
    []
  );

const BASE_CLASS = 'words-export';

type WordExportPropsType = {
  quiz: FormattedQuiz;
};

const WordsExport: React.SFC<WordExportPropsType> = ({
  quiz
}): ReactElement => {
  const choices = getChoicesFromQuestion(quiz);
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
      ),
      source: c.snippets![sentenceIndices[i]].displayUrl
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
    <div className={`${BASE_CLASS}`}>
      <div className={`${BASE_CLASS}__prompt`}>
        <div>Review and save your words</div>
        <Button onClick={saveCSV}>Save CSV</Button>
      </div>
      <div className={`${BASE_CLASS}__vocab-items`}>
        {choices.map((c, i) => (
          <div key={i} className={`${BASE_CLASS}__vocab-items__item`}>
            <div className="border-right padding-5 flex">{c.name}</div>
            <div className="border-right padding-5 flex">
              {hideWordInSentence(
                c.name,
                c.snippets![sentenceIndices[i]].snippet || ''
              )}
            </div>
            <div className="padding-5 flex fd-column jc-around">
              {c.snippets![sentenceIndices[i]].displayUrl}
              <Button onClick={() => cycleSentence(i)} size={ButtonSize.SMALL}>
                <FontAwesomeIcon icon={faSyncAlt} size="1x" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <a href="null" download="vocab.csv" ref={ref} style={{ display: 'none' }}>
        Download
      </a>
    </div>
  );
};

export default WordsExport;
