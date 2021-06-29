// import { orsUrl } from './orsUrl';

export const addressSearch = async (address: string) => {
  // const searchUrl = orsUrl + 'geocode/search';
  // const credentials = '?api_key=' + process.env.REACT_APP_ORS_KEY as string;
  // const text = '&text=' + address;

  // const fetchUrl = searchUrl + credentials + text;

  const lang = navigator.language;

  const nominatinUrl = 'https://nominatim.openstreetmap.org/search/';
  const query = `?q=${address}`;
  const params = `&format=json&addressdetails=1&limit=5&countrycodes=&accept-language=${lang}`;

  const nomUrl = nominatinUrl + query + params;

  const orsAddresses = await fetch(nomUrl);
  const [addressResults] = await orsAddresses.json();
  return addressResults;
};
