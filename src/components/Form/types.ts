import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

export type Destinations = {
  start: RoutePoint;
  end: RoutePoint;
  stops: RouteStops;
};

export type RoutePoint = Feature<Geometry>;
export type RouteStops = RoutePoint[];

export type DestinationType = keyof Destinations;
