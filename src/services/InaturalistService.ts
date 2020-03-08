import { isNilOrEmpty } from "../utils/utils";
import buildTaxaQuiz from "../utils/buildTaxaQuiz";
import { FormattedQuiz } from "../utils/formatQuiz";

const baseUrl = "https://api.inaturalist.org/v1";

export type SuggestedPlace = {
  ancestor_place_ids: number;
  bbox_area: number;
  name: string;
  location: string;
  id: number;
  display_name: string;
};

export type SuggestedPlacesResponse = {
  total_results: number;
  page: number;
  per_page: number;
  results: SuggestedPlace[];
};

const getQueryString = (params: any) => {
  const keys: string[] = Object.keys(params);

  if (!isNilOrEmpty(keys)) {
    var esc = encodeURIComponent;
    const paramsString = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");
    return `?${paramsString}`;
  }

  return "";
};

type NearestPlacesResults = {
  results: {
    standard: SuggestedPlace[];
  };
};

export const getNearestPlace = async (
  lat: number,
  lng: number
): Promise<SuggestedPlace> => {
  const params = {
    nelat: lat.toFixed(3),
    nelng: lng.toFixed(3),
    swlat: lat.toFixed(3),
    swlng: lng.toFixed(3)
  };

  const querystring = getQueryString(params);

  const res = await fetch(`${baseUrl}/places/nearby/${querystring}`);
  const results: NearestPlacesResults = await res.json();

  const places = results.results.standard;

  const nearestPlace = places[places.length - 1];

  console.log("places", places);
  console.log("nearestPlace", nearestPlace);

  return nearestPlace;
};

export const getSuggestedPlaces = async (
  query: string
): Promise<SuggestedPlace[]> => {
  const querystring = getQueryString({ q: query });

  const res: Response = await fetch(
    `${baseUrl}/places/autocomplete/${querystring}`
  );

  const results: SuggestedPlacesResponse = await res.json();

  return results.results;
};

export const fetchSpeciesData = async (
  place: SuggestedPlace | null,
  kingdomIds: number[]
): Promise<FormattedQuiz> => {
  const params = {
    place_id: place?.id,
    taxon_id: kingdomIds.join(",")
  };
  const querystring = getQueryString(params);
  const res: Response = await fetch(
    `${baseUrl}/observations/species_counts${querystring}`
  );

  const taxa = await res.json();
  const top40 = taxa.results.slice(0, 40);
  const quiz = buildTaxaQuiz(top40);
  console.log("QUIZ", quiz);

  return quiz;
};
