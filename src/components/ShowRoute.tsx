import React from 'react';

import Feature from 'ol/Feature';
import Polyline from 'ol/format/Polyline';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import Geometry from 'ol/geom/Geometry';
import { Stroke, Style } from 'ol/style';

export const ShowRoute = ({ routing, map }: any) => {
  const { routes } = routing;

  const routeLines = routes.map(({ geometry }: any) => {
    const trace = new Polyline().readGeometry(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    console.log(trace);
    return new Feature({
      type: 'route',
      geometry: trace,
    });
  });

  const source = new VectorSource();
  const vector = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        width: 6,
        color: '#5AF',
      }),
    }),
  });

  routeLines.forEach((line: Feature<Geometry>) => {
    source.addFeature(line);
  });

  map.addLayer(vector);
  map.getView().fit(source.getExtent(), { padding: [50, 50, 50, 350] });

  console.log(source.getFeatures());

  return <div>Route showing on map</div>;
};
