import React, { useEffect, useState } from 'react';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import './ActionComponent.css';

type ActionComponentProps = {
  map: Map;
  pointLayer: VectorSource;
};

export const ActionComponent = ({ map, pointLayer }: ActionComponentProps) => {
  const [wayPoints, setWaypoints] = useState<number[][]>([]);

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

  useEffect(() => console.log(wayPoints), [wayPoints]);

  return (
    <div className="action-component">
      Click to start
      {wayPoints.map((wp, i) => (
        <div key={i + 1}>{wp}</div>
      ))}
    </div>
  );
};
