import React, { useContext, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";
import { PageInfo } from "../PageInfo";

import EnableAddPointOnClick from "./EnableAddPointOnClick";
import FileUploader from "./FileUploader";
import RouteDisplay from "./RouteDisplay";
import RouteInputs from "./RouteInputs";
import StopsList from "./StopsList";

import "../index.css";

export const MainForm = () => {
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
      {isShowingForm && (
        <>
          <PageInfo />
          <div className="sub-title">
            Create your best driving route between multiple points
          </div>
          <RouteInputs updateRoute={updateRoutePoints} />
          <FileUploader updateFunction={updateRoutePoints} />
          <StopsList updateFunction={updateRoutePoints} />
          <EnableAddPointOnClick refreshLayerCallback={updateRoutePoints} />
        </>
      )}
      {canCreateRoute && (
        <RouteDisplay showRoute={!isShowingForm} toggleFunction={toggleForm} />
      )}
    </div>
  );
};
