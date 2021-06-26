import React, { useEffect, useState } from 'react';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import './ActionComponent.css';
import { ShowRoute } from './ShowRoute';

type ActionComponentProps = {
  map: Map;
  pointLayer: VectorSource;
};

export const ActionComponent = ({ map, pointLayer }: ActionComponentProps) => {
  const [wayPoints, setWaypoints] = useState<number[][]>([]);
  const [routing, setRouting] = useState(null);

  useEffect(() => {
    map &&
      map.on('singleclick', ({ coordinate }: any) => {
        setWaypoints((w) => [...w, [coordinate]]);
        pointLayer.addFeature(
          new Feature({
            type: 'geoMarker',
            geometry: new Point(coordinate),
          })
        );
      });
  }, [map, pointLayer]);

  const calculateRoute = () => {
    const requestPoints = createPointsForRequest();
    const orsREquest = {
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

    const myHeaders = new Headers();
    const orsKey = process.env.REACT_APP_ORS_KEY as string;
    myHeaders.append('Authorization', orsKey);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(orsREquest),
      redirect: 'follow',
    };

    fetch('https://api.openrouteservice.org/optimization', requestOptions)
      .then((response) => response.json())
      .then((result) => setRouting(result))
      .catch((error) => console.log('error', error));
  };

  const createPointsForRequest = () => {
    const points = pointLayer.getFeatures();

    const wgs84points = points.map((p) => {
      const pointGeo = p.getGeometry();
      if (!pointGeo) {
        return null;
      } else {
        const copiedGeo = pointGeo.clone();
        const wgs84geo: Geometry = copiedGeo.transform(
          'EPSG:3857',
          'EPSG:4326'
        );
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

  return (
    <div className="action-component">
      Click to start
      {wayPoints.map((wp, i) => (
        <div key={i + 1}>{wp}</div>
      ))}
      <div onClick={calculateRoute}>Calculate Route</div>
      {routing && <ShowRoute routing={routing} map={map}/>}
    </div>
  );
};
