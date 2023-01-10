import React, { useCallback, useContext, useEffect, useState } from "react";
import { MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";

import { useQueryClient } from "@tanstack/react-query";

import { reverseGeocode } from "../../requests/geoapify/input";
import {
  DestinationType,
  RoutePoint,
  RouteStops,
} from "../../types/route.types";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import MapContext from "../MapComponent/MapContext";

import FileUploader from "./FileUploader";
import RouteDisplay from "./RouteDisplay";
import RouteInputs from "./RouteInputs";
import StopsList from "./StopsList";

import "../components.css";

export const ActionComponent = () => {
  // Get layers from context
  const { map, startLayer, endLayer, stopsLayer, routeLayer } =
    useContext(MapContext);

  // Use state to determine the route points, so we can call setState to refresh them.
  const [start, setStart] = useState<RoutePoint>(startLayer.getFeatures()[0]);
  const [end, setEnd] = useState<RoutePoint>(endLayer.getFeatures()[0]);
  const [stops, setStops] = useState<RouteStops>(stopsLayer.getFeatures());

  const queryClient = useQueryClient();

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
    // Clear the previous route when points change.
    queryClient.invalidateQueries(["route"]);
    routeLayer.clear();
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

  const canCreateRoute = start && end && !!stops.length;

  const [isShowingForm, setIsShowingForm] = useState(true);
  const toggleForm = () => setIsShowingForm((_isShowing) => !_isShowing);

  return (
    <div className="action-component">
      <div className="action-component-wrapper">
        {isShowingForm && (
          <>
            <div>
              Create your best driving route between multiple points
              <RouteInputs
                start={start}
                end={end}
                updateRoute={updateRoutePoints}
              />
              <FileUploader updateFunction={updateRoutePoints} />
              <StopsList stops={stops} updateFunction={updateRoutePoints} />
            </div>
            <div
              onClick={() => setClickActive(!clickActive)}
              className="map-click-btn"
            >
              {clickActive ? "Disable" : "Enable"} adding points from map click
            </div>
          </>
        )}
        {canCreateRoute && (
          <RouteDisplay
            start={start}
            end={end}
            stops={stops}
            showRoute={!isShowingForm}
            toggleFunction={toggleForm}
          />
        )}
      </div>
    </div>
  );
};
