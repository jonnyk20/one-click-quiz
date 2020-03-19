import React, { useState } from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import {
  getSuggestedPlaces,
  SuggestedPlace,
  fetchTaxaAndBuildQuiz,
  getNearestPlace
} from '../services/InaturalistService';
import {
  isNilOrEmpty,
  parseQueryString,
  encodeQueryString
} from '../utils/utils';
import { FormattedQuiz } from '../utils/formatQuiz';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import ProjectInfo from '../components/ProjectInfo';
import { QUIZ_TAGS } from '../constants/quizProperties';
import MoreFeaturesCTA from '../components/MoreFeaturesCTA';

import './TaxaChallenge.scss';

enum KINGDOMS {
  ANIMAL,
  FUNGI,
  PLANTS
}

const taxonIDs = {
  [KINGDOMS.ANIMAL]: 1,
  [KINGDOMS.FUNGI]: 47170,
  [KINGDOMS.PLANTS]: 47126
};

const taxonNames = {
  [KINGDOMS.ANIMAL]: 'Animals',
  [KINGDOMS.FUNGI]: 'Fungi',
  [KINGDOMS.PLANTS]: 'Plants'
};

enum LocationState {
  INITIAL,
  LOADING,
  LOADED
}

enum QuizBuildingState {
  INITIAL,
  BUILDING,
  COMPLETE
}

const TaxaChallenge = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestedPlaces, setSuggestedPlaces] = useState<SuggestedPlace[]>([]);
  const [noPlacesFound, setNoPlacesFound] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [place, setPlace] = useState<SuggestedPlace | null>(null);
  const [locationState, setLocationState] = useState<LocationState>(
    LocationState.INITIAL
  );
  const [quizBuildingState, setQuizBuildingState] = useState<QuizBuildingState>(
    QuizBuildingState.INITIAL
  );
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);
  const location = useLocation();
  const params = parseQueryString(location.search);
  const { user } = params;

  if (!isNilOrEmpty(user)) {
    return (
      <Redirect
        to={{
          pathname: '/my-observations',
          search: encodeQueryString({ user })
        }}
      />
    );
  }

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const clearResuts = () => {
    setSuggestedPlaces([]);
    setInputValue('');
  };

  const onSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setSearchedValue(inputValue);
    const places: SuggestedPlace[] = await getSuggestedPlaces(inputValue);
    if (!isNilOrEmpty(places)) {
      setSuggestedPlaces(places);
      setNoPlacesFound(false);
    } else {
      setNoPlacesFound(true);
    }
  };

  const onSelectPlace = (place: SuggestedPlace) => {
    clearResuts();
    setPlace(place);
  };

  const getLocation = async () => {
    setLocationState(LocationState.LOADING);
    window.navigator.geolocation.getCurrentPosition(
      async (position: Position) => {
        const { latitude, longitude } = position.coords;
        clearResuts();
        setLocationState(LocationState.LOADED);
        const place = await getNearestPlace(latitude, longitude);
        setPlace(place);
      }
    );
  };

  const buildQuiz = async (kingdom: KINGDOMS) => {
    setQuizBuildingState(QuizBuildingState.BUILDING);
    const kingdomIds: number[] = [taxonIDs[kingdom]];
    const quiz: FormattedQuiz | null = await fetchTaxaAndBuildQuiz(
      place,
      kingdomIds,
      '',
      `${taxonNames[kingdom]} of ${place?.display_name}`,
      [QUIZ_TAGS.TAXA_CHALLENGE]
    );

    if (quiz) {
      setQuiz(quiz);
      setQuizBuildingState(QuizBuildingState.COMPLETE);
    }
  };

  const showLocationPrompt = locationState === LocationState.INITIAL;
  const showLocationProgress = locationState === LocationState.LOADING;
  const showQuizBuildingProgress =
    quizBuildingState === QuizBuildingState.BUILDING;
  const showQuizChoices =
    !isNilOrEmpty(place) && quizBuildingState === QuizBuildingState.INITIAL;
  const isPlaceReady = !isNilOrEmpty(place);

  return (
    <div className="taxa-challange container">
      <div>
        <h3>Taxa Challenge</h3>
        <div>Test how well you know the plants and animals around you</div>
      </div>
      {!isPlaceReady && (
        <div className="taxa-challange__search mv-20">
          <form
            onSubmit={onSearch}
            className="taxa-challange__search__form mt-10"
          >
            <input
              value={inputValue}
              onChange={handleChange}
              placeholder="Find a place"
              className="taxa-challange__search__form__input"
            />
            <Button onClick={onSearch}>Search</Button>
          </form>
          {!isNilOrEmpty(suggestedPlaces) && (
            <div className="taxa-challange__search__suggestions padding-10">
              {suggestedPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className="taxa-challange__search__suggestions__suggestion"
                >
                  {place.display_name}
                </div>
              ))}
              {noPlacesFound && (
                <div>{`No Places Found for "${searchedValue}"`}</div>
              )}
            </div>
          )}
          {showLocationPrompt && (
            <div className="taxa-challange__search__location-prompt">
              <div className="mv-20 text-large">
                <b>- OR -</b>
              </div>
              <Button onClick={getLocation}>Use Your Location</Button>
            </div>
          )}
        </div>
      )}
      {showLocationProgress && (
        <div className="taxa-challange__progress mv-10">
          <div className="mv-10">Getting Location...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {showQuizChoices && (
        <>
          <div className="mv-20">
            What do you know best around{' '}
            <span>
              <b>{place?.display_name}</b>
            </span>
            ?
          </div>
          <div className="taxa-challange__quiz-choices mv-10">
            <div className="taxa-challange__build__quiz-choice padding-5">
              <Button onClick={() => buildQuiz(KINGDOMS.ANIMAL)}>
                Animals
              </Button>
            </div>
            <div className="taxa-challange__build__quiz-choice padding-5">
              <Button onClick={() => buildQuiz(KINGDOMS.PLANTS)}>Plants</Button>
            </div>
            <div className="taxa-challange__build__quiz-choice padding-5">
              <Button onClick={() => buildQuiz(KINGDOMS.FUNGI)}>Fungi</Button>
            </div>
          </div>
        </>
      )}
      {showQuizBuildingProgress && (
        <div className="taxa-challange__progress mv-10">
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {!isNilOrEmpty(quiz) && (
        <>
          <h3 className="text-medium text-light-color">Your Quiz is Ready</h3>

          <div className="mv-20 text-medium">
            <b>Tips</b>
          </div>

          <ul className="marine-life-quiz__tips mv-20">
            <li className="marine-life-quiz__tips__tip">
              Answering faster gets you a higher score
            </li>
            <li className="marine-life-quiz__tips__tip">
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
        </>
      )}
      {!isPlaceReady && (
        <>
          <MoreFeaturesCTA />
          <ProjectInfo />
        </>
      )}
    </div>
  );
};

export default TaxaChallenge;
