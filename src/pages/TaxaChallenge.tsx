import React, { useState } from "react";
import {
  getSuggestedPlaces,
  SuggestedPlace,
  fetchSpeciesData
} from "../services/InaturalistService";
import { isNilOrEmpty } from "../utils/utils";
import Button from "../components/Button";

import "./TaxaChallenge.scss";
import { Link } from "react-router-dom";
import { FormattedQuiz } from "../utils/formatQuiz";

const TaxaChallenge = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestedPlaces, setSuggestedPlaces] = useState<SuggestedPlace[]>([]);
  const [noPlacesFound, setNoPlacesFound] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [placeId, setPlaceId] = useState<number>(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
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

  const onSelectPlace = (id: number) => {
    setPlaceId(id);
  };

  const getLocation = () => {
    setIsLocationLoading(true);
    window.navigator.geolocation.getCurrentPosition((position: Position) => {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
      setIsLocationLoading(false);
    });
  };

  const buildQuiz = async () => {
    const quiz: FormattedQuiz = await fetchSpeciesData(placeId);
    setQuiz(quiz);
  };

  return (
    <div className="taxa-challange">
      <div>
        <h3>Taxa Challenge</h3>
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
            <div key={place.id} onClick={() => onSelectPlace(place.id)}>
              {place.display_name}
            </div>
          ))}
          {noPlacesFound && (
            <div>{`No Places Found for "${searchedValue}"`}</div>
          )}
        </div>
        <div
          className="taxa-challange__search__location-prompt"
          onClick={getLocation}
        >
          Use Your Location
        </div>
      </div>
      <div>{placeId !== 0 && <div onClick={buildQuiz}>Build Quiz</div>}</div>
      {!isNilOrEmpty(quiz) && (
        <Link to={{ pathname: "/quiz/taxa-challenge", state: { quiz } }}>
          Start
        </Link>
      )}
    </div>
  );
};

export default TaxaChallenge;
