import React, { useCallback, useContext, useEffect, useState } from "react";
import { MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";

import { useQueryClient } from "@tanstack/react-query";

import { reverseGeocode } from "../../requests/geoapify/input";
import { useCalculateRoute } from "../../requests/openRouteService/useCalculateRoute";
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
  const [start, setStart] = useState<RoutePoint>(startLayer.getFeatures()[0]);
  const [end, setEnd] = useState<RoutePoint>(endLayer.getFeatures()[0]);
  const [stops, setStops] = useState<RouteStops>(stopsLayer.getFeatures());

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

  const {
    mutate: createRoute,
    data: calculatedRoute,
    isLoading,
  } = useCalculateRoute({ start, end, stops });

  const callback = () => createRoute();

  const queryClient = useQueryClient();

  const cancelRoute = () => {
    routeLayer.clear();
    queryClient.invalidateQueries(["route"]);
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
            />
            <FileUploader updateFunction={updateRoutePoints} />
            <StopsList stops={stops} updateFunction={updateRoutePoints} />
          </div>
        )}
        {!calculatedRoute && (
          <CalculateRouteButton
            enabled={start && end && !!stops.length}
            callback={callback}
          />
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
