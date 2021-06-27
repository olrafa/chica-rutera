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
  startLayer: VectorSource;
  endLayer: VectorSource;
  stopsLayer: VectorSource;
};

export const ActionComponent = ({
  map,
  startLayer,
  endLayer,
  stopsLayer,
}: ActionComponentProps) => {
  const [start, setStart] = useState<number[] | undefined>(undefined);
  const [end, setEnd] = useState<number[] | undefined>(undefined);
  const [wayPoints, setWaypoints] = useState<number[][]>([]);
  const [routing, setRouting] = useState(null);

  const createPoint = (coordinate: any) =>
    new Feature({
      type: 'geoMarker',
      geometry: new Point(coordinate),
    });

  useEffect(() => {
    map &&
      map.on('singleclick', ({ coordinate }: any) => {
        if (!start) {
          setStart(coordinate);
          startLayer.addFeature(createPoint(coordinate));
        } else if (!end) {
          setEnd(coordinate);
          endLayer.addFeature(createPoint(coordinate));
        } else {
          setWaypoints((w) => [...w, [coordinate]]);
          stopsLayer.addFeature(createPoint(coordinate));
        }
      });
  }, [end, endLayer, map, start, startLayer, stopsLayer]);

  // useEffect(() => console.log(start), [start]);
  // useEffect(() => console.log(end), [end]);
  // useEffect(() => console.log(wayPoints), [wayPoints]);

  const optimize = async () => {
    const route = await calculateRoute(startLayer, endLayer, stopsLayer);
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
