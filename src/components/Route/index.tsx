import React, { ReactElement, useContext } from "react";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

import { RouteResponse } from "../../api/openRouteService/types";
import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";
import { getRoutesAsLines } from "../MapComponent/util";

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

  // As of now we're only doing one route at a time,
  // so YAGNI for multiple routes atm.
  const [mainRoute] = routes;

  // Clear existing features;
  routeLayer.clear();

  // Add new line features
  const routeLines = getRoutesAsLines(routes);
  routeLines.forEach((line: Feature<Geometry>) => routeLayer.addFeature(line));

  // Zoom to new features
  const zoomToRoute = () =>
    map.getView().fit(routeLayer.getExtent(), {
      size: map.getSize(),
      padding: [50, 50, 50, 500],
    });

  zoomToRoute();

  const { steps, distance, duration } = mainRoute;

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
        <div className="option-btn" onClick={zoomToRoute}>
          Zoom to route
        </div>
        <GoogleButton route={mainRoute} />
        <ReturnButton />
      </div>
    </div>
  );
};

export default Route;
