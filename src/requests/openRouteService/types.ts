import { Coordinate } from "ol/coordinate";

type RouteStep = {
  arrival: number;
  distance: number;
  duration: number;
  location: Coordinate;
  type: "start" | "end" | "job";
  id: number;
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

type RouteSummary = {
  computing_times: {
    loading: number;
    routing: number;
    solving: number;
  };
  cost: number;
  distance: number;
  duration: number;
  service: number;
  unassigned: number;
  waiting_time: number;
};

export type RouteResponse = {
  code: number;
  routes: RouteDetail[];
  summary: RouteSummary;
  unassigned: number[];
};
