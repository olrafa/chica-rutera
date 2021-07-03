import { geoApifyUrl } from './apiUrls';

export const reverseGeocode = ([lon, lat]: any) => {
  const geocodeUrl = geoApifyUrl + 'geocode/reverse';
  const point = `?lat=${lat}&lon=${lon}`;
  const gaKey = process.env.REACT_APP_GEOAPIFY_KEY as string;
  const keyParam = `&api_key=${gaKey}`;

  const url = geocodeUrl + point + keyParam;

  fetch(url)
    .then((r) => r.json())
    .then((r) => {
      const [address] = r.features;
      return address;
    });
};
