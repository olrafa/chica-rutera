import React, { useContext, useEffect, useState } from "react";
import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import { fromLonLat, toLonLat } from "ol/proj";

import { addressSearch } from "../requests/geoapify/input";
import { AddressResult } from "../requests/geoapify/types";
import { DestinationType } from "../types/route.types";

import { addPointToLayer } from "./MapComponent/addPointToLayer";
import MapContext from "./MapComponent/MapContext";

type RoutePointsProps = {
  removeStopsFunction: (stop: Feature) => void;
  copyEndFromStart: () => void;
  clearStopsFunction: () => void;
};

export const RoutePoints = ({
  removeStopsFunction,
  copyEndFromStart,
  clearStopsFunction,
}: RoutePointsProps) => {
  const { map, startLayer, endLayer, stopsLayer } = useContext(MapContext);

  const destinationLayers = {
    start: startLayer,
    end: endLayer,
    stops: stopsLayer,
  };

  const [startValue, endValue] = [startLayer, endLayer].map((layer) => {
    const [feature] = layer.getFeatures();
    return feature?.get("name") || "";
  });

  const [start] = startLayer.getFeatures();
  const stops = stopsLayer.getFeatures();

  const handleAddressInput = (
    e: { key: string; target: any },
    item: DestinationType
  ) => e.key === "Enter" && searchForAddress(e.target.value, item, e.target);

  const searchForAddress = (
    value: string,
    item: DestinationType,
    elementToUpdate?: { value: string } | undefined
  ) => {
    let mapCenter = [0, 0];
    const viewCenter = map.getView().getCenter();
    if (viewCenter) {
      mapCenter = toLonLat(viewCenter);
    }

    const [lon, lat] = mapCenter;
    addressSearch({ address: value, lon, lat }).then((r: AddressResult) => {
      if (r) {
        if (elementToUpdate) {
          elementToUpdate.value = item === "stops" ? "" : r.formatted;
        }
        const mapCenter = [r.lon, r.lat];
        addPointToLayer(r, destinationLayers[item], item !== "stops");
        map.getView().setCenter(fromLonLat(mapCenter) as Coordinate);
        map.getView().setZoom(15);
      } else {
        alert(
          "No address found. Please check for typos and/or add details (city, region, country)"
        );
      }
    });
  };

  const placeHolderTxt = "Search for an address and press 'Enter'";

  const fileHandler = (files: FileList | null) => {
    const file = files && files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) =>
        e && e.target && addPointsFromFile(e.target.result as string);
      reader.onerror = () => console.log("error reading file");
    }
  };

  const [addressesFromFile, setAddressesFromFile] = useState<string[]>([]);

  const addPointsFromFile = (text: string) => {
    const addresses = text
      .split("\n")
      .filter((a) => a)
      .map((a) => a.replace(/;/g, ", "));
    setAddressesFromFile(Array.from(new Set(addresses)));
  };

  useEffect(() => {
    if (addressesFromFile.length) {
      const nextAddress = addressesFromFile.pop();
      setTimeout(() => searchForAddress(nextAddress as string, "stops"), 500);
    }
  }, [addressesFromFile]);

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
      <div>
        <div className="search-item">
          <label htmlFor="search-stops">Add stops:</label>
          <input
            id="search-stops"
            type="text"
            onKeyDown={(e) => handleAddressInput(e, "stops")}
            placeholder={placeHolderTxt}
          />
        </div>
        <div className="search-item">
          <label htmlFor="uploader">Or upload a file (txt/csv):</label>
          <input
            id="uploader"
            type="file"
            multiple={false}
            accept={
              ".csv, text/plain," +
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, " +
              "application/vnd.ms-excel"
            }
            onChange={(e) => fileHandler(e.target.files)}
          />
        </div>
        {stops.length === 48 && (
          <div>Maximum number of points (48) reached.</div>
        )}
        <div>
          {stops.map((s, i) => (
            <div key={i + 1}>
              <input type="text" value={s.get("name")} disabled={true} />
              <span onClick={() => removeStopsFunction(s)}>&times;</span>
            </div>
          ))}
          {stops.length > 1 && (
            <div className="option-btn" onClick={clearStopsFunction}>
              Clear all stops
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
