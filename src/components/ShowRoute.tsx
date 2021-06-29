import React from 'react';

import Feature from 'ol/Feature';
import Polyline from 'ol/format/Polyline';
import Geometry from 'ol/geom/Geometry';

export const ShowRoute = ({ route, map, layer }: any) => {
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
    layer.addFeature(line);
  });

  map.getView().fit(layer.getExtent(), { padding: [50, 50, 50, 200] });

  return <div>Route showing on map</div>;
};
