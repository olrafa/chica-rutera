import { ReactElement, useContext } from "react";

import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";

import InputField from "./InputField";

type RouteInputsProps = {
  updateRoute: () => void;
};

const RouteInputs = ({ updateRoute }: RouteInputsProps): ReactElement => {
  const { endLayer } = useContext(MapContext);
  const { start, end, stops } = useGetRoutePoints();
  const startValue = start?.get("name") || "";
  const endValue = end?.get("name") || "";

  const copyEndFromStart = () => {
    if (start) {
      endLayer.clear();
      endLayer.addFeature(start);
      updateRoute();
    }
  };

  return (
    <div className="inputs-section">
      <InputField
        label="Starting point:"
        destination="start"
        callback={updateRoute}
        value={startValue}
      />
      <div>
        <InputField
          label="Ending point:"
          destination="end"
          callback={updateRoute}
          value={endValue}
        />
        {start && (
          <span className="repeat-start-btn" onClick={copyEndFromStart}>
            Make end the same as start
          </span>
        )}
      </div>
      <InputField
        label="Add stops:"
        destination="stops"
        callback={updateRoute}
        stops={stops}
      />
    </div>
  );
};

export default RouteInputs;