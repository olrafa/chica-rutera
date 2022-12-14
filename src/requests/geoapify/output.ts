/**
 * Given a text query, search for the address in Geoapify.
 * @param url the address, plus bias from location.
 * @returns only the first result.
 */
export const geoApifyFetcher = async (url: string) => {
  const data = await fetch(url, { method: "GET" });
  const response = await data.json();
  const [address] = response.features;
  return address.properties;
};
