import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { FormattedQuiz } from '../../utils/formatQuiz';

import './TaxaQuizInstructions.scss';

type PropsType = {
  quiz: FormattedQuiz;
};

const BASE_CLASS = 'taxa-quiz-instructions';

const TaxaQuizInstructions: React.SFC<PropsType> = ({ quiz }) => (
  <div className={BASE_CLASS}>
    <h3 className="text-medium text-light-color">Your Quiz is Ready</h3>

    <div className="mv-20 text-medium">
      <b>Tips</b>
    </div>

    <ul className={`${BASE_CLASS}__tips mv-20`}>
      <li className={`${BASE_CLASS}__tips__tip`}>
        Answering faster gets you a higher score
      </li>
      <li className={`${BASE_CLASS}__tips__tip`}>
        You can click&nbsp;
        <span className="text-light-color">
          <FontAwesomeIcon icon={faSyncAlt} size="sm" />
        </span>
        &nbsp;to see different photos
      </li>
    </ul>
    <Link
      to={{ pathname: '/taxa-quiz', state: { quiz } }}
      className="text-link"
    >
      <Button onClick={() => {}}> Start</Button>
    </Link>
  </div>
);

export default TaxaQuizInstructions;
