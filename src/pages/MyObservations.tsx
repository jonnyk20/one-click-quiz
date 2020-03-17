import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { parseQueryString, isNilOrEmpty } from '../utils/utils';
import { FormattedQuiz } from '../utils/formatQuiz';
import { fetchTaxaAndBuildQuiz } from '../services/InaturalistService';
import Button from '../components/Button';

import './MyObservations.scss';
import ProgressBar from '../components/ProgressBar';
import { QUIZ_TAGS } from '../constants/quizProperties';
import ProjectInfo from '../components/ProjectInfo';
import MoreFeaturesCTA from '../components/MoreFeaturesCTA';

enum QuizBuildingState {
  INITIAL,
  BUILDING,
  COMPLETE,
  ERROR
}

const MyObservations = () => {
  const location = useLocation();
  const [userName, setUserName] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [quizBuildingState, setQuizBuildingState] = useState<QuizBuildingState>(
    QuizBuildingState.INITIAL
  );
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  const buildQuiz = async (userLogin: string) => {
    setUserName(userLogin);
    setQuizBuildingState(QuizBuildingState.BUILDING);
    const quiz: FormattedQuiz | null = await fetchTaxaAndBuildQuiz(
      null,
      [],
      userLogin,
      `My Observations - ${userLogin}`,
      [QUIZ_TAGS.MY_OBSERVATIONS]
    );
    if (quiz && quiz.questions.length > 0) {
      setQuiz(quiz);
      setQuizBuildingState(QuizBuildingState.COMPLETE);
    } else {
      setQuizBuildingState(QuizBuildingState.ERROR);
    }
  };

  const onSearch = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    buildQuiz(inputValue);
  };

  const params = parseQueryString(location.search);
  const { user } = params;

  useEffect(() => {
    if (user) {
      setUserName(user);
      buildQuiz(user);
    }
  }, [user]);

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const showQuizBuildingProgress =
    quizBuildingState === QuizBuildingState.BUILDING;
  const showQuizBuildingError = quizBuildingState === QuizBuildingState.ERROR;
  const showInput = !userName || showQuizBuildingError;

  return (
    <div className="my-observations container">
      <div>
        <h1>My Observations</h1>
        <h4>How well do you know the animals you've observed?</h4>
      </div>
      {showInput && (
        <form onSubmit={onSearch} className="my-observations__search mv-20">
          <input
            className="my-observations__search__input"
            placeholder="Your iNaturalist login..."
            value={inputValue}
            onChange={handleChange}
          />
          <Button onClick={onSearch}>Quiz Me</Button>
        </form>
      )}
      {showQuizBuildingProgress && (
        <div className="mv-10 my-observations__progress">
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {showQuizBuildingError && (
        <div>
          We can't find any wildlife observed by this user. <br />
          Please make sure the casing matches. If your login is 'myuser123',
          'Myuser123' will not work. <br />
          Also, please makse sure you have observations under this account.
        </div>
      )}
      {!isNilOrEmpty(quiz) && (
        <div>
          <div className="mv-20">
            <div className="text-large">
              <span className="text-light-color">
                <b>{userName}</b>
              </span>
              , your quiz is ready
            </div>
          </div>
          <div className="mv-20">
            Tip: answering faster gets you a higher score
          </div>
          <Link
            className="text-link"
            to={{
              pathname: '/taxa-quiz',
              state: { quiz, user: userName }
            }}
          >
            <Button onClick={() => {}}> Start</Button>
          </Link>
        </div>
      )}
      <MoreFeaturesCTA />
      <ProjectInfo />
    </div>
  );
};

export default MyObservations;
