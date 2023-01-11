import { GEOAPIFY_URL, GeoapifyAPI, KEY_PARAM } from "./constants";
import { AddressSearchParams } from "./types";

export const getFetcherUrl = (params: string, api: GeoapifyAPI): string =>
  `${GEOAPIFY_URL}/geocode/${api}/${params}&${KEY_PARAM}`;

/** Create the URL params to form the address search request
 */
export const createAddressParams = ({
  address,
  lon,
  lat,
}: AddressSearchParams): string => {
  const text = `?text=${address}`;
  const limit = "&limit=1";
  const bias =
    lat || lon ? `&bias=proximity:${lon},${lat}|countrycode:none` : "";

  return text + limit + bias;
};

export const secondsToHours = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hDisplay = h ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m ? m + (m === 1 ? " minute, " : " minutes ") : "";
  return hDisplay + mDisplay;
};
