import { ReactElement, useContext } from "react";

import { useCalculateRoute } from "../../hooks/useCalculateRoute";
import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";
import Route from "../Route";

type CreateRouteProps = {
  showRoute: boolean;
  toggleFunction: () => void;
};

const CreateRoute = ({
  showRoute,
  toggleFunction,
}: CreateRouteProps): ReactElement => {
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

  if (showRoute) {
    if (isLoading || isFetching) {
      return (
        <div className="loader-wrapper">
          <div className="loader" />
        </div>
      );
    }

    if (calculatedRoute) {
      return <Route route={calculatedRoute} exitFunction={exitRoute} />;
    }
  }

  return (
    <div className="option-btn route" onClick={toggleFunction}>
      Create Route
    </div>
  );
};

export default CreateRoute;
