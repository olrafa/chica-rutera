import React, { useCallback, useContext, useEffect, useState } from "react";
import { MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";

import { reverseGeocode } from "../../requests/geoapify/input";
import {
  DestinationType,
  RoutePoint,
  RouteStops,
} from "../../types/route.types";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import CalculateRouteButton from "../MapComponent/CalculateRouteButton";
import MapContext from "../MapComponent/MapContext";
import { ShowRoute } from "../ShowRoute";

import FileUploader from "./FileUploader";
import RouteInputs from "./RouteInputs";
import StopsList from "./StopsList";

import "../components.css";

export const ActionComponent = () => {
  // Get layers from context
  const { map, startLayer, endLayer, stopsLayer, routeLayer } =
    useContext(MapContext);

  // Use state to determine the route points, so we can call setState to refresh them.
  const [start, setStart] = useState<RoutePoint>();
  const [end, setEnd] = useState<RoutePoint>();
  const [stops, setStops] = useState<RouteStops>([]);

  // Callback to setState using the layers
  const updateRoutePoints = (destinationType: DestinationType) => {
    if (destinationType === "start") {
      setStart(startLayer.getFeatures()[0]);
    }
    if (destinationType === "end") {
      setEnd(endLayer.getFeatures()[0]);
    }
    if (destinationType === "stops") {
      setStops(stopsLayer.getFeatures());
    }
  };

  // Utilities for route points

  const copyEndFromStart = () => {
    if (start) {
      endLayer.clear();
      endLayer.addFeature(start);
      updateRoutePoints("end");
    }
  };

  // Add points via click
  const addPointOnClick = useCallback(
    (e: MapBrowserEvent) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        if (!searchResult) {
          return;
        }
        const [startPoint] = startLayer.getFeatures();
        if (!startPoint) {
          addPointToLayer(searchResult, startLayer);
          updateRoutePoints("start");
        }
        const [endPoint] = endLayer.getFeatures();
        if (startPoint && !endPoint) {
          addPointToLayer(searchResult, endLayer);
          updateRoutePoints("end");
        }
        if (startPoint && endPoint) {
          addPointToLayer(searchResult, stopsLayer, false);
          updateRoutePoints("stops");
        }
      });
    },
    [endLayer, startLayer, stopsLayer]
  );

  const [clickActive, setClickActive] = useState(false);

  useEffect(() => {
    clickActive && map.on("singleclick", addPointOnClick);
    return () => map.un("singleclick", addPointOnClick);
  }, [map, addPointOnClick, clickActive]);

  // state to see if calculation is in progress (TODO: remove in favor of useQuery)
  const [calculatedRoute, setCalculatedRoute] = useState(null);

  const cancelRoute = () => {
    routeLayer.clear();
    setCalculatedRoute(null);
  };

  return (
    <div className="action-component">
      <div className="action-component-wrapper">
        {!calculatedRoute && (
          <div>
            Create your best driving route between multiple points
            <RouteInputs
              start={start}
              end={end}
              updateRoute={updateRoutePoints}
              copyEndFromStart={copyEndFromStart}
            />
            <FileUploader updateFunction={updateRoutePoints} />
            <StopsList stops={stops} updateFunction={updateRoutePoints} />
          </div>
        )}
        {!calculatedRoute && (
          <CalculateRouteButton callback={setCalculatedRoute} />
        )}
        {!calculatedRoute && (
          <div
            onClick={() => setClickActive(!clickActive)}
            className="map-click-btn"
          >
            {clickActive ? "Disable" : "Enable"} adding points from map click
          </div>
        )}
        {calculatedRoute && (
          <ShowRoute route={calculatedRoute} exitFunction={cancelRoute} />
        )}
      </div>
    </div>
  );
};
