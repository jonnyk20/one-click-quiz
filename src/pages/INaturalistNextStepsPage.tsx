import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { encodeQueryString, isNilOrEmpty } from '../utils/utils';
import ProjectInfo from '../components/ProjectInfo';

interface State {
  isMyObservationQuiz: boolean;
  isTaxaChallengeQuiz: boolean;
  user: string;
}

type Location = {
  state: State;
};

const INaturalistNextStepsPage = () => {
  const location: Location = useLocation();

  const { isMyObservationQuiz, user, isTaxaChallengeQuiz } = location.state;

  return (
    <>
      {isMyObservationQuiz && !isNilOrEmpty(user) && (
        <div className="mv-50">
          <Link
            className="text-medium text-underline mb-10 mt-20 text-white text-underline flex"
            to={{
              pathname: '/my-observations',
              search: encodeQueryString({ user })
            }}
          >
            Try again with more of your observations
          </Link>
          <div className="mt-5 text-medium">-OR-</div>

          <Link
            className="text-medium text-underline mv-5 text-white text-underline flex"
            to="/taxa-challenge"
          >
            Test how well you know your local wildlife
          </Link>
        </div>
      )}

      {isTaxaChallengeQuiz && (
        <div className="mv-50">
          <Link
            to="/taxa-challenge"
            className="text-medium text-white mv-20 flex"
          >
            Try again and we'll show you different animals!
          </Link>
          <div className="mv-20 text-medium">OR</div>
          <div className="mv-20 text-medium">
            <div>
              Are you an{' '}
              <a href="https://www.inaturalist.org/" className="text-white">
                iNaturalist
              </a>
              &nbsp;user?
            </div>
          </div>
          <Link to="/my-observations" className="text-medium text-white flex">
            Quiz yourself on the animals you've found!
          </Link>
        </div>
      )}
      <ProjectInfo />
    </>
  );
};

export default INaturalistNextStepsPage;
