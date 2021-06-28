import { orsUrl } from './orsUrl';

export const addressSearch = async (address: string) => {

  const searchUrl = orsUrl + 'geocode/search';
  const credentials = '?api_key=' + process.env.REACT_APP_ORS_KEY as string;
  const text = '&text=' + address;

  const fetchUrl = searchUrl + credentials + text;

  const orsAddresses = await fetch(fetchUrl);
  const addressResults = await orsAddresses.json();
  return addressResults.features;
};
