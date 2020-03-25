import React, { useState, useEffect } from 'react';
import { filter, Dictionary } from 'ramda';
import { useLocation, Redirect } from 'react-router-dom';

import {
  getSuggestedPlaces,
  SuggestedPlace,
  fetchTaxaAndBuildQuiz,
  getNearestPlace,
  TaxaQuizOptions
} from '../services/InaturalistService';
import {
  isNilOrEmpty,
  parseQueryString,
  encodeQueryString,
  isNotNilOrEmpty
} from '../utils/utils';
import { FormattedQuiz } from '../utils/formatQuiz';
import Button from '../components/Button';
import SelectionList from '../components/SelectionList/SelectionList';
import ProgressBar from '../components/ProgressBar';
import ProjectInfo from '../components/ProjectInfo';
import { QUIZ_TAGS } from '../constants/quizProperties';
import MoreFeaturesCTA from '../components/MoreFeaturesCTA';
import {
  taxaOptions,
  TaxaOptionsType
} from '../constants/taxaOptions/taxaOptions';

import TAXA from '../constants/taxaOptions/taxa';
import TaxaQuizInstructions from '../components/TaxaQuizInstructions/TaxaQuizInstructions';

import './TaxaChallenge.scss';

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

const BASE_CLASS = `taxa-challenge`;

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
  const [taxaOption, setTaxaOption] = useState<TaxaOptionsType | null>(null);

  const location = useLocation();
  const params = parseQueryString(location.search);
  const { user } = params;

  useEffect(() => {
    const buildQuiz = async () => {
      setQuizBuildingState(QuizBuildingState.BUILDING);
      const options: TaxaQuizOptions = {
        place,
        taxonIds: taxaOption?.include,
        name: `${taxaOption?.label} of ${place?.display_name}`,
        tags: [QUIZ_TAGS.TAXA_CHALLENGE]
      };

      if (isNilOrEmpty(taxaOption?.exclude)) {
        options.taxonIdsToExclude = taxaOption?.exclude;
      }

      const quiz: FormattedQuiz | null = await fetchTaxaAndBuildQuiz(options);

      if (quiz) {
        setQuiz(quiz);
        setQuizBuildingState(QuizBuildingState.COMPLETE);
      }
    };

    if ((isNotNilOrEmpty(place), isNotNilOrEmpty(taxaOption))) {
      buildQuiz();
    }
  }, [place, taxaOption]);

  if (isNotNilOrEmpty(user)) {
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
    if (isNotNilOrEmpty(places)) {
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

  const showLocationPrompt = locationState === LocationState.INITIAL;
  const showLocationProgress = locationState === LocationState.LOADING;
  const showQuizBuildingProgress =
    quizBuildingState === QuizBuildingState.BUILDING;
  const showQuizChoices =
    isNotNilOrEmpty(place) && quizBuildingState === QuizBuildingState.INITIAL;
  const isPlaceReady = isNotNilOrEmpty(place);

  const specicOptions: Dictionary<TaxaOptionsType> = filter(
    (tOption: TaxaOptionsType) => tOption.isSpecific || false,
    taxaOptions
  );

  const formattedSpecificOptions = Object.entries(
    specicOptions
  ).map(([key, option]) => ({ key, label: option.label }));

  const selectSpecificTaxa = (key: string) => {
    const taxa = key as TAXA;
    const option = taxaOptions[taxa];

    setTaxaOption(option);
  };

  return (
    <div className={`${BASE_CLASS} container`}>
      <div>
        <h3>Taxa Challenge</h3>
        <div>Test how well you know the plants and animals around you</div>
      </div>
      {!isPlaceReady && (
        <div className={`${BASE_CLASS}__search mv-20`}>
          <form
            onSubmit={onSearch}
            className={`${BASE_CLASS}__search__form mt-10`}
          >
            <input
              value={inputValue}
              onChange={handleChange}
              placeholder="Find a place"
              className={`${BASE_CLASS}__search__form__input`}
            />
            <Button onClick={onSearch}>Search</Button>
          </form>
          {isNotNilOrEmpty(suggestedPlaces) && (
            <div className={`${BASE_CLASS}__search__suggestions padding-10`}>
              {suggestedPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className={`${BASE_CLASS}__search__suggestions__suggestion`}
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
            <div className={`${BASE_CLASS}__search__location-prompt`}>
              <div className="mv-20 text-large">
                <b>- OR -</b>
              </div>
              <Button onClick={getLocation}>Use Your Location</Button>
            </div>
          )}
        </div>
      )}
      {showLocationProgress && (
        <div className={`${BASE_CLASS}__progress mv-10`}>
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
          <div className={`${BASE_CLASS}__quiz-choices mv-10`}>
            <div className={`${BASE_CLASS}__build__quiz-choice padding-5`}>
              <Button onClick={() => setTaxaOption(taxaOptions.animals)}>
                {taxaOptions.animals.label}
              </Button>
            </div>
            <div className={`${BASE_CLASS}__build__quiz-choice padding-5`}>
              <Button onClick={() => setTaxaOption(taxaOptions.plants)}>
                {taxaOptions.plants.label}
              </Button>
            </div>
            <div className={`${BASE_CLASS}__build__quiz-choice padding-5`}>
              <Button onClick={() => setTaxaOption(taxaOptions.fungi)}>
                {taxaOptions.fungi.label}
              </Button>
            </div>
          </div>
          <div className="mv-20 text-medium">
            You can also pick something more specific:
          </div>
          <div className="mv-20">
            <SelectionList
              options={formattedSpecificOptions}
              defaultText="e.g. Reptiles"
              onChange={selectSpecificTaxa}
            />
          </div>
        </>
      )}
      {showQuizBuildingProgress && (
        <div className={`${BASE_CLASS}__progress mv-10`}>
          <div className="mv-10">Building Quiz...</div>
          <ProgressBar progress={0} />
        </div>
      )}
      {isNotNilOrEmpty(quiz) && <TaxaQuizInstructions quiz={quiz!} />}
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
