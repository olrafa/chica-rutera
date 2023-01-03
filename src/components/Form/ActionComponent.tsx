import React, { useCallback, useContext, useEffect, useState } from "react";
import { MapBrowserEvent } from "ol";
import Feature from "ol/Feature";
import { toLonLat } from "ol/proj";

import { reverseGeocode } from "../../requests/geoapify/input";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import CalculateRouteButton from "../MapComponent/CalculateRouteButton";
import MapContext from "../MapComponent/MapContext";
import { RoutePoints } from "../RoutePoints";
import { ShowRoute } from "../ShowRoute";

import "../components.css";

export const ActionComponent = () => {
  const { map, startLayer, endLayer, stopsLayer, routeLayer } =
    useContext(MapContext);

  const [calculatedRoute, setCalculatedRoute] = useState(null);

  const removeStopFromList = (stop: Feature) => {
    stopsLayer.removeFeature(stop);
  };

  const copyEndFromStart = () => {
    const [startPoint] = startLayer.getFeatures();
    if (startPoint) {
      endLayer.clear();
      endLayer.addFeature(startPoint);
    }
  };

  const addPointOnClick = useCallback(
    (e: MapBrowserEvent) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        const [startPoint] = startLayer.getFeatures();
        if (!startPoint) {
          addPointToLayer(searchResult, startLayer);
        }
        const [endPoint] = endLayer.getFeatures();
        if (startPoint && !endPoint) {
          addPointToLayer(searchResult, endLayer);
        }
        if (startPoint && endPoint) {
          addPointToLayer(searchResult, stopsLayer, false);
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

  const cancelRoute = () => {
    routeLayer.clear();
    setCalculatedRoute(null);
  };
  const clearAllStops = () => {
    stopsLayer.clear();
  };

  return (
    <div className="action-component">
      <div className="action-component-wrapper">
        {!calculatedRoute && (
          <div>
            Create your best driving route between multiple points
            <RoutePoints
              removeStopsFunction={removeStopFromList}
              copyEndFromStart={copyEndFromStart}
              clearStopsFunction={clearAllStops}
            />
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
