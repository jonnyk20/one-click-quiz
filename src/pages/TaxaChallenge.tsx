import React, { useState } from "react";
import {
  getSuggestedPlaces,
  SuggestedPlace,
  fetchSpeciesData,
  getNearestPlace
} from "../services/InaturalistService";
import { isNilOrEmpty } from "../utils/utils";
import Button from "../components/Button";

import "./TaxaChallenge.scss";
import { Link } from "react-router-dom";
import { FormattedQuiz } from "../utils/formatQuiz";

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

const TaxaChallenge = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestedPlaces, setSuggestedPlaces] = useState<SuggestedPlace[]>([]);
  const [noPlacesFound, setNoPlacesFound] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [place, setPlace] = useState<SuggestedPlace | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const clearResuts = () => {
    setSuggestedPlaces([]);
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
    setIsLocationLoading(true);
    window.navigator.geolocation.getCurrentPosition(
      async (position: Position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        clearResuts();
        setIsLocationLoading(false);
        const place = await getNearestPlace(latitude, longitude);
      }
    );
  };

  const buildQuiz = async (kingdom: KINGDOMS) => {
    const kingdomIds: number[] = [taxonIDs[kingdom]];
    const quiz: FormattedQuiz = await fetchSpeciesData(place, kingdomIds);
    setQuiz(quiz);
  };

  return (
    <div className="taxa-challange">
      <div>
        <h3>Taxa Challenge</h3>
        {!isNilOrEmpty(place) && <h6>For {place?.display_name}</h6>}
        <div>Test how well you know the wildlife around you</div>
      </div>
      <div className="taxa-challange__search">
        <form onSubmit={onSearch} className="taxa-challange__search__form">
          <input
            value={inputValue}
            onChange={handleChange}
            placeholder="Find a place"
          />
          <Button onClick={onSearch}>Search</Button>
        </form>

        <div className="taxa-challange__search__suggestions">
          {suggestedPlaces.map(place => (
            <div key={place.id} onClick={() => onSelectPlace(place)}>
              {place.display_name}
            </div>
          ))}
          {noPlacesFound && (
            <div>{`No Places Found for "${searchedValue}"`}</div>
          )}
        </div>
        {isNilOrEmpty(place) && (
          <div
            className="taxa-challange__search__location-prompt"
            onClick={getLocation}
          >
            Use Your Location
          </div>
        )}
      </div>
      {!isNilOrEmpty(place) && (
        <div className="taxa-challange__build">
          <div className="full-row">
            What kinds of wildlife do you know best around {place?.display_name}
            ?
          </div>
          <div className="padding-5" onClick={() => buildQuiz(KINGDOMS.ANIMAL)}>
            Animal
          </div>
          <div className="padding-5" onClick={() => buildQuiz(KINGDOMS.PLANTS)}>
            Plants
          </div>
          <div className="padding-5" onClick={() => buildQuiz(KINGDOMS.FUNGI)}>
            Fungi
          </div>
          <div className="full-row">
            {!isNilOrEmpty(quiz) && (
              <Link to={{ pathname: "/quiz/taxa-challenge", state: { quiz } }}>
                Start
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxaChallenge;
