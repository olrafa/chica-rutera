import { Coordinate } from "ol/coordinate";

import { GeoapifyAPI } from "./constants";
import { AddressResult, AddressSearchParams } from "./types";
import { createAddressParams, getFetcherUrl } from "./util";

/**
 * Send the request to search for an address.
 */
export const addressSearch = async (
  params: AddressSearchParams
): Promise<AddressResult | undefined> => {
  const addressParams = createAddressParams(params);
  const url = getFetcherUrl(addressParams, GeoapifyAPI.SEARCH);
  return await geoApifyFetcher(url);
};

export const reverseGeocode = async ([lon, lat]: Coordinate): Promise<
  AddressResult | undefined
> => {
  const point = `?lat=${lat}&lon=${lon}`;
  const url = getFetcherUrl(point, GeoapifyAPI.REVERSE);
  return await geoApifyFetcher(url);
};

/**
 * Given a text query, search for the address in Geoapify.
 * @param url the address, plus bias from location.
 * @returns only the first result.
 */
export const geoApifyFetcher = async (
  url: string
): Promise<AddressResult | undefined> => {
  const data = await fetch(url, { method: "GET" });
  const response = await data.json();
  const [address] = response.features;
  return address?.properties || undefined;
};
