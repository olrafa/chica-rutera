import { GEOAPIFY_IP_INFO } from './constants';

const requestOptions = { method: "GET" };

// Not really all there is to it but what we're using so far
type IpInfoResponse = {
  location: {
    latitude: number;
    longitude: number;
  };
};

/**
 * Gets the user's IP info to zoom the map to their area when opening the app.
 * @returns the result of the query
 */
export const getIpInfo = async (): Promise<IpInfoResponse> => {
  const data = await fetch(GEOAPIFY_IP_INFO, requestOptions);
  const response = await data.json();
  return response;
};

/**
 * Given a text query, search for the address in Geoapify.
 * @param url the address, plus bias from location.
 * @returns only the first result.
 */
export const geoApifyFetcher = async (url: string) => {
  const data = await fetch(url, requestOptions);
  const response = await data.json();
  const [address] = response.features;
  return address.properties;
};
