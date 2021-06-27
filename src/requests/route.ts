import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';

const createPointsForRequest = (pointLayer: VectorSource) => {
  const points = pointLayer.getFeatures();

  const wgs84points = points.map((p) => {
    const pointGeo = p.getGeometry();
    if (!pointGeo) {
      return null;
    } else {
      const copiedGeo = pointGeo.clone();
      const wgs84geo: Geometry = copiedGeo.transform('EPSG:3857', 'EPSG:4326');
      const castGeo: Point = wgs84geo as Point;
      const coordinates: Coordinate = castGeo.getCoordinates();
      return coordinates;
    }
  });

  return wgs84points
    .filter((p) => p)
    .map((p, i) => {
      return {
        id: i + 1,
        location: p,
      };
    });
};

export const calculateRoute = async (pointLayer: VectorSource) => {
  const requestPoints = createPointsForRequest(pointLayer);
  const orsRequest = {
    jobs: requestPoints,
    vehicles: [
      {
        id: 1,
        profile: 'driving-car',
        start: requestPoints[0].location,
        end: requestPoints[0].location,
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

  const orsUrl = 'https://api.openrouteservice.org/optimization';

  const orsRoute = await fetch(orsUrl, requestOptions);
  const routeResult = await orsRoute.json();
  return routeResult;
};
