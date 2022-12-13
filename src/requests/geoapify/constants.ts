export const GEOAPIFY_URL = "https://api.geoapify.com/v1";

const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;
export const KEY_PARAM = `apiKey=${GEOAPIFY_KEY}`;

export const GEOAPIFY_IPINFO = `${GEOAPIFY_URL}/ipinfo?${KEY_PARAM}`;

export enum GeoapifyAPI {
  SEARCH = "search",
  REVERSE = "reverse",
}
