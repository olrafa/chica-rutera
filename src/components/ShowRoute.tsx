import React from 'react';

import Feature from 'ol/Feature';
import Polyline from 'ol/format/Polyline';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import { Vector as VectorSource } from 'ol/source';
import { Coordinate } from 'ol/coordinate';

type RouteInfo = {
  route: any;
  map: Map;
  lineLayer: VectorSource;
  startPoint: Feature;
  endPoint: Feature;
  stops: Feature[];
};

type RouteStep = {
  arrival: number;
  distance: number;
  duration: number;
  location: Coordinate;
  type: string;
  displayName?: string;
  id?: number;
};

type RouteDetail = {
  cost: number;
  distance: number;
  duration: number;
  geometry: string;
  service: number;
  steps: RouteStep[];
  vehicle: number;
  waiting_time: number;
};

export const ShowRoute = ({
  route,
  map,
  lineLayer,
  startPoint,
  endPoint,
  stops,
}: RouteInfo) => {
  const { routes } = route;

  const routeLines = routes.map(({ geometry }: any) => {
    const trace = new Polyline().readGeometry(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    return new Feature({
      type: 'route',
      geometry: trace,
    });
  });

  routeLines.forEach((line: Feature<Geometry>) => {
    lineLayer.addFeature(line);
  });

  map.getView().fit(lineLayer.getExtent(), { padding: [50, 50, 50, 200] });

  const routesDisplay = routes.map((r: RouteDetail) => {
    const { cost, distance, duration, service, steps } = r;
    return {
      cost,
      distance,
      duration,
      service,
      start: steps.find((s) => s.type === 'start'),
      end: steps.find((s) => s.type === 'end'),
      steps: steps
        .filter((s) => s.type === 'job')
        .map((s) => {
          s.displayName = stops.find((f) => s.id === f.getId())?.get('name');
          return s;
        }),
    };
  });

  return (
    <div>
      <div>Route ready</div>
      {routesDisplay.map((rd: RouteDetail, i: number) => {
        return (
          <div key={i}>
            Route {i + 1}
            <div>
              <b>Start:</b> {startPoint.get('name')}
            </div>
            {rd.steps.map((s: RouteStep, i: number) => (
              <div key={i + 1}>
                <b>Stop {i + 1}</b>: {s.displayName}
              </div>
            ))}
            <div>
              <b>End:</b> {endPoint.get('name')}
            </div>
          </div>
        );
      })}
    </div>
  );
};
