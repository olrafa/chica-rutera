import { Coordinate } from "ol/coordinate";
import { toast, ToastContent } from "react-toastify";

import { GeoapifyAPI } from "./constants";
import { AddressResponse, AddressResult, AddressSearchParams } from "./types";
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
const geoApifyFetcher = async (
  url: string
): Promise<AddressResult | undefined> => {
  try {
    const data = await fetch(url, { method: "GET" });
    const response: AddressResponse = await data.json();
    const [address] = response.features;
    return address.properties;
  } catch (error) {
    toast.error(error as ToastContent<unknown>);
  }
};
