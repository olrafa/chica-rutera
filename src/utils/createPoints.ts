import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

const createPoint = (coordinate: Coordinate, formatted?: string) =>
  new Feature({
    type: 'geoMarker',
    geometry: new Point(coordinate),
    name: formatted,
  });

const getCoordinates = (lon: string, lat: string) => {
  const lonLat = [lon, lat].map((c) => parseFloat(c));
  return fromLonLat(lonLat) as Coordinate;
};

export const createRoutePoint = ({ formatted, lon, lat }: any) => {
  const coordinate = getCoordinates(lon, lat);
  return createPoint(coordinate, formatted);
};

// const addFeatureFromSearch = (searchResult: any, layer: VectorSource) => {
//   const point = createRoutePoint(searchResult);
//   layer !== stopsLayer && layer.clear();
//   layer.addFeature(point);
//   return point;
// };
