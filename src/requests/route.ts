import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { orsUrl } from './orsUrl';


const createStopsPoints = (pointLayer: VectorSource) => {
  const points = pointLayer.getFeatures();
  const wgs84points = points.map((p) => getCoordinates(p));
  return wgs84points
    .filter((p) => p)
    .map((p, i) => {
      return {
        id: i + 1,
        location: p,
      };
    });
};

const getCoordinates = (point: any) => {
  const pointGeo = point.getGeometry();
  if (!pointGeo) {
    return null;
  } else {
    const copiedGeo = pointGeo.clone();
    const wgs84geo: Geometry = copiedGeo.transform('EPSG:3857', 'EPSG:4326');
    const castGeo: Point = wgs84geo as Point;
    const coordinates: Coordinate = castGeo.getCoordinates();
    return coordinates;
  }
};

export const calculateRoute = async (
  startPoint: VectorSource,
  endPoint: VectorSource,
  stopsPoints: VectorSource,
) => {
  const requestPoints = createStopsPoints(stopsPoints);
  const orsRequest = {
    jobs: requestPoints,
    vehicles: [
      {
        id: 1,
        profile: 'driving-car',
        start: getCoordinates(startPoint.getFeatures()[0]),
        end: getCoordinates(endPoint.getFeatures()[0]),
      },
    ],
    options: {
      g: true,
    },
  };

  const reqHeaders = new Headers();
  const orsKey = process.env.REACT_APP_ORS_KEY as string;
  reqHeaders.append('Authorization', orsKey);
  reqHeaders.append('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: reqHeaders,
    body: JSON.stringify(orsRequest),
    redirect: 'follow',
  };

  const optimizationUrl = orsUrl + 'optimization';

  const orsRoute = await fetch(optimizationUrl, requestOptions);
  const routeResult = await orsRoute.json();
  return routeResult;
};
