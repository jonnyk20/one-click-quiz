import React, { useState, ReactElement, MouseEvent } from 'react';
import { getRandomIndex, replaceWordWithText } from '../../utils/utils';
import { SnippetType } from '../../utils/formatQuiz';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Sentence.scss';

type PropsType = {
  snippets: SnippetType[];
  word: string;
  isAnswered: boolean;
};

const BASE_CLASS = 'sentence';

const Sentence: React.SFC<PropsType> = ({
  snippets,
  word,
  isAnswered,
}): ReactElement => {
  const [snippetIndex, setSnippetIndex] = useState<number>(
    getRandomIndex(snippets.length)
  );

  const cycleSnippet = (event: MouseEvent) => {
    event.stopPropagation();

    const nextIndex = snippetIndex < snippets.length - 2 ? snippetIndex + 1 : 0;
    setSnippetIndex(nextIndex);
  };

  const rawSnippet = snippets[snippetIndex]?.snippet || '';

  const formattedSnippet = replaceWordWithText(word, rawSnippet);

  const text = isAnswered ? rawSnippet : formattedSnippet;

  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}__text`}>{text}</div>
      {isAnswered}
      {isAnswered && (
        <div className={`${BASE_CLASS}__link`}>
          <a
            href={snippets[snippetIndex]?.displayUrl || ''}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link text-small"
          >
            {snippets[snippetIndex]?.displayUrl || ''}
          </a>
        </div>
      )}
      <div className={`${BASE_CLASS}__cycle-button`} onClick={cycleSnippet}>
        Change Sentence&nbsp;
        <FontAwesomeIcon icon={faSyncAlt} size="1x" />
      </div>
    </div>
  );
};

export default Sentence;
