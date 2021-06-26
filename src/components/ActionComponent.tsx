import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import './ActionComponent.css';

type ActionComponentProps = {
  map: Map;
};

export const ActionComponent = ({ map }: ActionComponentProps) => {
  const [wayPoints, setWaypoints] = useState<number[][]>([]);

  useEffect(() => {
    if (map) {
      map.on('singleclick', ({ coordinate }: any) => {
        setWaypoints(w => [...w, [coordinate]]);
      });
    }
    
  }, [map]);

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
