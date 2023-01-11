import React, { ReactElement, useContext } from "react";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

import { secondsToHours } from "../../requests/geoapify/util";
import MapContext from "../MapComponent/MapContext";
import { getRoutesAsLines } from "../MapComponent/util";

import RouteStepBox from "./RouteStepBox";
import RouteStepList from "./RouteStepList";
import { RouteInfo } from "./types";
import useGetRoutePoints from "./useGetRoutePoints";
import { createGoogleMapsUrl } from "./util";

export const ShowRoute = ({ route, exitFunction }: RouteInfo): ReactElement => {
  const { map, routeLayer } = useContext(MapContext);
  const { start, end } = useGetRoutePoints();
  const { routes } = route;

  // Clear existing features;
  routeLayer.clear();

  // Add new line features
  const routeLines = getRoutesAsLines(routes);
  routeLines.forEach((line: Feature<Geometry>) => routeLayer.addFeature(line));

  // Zoom to new features
  const zoomToRoute = () =>
    map.getView().fit(routeLayer.getExtent(), {
      size: map.getSize(),
      padding: [50, 50, 50, 450],
    });

  zoomToRoute();

  return (
    <div>
      <div>Route ready</div>
      {routes.map((route) => (
        <div key="main-route">
          <RouteStepBox mapFeature={start}>
            <b>Start:</b> {start?.get("name") || "Starting point"}
          </RouteStepBox>
          <RouteStepList routeSteps={route.steps} />
          <RouteStepBox mapFeature={end}>
            <b>End:</b> {end?.get("name") || "Ending point"}
          </RouteStepBox>
          <div>Distance: {(route.distance / 1000).toFixed(1)} km</div>
          <div>Travel time: {secondsToHours(route.duration)}</div>
          <div className="option-btn" onClick={zoomToRoute}>
            Zoom to route
          </div>
          <div
            className="option-btn"
            onClick={() => window.open(createGoogleMapsUrl(route))}
          >
            Open route in GoogleMaps
          </div>
          <div className="option-btn" onClick={exitFunction}>
            Return
          </div>
        </div>
      ))}
    </div>
  );
};
