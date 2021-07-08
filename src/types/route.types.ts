import { Coordinate } from 'ol/coordinate';
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

export type Destinations = {
  startPoint: Feature | undefined;
  endPoint: Feature | undefined;
  stops: Feature[];
};

export type RouteInfo = {
  route: any;
  map: Map;
  lineLayer: VectorSource;
  destinations: Destinations;
  exitFunction: () => void;
};

export type RouteStep = {
  arrival: number;
  distance: number;
  duration: number;
  location: Coordinate;
  type: string;
  displayName?: string;
  id?: number;
};

export type RouteDetail = {
  cost: number;
  distance: number;
  duration: number;
  geometry: string;
  service: number;
  steps: RouteStep[];
  vehicle: number;
  waiting_time: number;
};
