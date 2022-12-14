import { GeoapifyAPI } from "./constants";
import { geoApifyFetcher } from "./output";
import { createAddressParams, getFetcherUrl } from "./util";

export const addressSearch = async (
  address: string,
  lon?: number,
  lat?: number
) => {
  const addressParams = createAddressParams(address, lon, lat);
  console.log(address);
  const url = getFetcherUrl(addressParams, GeoapifyAPI.SEARCH);
  return await geoApifyFetcher(url);
};

export const reverseGeocode = async ([lon, lat]: any) => {
  const point = `?lat=${lat}&lon=${lon}`;
  const url = getFetcherUrl(point, GeoapifyAPI.REVERSE);
  return await geoApifyFetcher(url);
};
