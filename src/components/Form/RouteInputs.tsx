import { ReactElement, useContext } from "react";

import MapContext from "../MapComponent/MapContext";

import InputField from "./InputField";
import useGetRoutePoints from "./useGetRoutePoints";

type RouteInputsProps = {
  updateRoute: () => void;
};

const RouteInputs = ({ updateRoute }: RouteInputsProps): ReactElement => {
  const { endLayer, stopsLayer } = useContext(MapContext);
  const { start, end } = useGetRoutePoints();
  const startValue = start?.get("name") || "";
  const endValue = end?.get("name") || "";

  const stops = stopsLayer.getFeatures();

  const copyEndFromStart = () => {
    if (start) {
      endLayer.clear();
      endLayer.addFeature(start);
      updateRoute();
    }
  };

  return (
    <div>
      <InputField
        label="Starting point"
        destination="start"
        callback={updateRoute}
        value={startValue}
      />
      <div>
        <InputField
          label="Ending point"
          destination="end"
          callback={updateRoute}
          value={endValue}
        />
        {start && (
          <span className="repeat-start-btn" onClick={copyEndFromStart}>
            Same as start
          </span>
        )}
      </div>
      <InputField
        label="Add stops"
        destination="stops"
        callback={updateRoute}
        stops={stops}
      />
    </div>
  );
};

export default RouteInputs;
