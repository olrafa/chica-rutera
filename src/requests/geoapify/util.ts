import { GEOAPIFY_URL, GeoapifyAPI, KEY_PARAM } from './constants';

export const getFetcherUrl = (params: string, api: GeoapifyAPI): string =>
  `${GEOAPIFY_URL}/geocode/${api}/${params}&${KEY_PARAM}`;

export const createAddressParams = (
  address: string,
  lon?: number,
  lat?: number
): string => {
  const text = `?text=${address}`;
  const limit = "&limit=1";
  const bias =
    lat || lon ? `&bias=proximity:${lon},${lat}|countrycode:none` : "";

  return text + limit + bias;
};
