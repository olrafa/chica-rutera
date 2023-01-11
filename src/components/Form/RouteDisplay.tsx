import { ReactElement, useContext } from "react";

import { useCalculateRoute } from "../../requests/openRouteService/useCalculateRoute";
import MapContext from "../MapComponent/MapContext";

import { ShowRoute } from "./ShowRoute";
import useGetRoutePoints from "./useGetRoutePoints";

type RouteDisplayProps = {
  showRoute: boolean;
  toggleFunction: () => void;
};

const RouteDisplay = ({
  showRoute,
  toggleFunction,
}: RouteDisplayProps): ReactElement => {
  const { start, end, stops } = useGetRoutePoints();
  const { routeLayer } = useContext(MapContext);

  const {
    data: calculatedRoute,
    isLoading,
    isFetching,
  } = useCalculateRoute({ start, end, stops }, showRoute);

  const exitRoute = () => {
    toggleFunction();
    routeLayer.clear();
  };

  if (isLoading || isFetching) {
    return (
      <div className="loader-wrapper">
        <div className="loader" />
      </div>
    );
  }

  if (showRoute && calculatedRoute) {
    return <ShowRoute route={calculatedRoute} exitFunction={exitRoute} />;
  }

  return (
    <div className="option-btn route" onClick={toggleFunction}>
      Create Route
    </div>
  );
};

export default RouteDisplay;
