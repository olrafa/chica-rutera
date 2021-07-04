import Feature from 'ol/Feature';
import Map from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';

export type ActionComponentProps = {
  map: Map;
  startLayer: VectorSource;
  endLayer: VectorSource;
  stopsLayer: VectorSource;
  routeLayer: VectorSource;
};

export type RouteInfo = {
  startPoint: Feature | undefined;
  endPoint: Feature | undefined;
  stops: Feature[];
};