import { ReactElement, useContext } from "react";

import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";

import { RoutePoint } from "./types";

type StopsListProps = {
  updateFunction: () => void;
};

const StopsList = ({ updateFunction }: StopsListProps): ReactElement => {
  const { stops } = useGetRoutePoints();
  const { stopsLayer } = useContext(MapContext);

  const clearAllStops = () => {
    stopsLayer.clear();
    updateFunction();
  };

  const removeStopFromList = (stop: RoutePoint) => {
    stopsLayer.removeFeature(stop);
    updateFunction();
  };

  return (
    <div className="stops-list">
      {!!stops.length && (
        <div className="route-summary">{`Current stops (${stops.length})`}</div>
      )}
      {stops.length === 48 && <div>Maximum number of points (48) reached.</div>}
      {stops.map((stop) => {
        return (
          <div key={stop.getId()} className="route-stops">
            <input type="text" value={stop.get("name")} disabled={true} />
            <span
              className="remove-stop"
              onClick={() => removeStopFromList(stop)}
            >
              &times;
            </span>
          </div>
        );
      })}
      {stops.length > 1 && (
        <div className="option-btn" onClick={clearAllStops}>
          Clear all stops
        </div>
      )}
    </div>
  );
};

export default StopsList;
