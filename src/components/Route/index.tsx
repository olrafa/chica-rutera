import React, { ReactElement, useContext } from "react";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

import { RouteResponse } from "../../api/openRouteService/types";
import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";
import { getRoutesAsLines, zoomToLayer } from "../MapComponent/util";

import GoogleButton from "./GoogleButton";
import RouteStepBox from "./RouteStepBox";
import RouteStepList from "./RouteStepList";
import { secondsToHours } from "./util";

type RouteProps = {
  route: RouteResponse;
  exitFunction: () => void;
};

const Route = ({ route, exitFunction }: RouteProps): ReactElement => {
  const { map, routeLayer } = useContext(MapContext);
  const { start, end } = useGetRoutePoints();

  const { routes, error } = route;
  const ReturnButton = () => (
    <div className="option-btn" onClick={exitFunction}>
      Return
    </div>
  );

  if (error) {
    return (
      <div>
        <div className="route-summary">
          The following error occurred: {error}
        </div>
        <ReturnButton />
      </div>
    );
  }

  // As of now we're only doing one route at a time,
  // so YAGNI for multiple routes atm.
  const [mainRoute] = routes;

  // Clear existing features;
  routeLayer.clear();

  // Add new line features
  const routeLines = getRoutesAsLines(routes);
  routeLines.forEach((line: Feature<Geometry>) => routeLayer.addFeature(line));

  // Zoom to new features
  zoomToLayer(map, routeLayer);

  const { steps, distance, duration } = mainRoute;

  return (
    <div>
      <div className="route-summary route-ready">Route ready</div>
      <RouteStepBox mapFeature={start}>
        <b>Start:</b> {start?.get("name") || "Starting point"}
      </RouteStepBox>
      <RouteStepList routeSteps={steps} />
      <RouteStepBox mapFeature={end}>
        <b>End:</b> {end?.get("name") || "Ending point"}
      </RouteStepBox>
      <div className="route-summary">
        <div>Distance: {(distance / 1000).toFixed(1)} km</div>
        <div>Travel time: {secondsToHours(duration)}</div>
      </div>
      <div className="route-buttons">
        <div
          className="option-btn"
          onClick={() => zoomToLayer(map, routeLayer)}
        >
          Zoom to route
        </div>
        <GoogleButton routeSteps={mainRoute.steps} />
        <ReturnButton />
      </div>
    </div>
  );
};

export default Route;
