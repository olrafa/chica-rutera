import { GeoapifyAPI } from "./constants";
import { geoApifyFetcher } from "./output";
import { AddressSearchParams } from "./types";
import { createAddressParams, getFetcherUrl } from "./util";

/**
 * Send the request to search for an address.
 */
export const addressSearch = async (params: AddressSearchParams) => {
  const addressParams = createAddressParams(params);
  const url = getFetcherUrl(addressParams, GeoapifyAPI.SEARCH);
  return await geoApifyFetcher(url);
};

export const reverseGeocode = async ([lon, lat]: any) => {
  const point = `?lat=${lat}&lon=${lon}`;
  const url = getFetcherUrl(point, GeoapifyAPI.REVERSE);
  return await geoApifyFetcher(url);
};
