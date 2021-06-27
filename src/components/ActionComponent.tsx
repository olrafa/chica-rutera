import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import React, { useEffect, useState } from 'react';
import { calculateRoute } from '../requests/route';
import './ActionComponent.css';
import { ShowRoute } from './ShowRoute';

type ActionComponentProps = {
  map: Map;
  pointLayer: VectorSource;
};

export const ActionComponent = ({ map, pointLayer }: ActionComponentProps) => {
  const [start, setStart] = useState<number[] | undefined>(undefined);
  const [end, setEnd] = useState<number[] | undefined>(undefined);
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

  const optimize = async () => {
    const route = await calculateRoute(pointLayer);
    route && setRouting(route);
  };

  return (
    <div className="action-component">
      Create your best delivery route
      <div>Start</div>
      <div>End</div>
      <div>
        Route stops
        {wayPoints.map((wp, i) => (
          <div key={i + 1}>{wp}</div>
        ))}
      </div>
      <div onClick={optimize}>Calculate Route</div>
      {routing && <ShowRoute routing={routing} map={map} />}
    </div>
  );
};
