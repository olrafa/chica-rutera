import { ReactElement, useContext } from "react";

import MapContext from "../MapComponent/MapContext";

import { RoutePoint } from "./types";

type StopsListProps = {
  updateFunction: () => void;
};

const StopsList = ({ updateFunction }: StopsListProps): ReactElement => {
  const { stopsLayer } = useContext(MapContext);
  const stops = stopsLayer.getFeatures();

  const clearAllStops = () => {
    stopsLayer.clear();
    updateFunction();
  };

  const removeStopFromList = (stop: RoutePoint) => {
    stopsLayer.removeFeature(stop);
    updateFunction();
  };

  return (
    <>
      {stops.length === 48 && <div>Maximum number of points (48) reached.</div>}
      {stops.map((stop, i) => {
        return (
          <div key={i + 1}>
            <input type="text" value={stop.get("name")} disabled={true} />
            <span onClick={() => removeStopFromList(stop)}>&times;</span>
          </div>
        );
      })}
      {stops.length > 1 && (
        <div className="option-btn" onClick={clearAllStops}>
          Clear all stops
        </div>
      )}
    </>
  );
};

export default StopsList;
