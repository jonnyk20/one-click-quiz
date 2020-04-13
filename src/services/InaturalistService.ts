import { encodeQueryString, shuffle, isNotNilOrEmpty } from '../utils/utils';
import buildTaxaQuiz, { Taxon } from '../utils/buildTaxaQuiz';
import { FormattedQuiz } from '../utils/formatQuiz';
import { QUIZ_TAGS } from '../constants/quizProperties';
import { range } from 'ramda';

const baseUrl = 'https://api.inaturalist.org/v1';
const TAXON_FETCH_LIMIT = 2500;
const TAXA_PER_REQUEST = 500;
const MINIMUM_TAXA_COUNT = 40;
export const DEFAULT_LOCATION_RADIUS = 50;
const DEFAULT_LOCATION_DIAMETER = 2 * DEFAULT_LOCATION_RADIUS;
const DEFAULT_LOCATION_SQUARE_AREA = Math.pow(DEFAULT_LOCATION_DIAMETER, 2);
const KM_TO_DEGREE_LENGTH_RATIO = 110;
const KM_SQUARED_TO_DEGREE_AREA_RATIO = Math.pow(KM_TO_DEGREE_LENGTH_RATIO, 2);

export type SuggestedPlace = {
  ancestor_place_ids: number;
  bbox_area: number;
  name: string;
  location: string;
  id: number;
  display_name: string;
};

export type INaturalistProjectType = {
  id: number;
  slug: string;
  icon: string;
  description: string;
  title: string;
};

export type SuggestedPlacesResponse = {
  total_results: number;
  page: number;
  per_page: number;
  results: SuggestedPlace[];
};

export type SuggestedProjectResponse = {
  total_results: number;
  page: number;
  per_page: number;
  results: INaturalistProjectType[];
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
    swlng: lng.toFixed(3),
  };

  const querystring = encodeQueryString(params);

  const res = await fetch(`${baseUrl}/places/nearby${querystring}`);
  const results: NearestPlacesResults = await res.json();

  const places = results.results.standard;

  const nearestPlace = places[places.length - 1];

  return nearestPlace;
};

type ObservationPhoto = {
  url: string;
};

type Observation = {
  id: number;
  photos: ObservationPhoto[];
  user: {
    login: string;
  };
};

type ObservationPhotosResponse = {
  results: Observation[];
};

export type FormattedObservationPhoto = {
  user: string;
  url: string;
};

export const getObservationPhotosForTaxon = async (
  taxonId: number
): Promise<any> => {
  const params = {
    per_page: 200,
    order_by: 'votes',
    quality_grade: 'research',
    taxon_id: taxonId,
  };

  const querystring = encodeQueryString(params);
  const res = await fetch(`${baseUrl}/observations${querystring}`);
  const json: ObservationPhotosResponse = await res.json();

  return json;
};

const combineObservationPhotosForTaxon = (
  response: ObservationPhotosResponse
): FormattedObservationPhoto[] => {
  return shuffle(
    response.results
      .map((o) =>
        o.photos
          .filter((p) => isNotNilOrEmpty(p.url))
          .map((p) => ({
            url: p.url.replace('square.', 'medium.'),
            user: o.user.login,
          }))
      )
      .flat()
  );
};

export const getObservationPhotosForTaxa = async (
  taxonIds: number[]
): Promise<FormattedObservationPhoto[][]> => {
  const observationsResponses: ObservationPhotosResponse[] = await Promise.all(
    taxonIds.map(getObservationPhotosForTaxon)
  );
  const photosForTaxa = observationsResponses.map(
    combineObservationPhotosForTaxon
  );

  return photosForTaxa;
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

export const getSuggestedProjects = async (
  query: string
): Promise<INaturalistProjectType[]> => {
  const querystring = encodeQueryString({ q: query });

  const res: Response = await fetch(
    `${baseUrl}/projects/autocomplete/${querystring}`
  );

  const results: SuggestedProjectResponse = await res.json();

  return results.results;
};

type SpeciesCountParams = {
  place_id?: number;
  taxon_id?: string;
  user_login?: string;
  quality_grade?: 'research';
  project_id?: string;
  page?: number;
  without_taxon_id?: string;
  lat?: number;
  lng?: number;
  radius?: number;
};

type SpeciesCountResonse = {
  total_results: number;
  page: number;
  per_page: number;
  results: Taxon[];
};

const fetchTaxa = async (
  params: SpeciesCountParams
): Promise<SpeciesCountResonse> => {
  const querystring = encodeQueryString(params);
  const response: Response = await fetch(
    `${baseUrl}/observations/species_counts${querystring}`
  );
  const json: SpeciesCountResonse = await response.json();

  return json;
};

const fetchPaginatedTaxa = async (
  params: SpeciesCountParams
): Promise<Taxon[]> => {
  const firsResponse = await fetchTaxa(params);

  const taxa = firsResponse.results;

  const availableTaxaCount = firsResponse.total_results;
  const fetchedTaxaCount = taxa.length;
  const remaingTaxaCount = availableTaxaCount - fetchedTaxaCount;
  const remainingTaxaToFetch = Math.min(TAXON_FETCH_LIMIT, remaingTaxaCount);

  const remainingRequests = Math.ceil(remainingTaxaToFetch / TAXA_PER_REQUEST);

  const remainingResults = await Promise.all(
    range(2, remainingRequests + 2).map((page) =>
      fetchTaxa({ ...params, page })
    )
  );

  const remainingTaxa = remainingResults.map((r) => r.results).flat();

  return [...taxa, ...remainingTaxa];
};

type Coordinates = {
  lat: number;
  lng: number;
};

const formatCoordinates = (place: SuggestedPlace): Coordinates => {
  const [lat, lng] = place.location.split(',').map(Number);
  return {
    lat,
    lng,
  };
};

export const getShouldUseCoordinates = (place: SuggestedPlace): Boolean => {
  const { bbox_area: degreeArea } = place;
  const shouldUseCoordinates =
    DEFAULT_LOCATION_SQUARE_AREA >=
    degreeArea * KM_SQUARED_TO_DEGREE_AREA_RATIO;
  return shouldUseCoordinates;
};

const fetchTaxaByPlace = async (
  name: string,
  tags: QUIZ_TAGS[] = [],
  params: SpeciesCountParams,
  place: SuggestedPlace,
  radius: number
): Promise<FormattedQuiz> => {
  const paramsWithPlaceId = { ...params, place_id: place.id };
  let taxa = await fetchPaginatedTaxa(paramsWithPlaceId);

  if (taxa.length < MINIMUM_TAXA_COUNT) {
    const coords = formatCoordinates(place);
    const paramsWithCoordinates = {
      ...params,
      ...coords,
      radius,
    };

    taxa = await fetchPaginatedTaxa(paramsWithCoordinates);
  }

  return buildTaxaQuiz({ taxa, name, tags });
};

export type TaxaQuizOptions = {
  name: string;
  place?: SuggestedPlace | null;
  taxonIds?: number[];
  taxonIdsToExclude?: number[];
  user?: string;
  tags?: QUIZ_TAGS[];
  projectId?: string;
  uniqueTaxonomyRank?: number;
  radius?: number;
};

export const fetchTaxaAndBuildQuiz = async ({
  place,
  taxonIds,
  user,
  name,
  tags,
  projectId,
  uniqueTaxonomyRank,
  taxonIdsToExclude,
  radius = DEFAULT_LOCATION_RADIUS,
}: TaxaQuizOptions): Promise<FormattedQuiz | null> => {
  try {
    const params: SpeciesCountParams = {
      quality_grade: 'research',
    };

    if (isNotNilOrEmpty(taxonIds)) {
      params.taxon_id = taxonIds!.join(',');
    }

    if (isNotNilOrEmpty(taxonIdsToExclude)) {
      params.without_taxon_id = taxonIdsToExclude!.join(',');
    }

    if (user) {
      params.user_login = user;
    }

    if (projectId) {
      params.project_id = projectId;
    }

    if (isNotNilOrEmpty(place)) {
      return fetchTaxaByPlace(name, tags, params, place!, radius);
    }

    const taxa = await fetchPaginatedTaxa(params);

    const quiz = buildTaxaQuiz({ taxa, name, tags, uniqueTaxonomyRank });

    return quiz;
  } catch (err) {
    return null;
  }
};
