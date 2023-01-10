import React, { useContext, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import MapContext from "../MapComponent/MapContext";

import EnableAddPointOnClick from "./EnableAddPointOnClick";
import FileUploader from "./FileUploader";
import RouteDisplay from "./RouteDisplay";
import RouteInputs from "./RouteInputs";
import StopsList from "./StopsList";
import useGetRoutePoints from "./useGetRoutePoints";

import "../components.css";

export const ActionComponent = () => {
  // Get layers from context
  const { routeLayer } = useContext(MapContext);
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

  const canCreateRoute = start && end && !!stops.length;

  const [isShowingForm, setIsShowingForm] = useState(true);
  const toggleForm = () => setIsShowingForm((_isShowing) => !_isShowing);

  return (
    <div className="action-component">
      <div className="action-component-wrapper">
        {isShowingForm && (
          <>
            Create your best driving route between multiple points
            <RouteInputs updateRoute={updateRoutePoints} />
            <FileUploader updateFunction={updateRoutePoints} />
            <StopsList updateFunction={updateRoutePoints} />
            <EnableAddPointOnClick refreshLayerCallback={updateRoutePoints} />
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
