import { GEOAPIFY_IPINFO } from "./constants";

const requestOptions = { method: "GET" };

export const getIpInfo = async () => {
  const data = await fetch(GEOAPIFY_IPINFO, requestOptions);
  const response = await data.json();
  return response;
};

export const geoApifyFetcher = async (url: string) => {
  const data = await fetch(url, requestOptions);
  const response = await data.json();
  const [address] = response.features;
  return address.properties;
};
