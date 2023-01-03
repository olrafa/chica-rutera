import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";

export type Destinations = {
  start: Feature | undefined;
  end: Feature | undefined;
  stops: Feature[];
};

export type DestinationType = keyof Destinations;

export type RouteInfo = {
  route: any;
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
  start?: any;
  end?: any;
};
