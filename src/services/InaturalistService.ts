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

type iNatParams = {
  place_id?: number;
  taxon_id?: string;
  user_login?: string;
};

export const fetchSpeciesData = async (
  place: SuggestedPlace | null,
  kingdomIds: number[],
  user: string,
  quizName: string
): Promise<FormattedQuiz | null> => {
  try {
    const params: iNatParams = {};
    if (place?.id) {
      params.place_id = place.id;
    }

    if (!isNilOrEmpty(kingdomIds)) {
      params.taxon_id = kingdomIds.join(",");
    }

    if (user) {
      params.user_login = user;
    }
    const querystring = getQueryString(params);
    const res: Response = await fetch(
      `${baseUrl}/observations/species_counts${querystring}`
    );

    const taxa = await res.json();
    const quiz = buildTaxaQuiz(taxa.results, quizName);

    return quiz;
  } catch (err) {
    return null;
  }
};