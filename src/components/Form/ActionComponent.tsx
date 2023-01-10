import React, { useCallback, useContext, useEffect, useState } from "react";
import { MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";

import { useQueryClient } from "@tanstack/react-query";

import { reverseGeocode } from "../../requests/geoapify/input";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import MapContext from "../MapComponent/MapContext";

import FileUploader from "./FileUploader";
import RouteDisplay from "./RouteDisplay";
import RouteInputs from "./RouteInputs";
import StopsList from "./StopsList";
import useGetRoutePoints from "./useGetRoutePoints";

import "../components.css";

export const ActionComponent = () => {
  // Get layers from context
  const { map, startLayer, endLayer, stopsLayer, routeLayer } =
    useContext(MapContext);

  const { start, end, stops } = useGetRoutePoints();

  // We use setState to make the hook above refresh whenever a point changes
  const [, setRouteUpdated] = useState(0);

  const queryClient = useQueryClient();

  const updateRoutePoints = () => {
    setRouteUpdated((_routeUpdated) => _routeUpdated + 1);
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
        if (!start) {
          addPointToLayer(searchResult, startLayer);
          updateRoutePoints();
        }

        if (start && !end) {
          addPointToLayer(searchResult, endLayer);
          updateRoutePoints();
        }
        if (start && end) {
          addPointToLayer(searchResult, stopsLayer, false);
          updateRoutePoints();
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
              <RouteInputs updateRoute={updateRoutePoints} />
              <FileUploader updateFunction={updateRoutePoints} />
              <StopsList updateFunction={updateRoutePoints} />
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
            showRoute={!isShowingForm}
            toggleFunction={toggleForm}
          />
        )}
      </div>
    </div>
  );
};
