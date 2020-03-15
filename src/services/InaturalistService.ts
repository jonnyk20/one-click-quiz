import { isNilOrEmpty, encodeQueryString } from "../utils/utils";
import buildTaxaQuiz from "../utils/buildTaxaQuiz";
import { FormattedQuiz } from "../utils/formatQuiz";
import { QUIZ_TAGS } from "../constants/quizProperties";

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

  const querystring = encodeQueryString(params);

  const res = await fetch(`${baseUrl}/places/nearby/${querystring}`);
  const results: NearestPlacesResults = await res.json();

  const places = results.results.standard;

  const nearestPlace = places[places.length - 1];

  return nearestPlace;
};

export const getSuggestedPlaces = async (
  query: string
): Promise<SuggestedPlace[]> => {
  const querystring = encodeQueryString({ q: query });

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
  native?: boolean;
  quality_grade?: "research";
  project_id?: string;
};

export const fetchTaxaAndBuildQuiz = async (
  place: SuggestedPlace | null,
  kingdomIds: number[],
  user: string,
  quizName: string,
  quizTags?: QUIZ_TAGS[],
  projectId?: string
): Promise<FormattedQuiz | null> => {
  try {
    const params: iNatParams = {};
    if (place?.id) {
      params.place_id = place.id;
      params.native = true;
      params.quality_grade = "research";
    }

    if (!isNilOrEmpty(kingdomIds)) {
      params.taxon_id = kingdomIds.join(",");
    }

    if (user) {
      params.user_login = user;
    } 

    if (projectId) {
      params.project_id = projectId;
    }

    const querystring = encodeQueryString(params);
    const res: Response = await fetch(
      `${baseUrl}/observations/species_counts${querystring}`
    );

    const taxa = await res.json();
    const quiz = buildTaxaQuiz(taxa.results, quizName, quizTags);

    return quiz;
  } catch (err) {
    return null;
  }
};
