import { ReactElement, useContext, useEffect, useRef, useState } from "react";

import MapContext from "../MapComponent/MapContext";

import searchForAddress from "./searchAndAddPoint";
import { DestinationType, RouteStops } from "./types";

const PLACEHOLDER = "Search for an address and press 'Enter'";

type InputFieldProps = {
  label: string;
  destination: DestinationType;
  callback: (destination: DestinationType) => void;
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
    inputValue &&
    searchForAddress(
      inputValue,
      destination,
      map,
      destinationLayers[destination],
      callback
    );

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.value = value || "";
    }
  }, [value, stops]);

  return (
    <label className="search-item">
      <div>{label}:</div>
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
