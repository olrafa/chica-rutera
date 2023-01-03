import { ReactElement, useContext } from "react";

import { useCalculateRoute } from "../../requests/route";

import MapContext from "./MapContext";

type CalculateRouteButtonProps = {
  callback: (route: any) => void;
};

const CalculateRouteButton = ({
  callback,
}: CalculateRouteButtonProps): ReactElement | null => {
  const { startLayer, endLayer, stopsLayer } = useContext(MapContext);
  const [start] = startLayer.getFeatures();
  const [end] = endLayer.getFeatures();
  const stops = stopsLayer.getFeatures();

  const canRouteBeCalculated = start && end && !!stops.length;

  const { mutate: calculateRoute, data: route } = useCalculateRoute();

  const handleClick = () => {
    calculateRoute();
    callback(route);
  };

  if (canRouteBeCalculated) {
    return (
      <div className="option-btn route" onClick={handleClick}>
        Calculate Route
      </div>
    );
  }

  return null;
};

export default CalculateRouteButton;
