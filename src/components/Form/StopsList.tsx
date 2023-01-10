import { ReactElement, useContext } from "react";

import MapContext from "../MapComponent/MapContext";

import { DestinationType, RoutePoint, RouteStops } from "./types";

type StopsListProps = {
  stops: RouteStops;
  updateFunction: (destinationType: DestinationType) => void;
};

const StopsList = ({ stops, updateFunction }: StopsListProps): ReactElement => {
  const { stopsLayer } = useContext(MapContext);

  const clearAllStops = () => {
    stopsLayer.clear();
    updateFunction("stops");
  };

  const removeStopFromList = (stop: RoutePoint) => {
    stopsLayer.removeFeature(stop);
    updateFunction("stops");
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
