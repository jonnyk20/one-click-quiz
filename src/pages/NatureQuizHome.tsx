import React from 'react';
import './NatureQuizHome.scss';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NatrueQuizHome = () => (
  <div className="nature-quiz-home container">
    <div className="mv-50">
      <div>How well do you know your local plans and animals?</div>
      <div>Test yourself and compare your score with others</div>
      <Link
        to="/taxa-challenge"
        className="text-medium text-light-color mv-20 flex"
      >
        <Button onClick={() => {}}>Taxa Challenge</Button>
      </Link>
      <div className="mv-20 text-medium">
        <div>There's also a quiz available for Marine Life in B.C.</div>
        <Button onClick={() => {}}>B.C Marine Life</Button>
      </div>
      <div className="mv-20 text-medium">
        <div>
          Are you an{' '}
          <a href="https://www.inaturalist.org/" className="text-white">
            iNaturalist
          </a>
          &nbsp;user?
        </div>
      </div>
      <Link to="/my-observations" className="text-medium text-light-color flex">
        Quiz yourself on the animals you've found!
      </Link>
    </div>
  </div>
);

export default NatrueQuizHome;
