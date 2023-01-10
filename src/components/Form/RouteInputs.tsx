import { ReactElement, useContext } from "react";

import MapContext from "../MapComponent/MapContext";

import InputField from "./InputField";
import { DestinationType, RoutePoint } from "./types";

type RouteInputsProps = {
  start: RoutePoint | undefined;
  end: RoutePoint | undefined;
  updateRoute: (destination: DestinationType) => void;
};

const RouteInputs = ({
  start,
  end,
  updateRoute,
}: RouteInputsProps): ReactElement => {
  const { endLayer, stopsLayer } = useContext(MapContext);
  const startValue = start?.get("name") || "";
  const endValue = end?.get("name") || "";

  const stops = stopsLayer.getFeatures();

  const copyEndFromStart = () => {
    if (start) {
      endLayer.clear();
      endLayer.addFeature(start);
      updateRoute("end");
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
