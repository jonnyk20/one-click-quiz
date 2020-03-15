import { isNilOrEmpty, encodeQueryString } from "../utils/utils";
import buildTaxaQuiz, { Taxon } from "../utils/buildTaxaQuiz";
import { FormattedQuiz } from "../utils/formatQuiz";
import { QUIZ_TAGS } from "../constants/quizProperties";
import { range } from "ramda";

const baseUrl = "https://api.inaturalist.org/v1";
const TAXON_FETCH_LIMIT = 2500;
const TAXA_PER_REQUEST = 500;

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
  page?: number;
};

type SpeciesCountResonse  = {
  total_results: number;
  page: number;
  per_page: number;
  results: Taxon[]
}

const fetchTaxa = async (params: iNatParams): Promise<SpeciesCountResonse> => {
  const querystring = encodeQueryString(params);
  const response: Response = await fetch(
    `${baseUrl}/observations/species_counts${querystring}`
  );
  const json: SpeciesCountResonse = await response.json();
  
  return json;

}

const fetchPaginatedTaxa = async (params: iNatParams): Promise<Taxon[]> => {
  const firsResponse = await fetchTaxa(params);

  const taxa = firsResponse.results;

  const availableTaxaCount = firsResponse.total_results;
  const fetchedTaxaCount = taxa.length;
  const remaingTaxaCount = availableTaxaCount - fetchedTaxaCount;
  const remainingTaxaToFetch = Math.min(TAXON_FETCH_LIMIT, remaingTaxaCount);

  const remainingRequests = Math.ceil(remainingTaxaToFetch / TAXA_PER_REQUEST);

  const remainingResults = await Promise.all(range(2, remainingRequests + 2).map(
    page => fetchTaxa({ ...params, page })
  ))

  const remainingTaxa = remainingResults.map(r => r.results).flat();

  return [...taxa, ...remainingTaxa]
}

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

    const taxa = await fetchPaginatedTaxa(params);

    const quiz = buildTaxaQuiz(taxa, quizName, quizTags);

    return quiz;
  } catch (err) {
    return null;
  }
};
