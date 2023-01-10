import { ReactElement, useContext } from "react";

import { useCalculateRoute } from "../../requests/openRouteService/useCalculateRoute";
import { RoutePoint, RouteStops } from "../../types/route.types";
import MapContext from "../MapComponent/MapContext";
import { ShowRoute } from "../ShowRoute";

type RouteDisplayProps = {
  start: RoutePoint;
  end: RoutePoint;
  stops: RouteStops;
  showRoute: boolean;
  toggleFunction: () => void;
};

const RouteDisplay = ({
  start,
  end,
  stops,
  showRoute,
  toggleFunction,
}: RouteDisplayProps): ReactElement => {
  const { routeLayer } = useContext(MapContext);

  const {
    mutate: createRoute,
    data: calculatedRoute,
    isLoading,
  } = useCalculateRoute({ start, end, stops });

  const handleClick = () => {
    createRoute();
    toggleFunction();
  };

  const exitRoute = () => {
    toggleFunction();
    routeLayer.clear();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (showRoute && calculatedRoute) {
    return <ShowRoute route={calculatedRoute} exitFunction={exitRoute} />;
  }

  return (
    <div className="option-btn route" onClick={handleClick}>
      Calculate Route
    </div>
  );
};

export default RouteDisplay;
