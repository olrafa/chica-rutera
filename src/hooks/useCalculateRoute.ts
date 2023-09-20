import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import Point from "ol/geom/Point";
import { toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";

import { RouteResponse } from "../api/openRouteService/types";
import {
  Destinations,
  RoutePoint,
  RouteStops,
} from "../components/MainForm/types";
import { WEB_MERCATOR, WGS84 } from "../components/MapComponent/constants";
import convertTimeToMilliseconds from "../util/convertTimeToMilliseconds";
import { TOAST_ERRORS } from "../util/toastErrors";

const orsUrl = "https://api.openrouteservice.org/";

const createStopsPoints = (stops: Feature[]) => {
  const wgs84points = stops.map((stop) => ({
    coords: getWgs84Coordinates(stop),
    pointId: stop.getId(),
  }));
  return wgs84points.map((stop) => ({
    id: stop.pointId,
    location: stop.coords,
  }));
};

const getWgs84Coordinates = (point: RoutePoint) => {
  const pointGeo = point.getGeometry();
  if (!pointGeo) {
    return null;
  }
  const copiedGeo = pointGeo.clone();
  const wgs84geo: Geometry = copiedGeo.transform(WEB_MERCATOR, WGS84);
  const castGeo: Point = wgs84geo as Point;
  const coordinates: Coordinate = castGeo.getCoordinates();
  return coordinates;
};

const calculateRoute = async (
  start: RoutePoint,
  end: RoutePoint,
  stops: RouteStops,
): Promise<RouteResponse> => {
  const requestPoints = createStopsPoints(stops);
  const orsRequest = {
    jobs: requestPoints,
    vehicles: [
      {
        id: 1,
        profile: "driving-car",
        start: getWgs84Coordinates(start),
        end: getWgs84Coordinates(end),
      },
    ],
    options: {
      g: true,
    },
  };

  const reqHeaders = new Headers();
  const orsKey = process.env.REACT_APP_ORS_KEY as string;
  reqHeaders.append("Authorization", orsKey);
  reqHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: reqHeaders,
    body: JSON.stringify(orsRequest),
    redirect: "follow",
  };

  const optimizationUrl = orsUrl + "optimization";

  const orsRoute = await fetch(optimizationUrl, requestOptions);
  const routeResult = await orsRoute.json();
  return routeResult;
};

export const useCalculateRoute = (
  { start, end, stops }: Destinations,
  enabled: boolean,
) =>
  useQuery(["route"], () => calculateRoute(start, end, stops), {
    enabled,
    staleTime: convertTimeToMilliseconds(4, "hours"),
    onError: () => toast.error(TOAST_ERRORS.calculateRoute),
  });
