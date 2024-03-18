import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";

import MapContext from "../MapComponent/MapContext";
import searchForAddress from "../MapComponent/searchAndAddPoint";

import { DestinationType, RouteStops } from "./types";

const PLACEHOLDER = "Search for an address and hit 'Enter'";

type InputFieldProps = {
  label: string;
  destination: DestinationType;
  callback: () => void;
  value?: string;
  stops?: RouteStops;
};

const InputField = ({
  label,
  destination,
  callback,
  value,
  stops,
}: InputFieldProps): ReactElement => {
  const { map, startLayer, endLayer, stopsLayer } = useContext(MapContext);

  const destinationLayers = {
    start: startLayer,
    end: endLayer,
    stops: stopsLayer,
  };

  const [inputValue, setInputValue] = useState(value);

  const fieldRef = useRef<HTMLInputElement>(null);

  const handleAddressInput = (e: { key: string }) =>
    e.key === "Enter" &&
    (inputValue
      ? searchForAddress(
          inputValue,
          destination,
          map,
          destinationLayers[destination],
          callback,
        )
      : clearStartOrEnd(destinationLayers[destination]));

  // Clear start or end input when field is cleared then "Enter"'d
  const clearStartOrEnd = (layer: VectorSource<Feature<Geometry>>) =>
    (layer === startLayer || layer === endLayer) && layer.clear();

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.value = value || "";
    }
  }, [value, stops]);

  return (
    <label className="search-item">
      <div className="field-title">{label}</div>
      <input
        type="text"
        onKeyDown={(e) => handleAddressInput(e)}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={PLACEHOLDER}
        ref={fieldRef}
      />
    </label>
  );
};

export default InputField;
