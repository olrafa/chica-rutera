import { ReactElement, useContext } from "react";

import { DestinationType, RoutePoint } from "../../types/route.types";
import MapContext from "../MapComponent/MapContext";

import searchForAddress from "./searchAndAddPoint";

const placeHolderTxt = "Search for an address and press 'Enter'";

type RouteInputsProps = {
  start: RoutePoint | undefined;
  end: RoutePoint | undefined;
  updateRoute: (destination: DestinationType) => void;
  copyEndFromStart: () => void;
};

const RouteInputs = ({
  start,
  end,
  updateRoute,
  copyEndFromStart,
}: RouteInputsProps): ReactElement => {
  const { map, startLayer, endLayer, stopsLayer } = useContext(MapContext);
  const startValue = start?.get("name");
  const endValue = end?.get("name");
  console.log(start, end);

  const destinationLayers = {
    start: startLayer,
    end: endLayer,
    stops: stopsLayer,
  };

  const handleAddressInput = (
    e: { key: string; target: any },
    item: DestinationType
  ) =>
    e.key === "Enter" &&
    searchForAddress(
      e.target.value,
      item,
      map,
      destinationLayers[item],
      updateRoute
    );

  return (
    <div>
      <div className="search-item">
        <label htmlFor="search-start">Starting point:</label>
        <input
          id="search-start"
          type="text"
          onKeyDown={(e) => handleAddressInput(e, "start")}
          placeholder={placeHolderTxt}
          defaultValue={startValue}
        />
      </div>
      <div className="search-item">
        <label htmlFor="search-end">Ending point:</label>
        <input
          id="search-end"
          type="text"
          onKeyDown={(e) => handleAddressInput(e, "end")}
          placeholder={placeHolderTxt}
          defaultValue={endValue}
        />
        {start && (
          <span className="repeat-start-btn" onClick={copyEndFromStart}>
            Same as start
          </span>
        )}
      </div>
      <div className="search-item">
        <label htmlFor="search-stops">Add stops:</label>
        <input
          id="search-stops"
          type="text"
          onKeyDown={(e) => handleAddressInput(e, "stops")}
          placeholder={placeHolderTxt}
        />
      </div>
    </div>
  );
};

export default RouteInputs;
