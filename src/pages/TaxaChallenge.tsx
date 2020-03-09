import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  getSuggestedPlaces,
  SuggestedPlace,
  fetchSpeciesData,
  getNearestPlace
} from "../services/InaturalistService";
import { isNilOrEmpty } from "../utils/utils";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

import { FormattedQuiz } from "../utils/formatQuiz";

import "./TaxaChallenge.scss";

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
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestedPlaces, setSuggestedPlaces] = useState<SuggestedPlace[]>([]);
  const [noPlacesFound, setNoPlacesFound] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [place, setPlace] = useState<SuggestedPlace | null>(null);
  const [locationState, setLocationState] = useState<LocationState>(
    LocationState.INITIAL
  );
  const [quizBuildingState, setQuizBuildingState] = useState<QuizBuildingState>(
    QuizBuildingState.INITIAL
  );
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const clearResuts = () => {
    setSuggestedPlaces([]);
    setInputValue("");
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
    const quiz: FormattedQuiz | null = await fetchSpeciesData(
      place,
      kingdomIds,
      "",
      "Taxa Challange"
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
        <div>Test how well you know the wildlife around you</div>
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
              <div className="mv-20"> - Or - </div>
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
            What kinds of wildlife do you know best around{" "}
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
        <div>
          <div className="mv-20">
            <b>Start the Quiz!</b> - Tip: answering faster gets you a higher
            score
          </div>
          <Link to={{ pathname: "/quiz/taxa-challenge", state: { quiz } }}>
            <Button onClick={() => {}}> Start</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TaxaChallenge;
