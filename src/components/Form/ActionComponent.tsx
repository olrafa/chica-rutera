import React, { useCallback, useEffect, useState } from "react";
import { Map, MapBrowserEvent } from "ol";
import Feature from "ol/Feature";
import { toLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";

import { reverseGeocode } from "../../requests/geoapify/input";
import { AddressResult } from "../../requests/geoapify/types";
import { calculateRoute } from "../../requests/route";
import { Destinations } from "../../types/route.types";
import { MAP_SOURCES } from "../MapComponent/layers";
import { createRoutePoint } from "../MapComponent/util";
import { RoutePoints } from "../RoutePoints";
import { ShowRoute } from "../ShowRoute";

import "../components.css";

type ActionComponentProps = {
  map: Map;
};

export const ActionComponent = ({ map }: ActionComponentProps) => {
  const [startLayer, endLayer, stopsLayer, routeLayer] = MAP_SOURCES;

  const [destinations, setDestinations] = useState<Destinations>({
    startPoint: undefined,
    endPoint: undefined,
    stops: [],
  });

  const [calculatedRoute, setCalculatedRoute] = useState(null);

  const addFeatureFromSearch = (
    searchResult: AddressResult,
    layer: VectorSource
  ) => {
    const point = createRoutePoint(searchResult);
    layer !== stopsLayer && layer.clear();
    layer.addFeature(point);
    return point;
  };

  const addStartFromSearch = (searchResult: AddressResult) => {
    const point = createRoutePoint(searchResult);
    startLayer.clear();
    startLayer.addFeature(point);
    setDestinations({ ...destinations, startPoint: point });
  };

  const addEndFromSearch = (searchResult: AddressResult) => {
    const point = createRoutePoint(searchResult);
    endLayer.clear();
    endLayer.addFeature(point);
    setDestinations({ ...destinations, endPoint: point });
  };

  const addRoutePointFromSearch = (searchResult: AddressResult) => {
    if (destinations.stops.length < 48) {
      const point = createRoutePoint(searchResult);
      stopsLayer.addFeature(point);
      setDestinations({
        ...destinations,
        stops: [...destinations.stops, point],
      });
    }
  };

  const removeStopFromList = (stop: Feature) => {
    stopsLayer.removeFeature(stop);
    setDestinations({
      ...destinations,
      stops: destinations.stops.filter((s) => s !== stop),
    });
  };

  const copyEndFromStart = () => {
    const { startPoint } = destinations;
    if (startPoint !== undefined) {
      endLayer.clear();
      endLayer.addFeature(startPoint);
      setDestinations({
        ...destinations,
        endPoint: startPoint,
      });
    }
  };

  const addPointOnClick = useCallback(
    (e: MapBrowserEvent) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        let point;
        if (!destinations.startPoint) {
          point = addFeatureFromSearch(searchResult, startLayer);
          setDestinations({
            ...destinations,
            startPoint: point,
          });
        } else if (!destinations.endPoint) {
          point = addFeatureFromSearch(searchResult, endLayer);
          setDestinations({
            ...destinations,
            endPoint: point,
          });
        } else {
          if (destinations.stops.length < 48) {
            point = addFeatureFromSearch(searchResult, stopsLayer);
            setDestinations({
              ...destinations,
              stops: [...destinations.stops, point],
            });
          }
        }
      });
    },
    [endLayer, destinations, startLayer, stopsLayer]
  );

  const [clickActive, setClickActive] = useState(false);

  useEffect(() => {
    clickActive && map.on("singleclick", addPointOnClick);
    return () => map.un("singleclick", addPointOnClick);
  }, [map, addPointOnClick, clickActive]);

  const optimize = async () => {
    setClickActive(false);
    routeLayer.clear();
    const route = await calculateRoute(destinations);
    const validRoute = !route.code;
    if (validRoute) {
      setCalculatedRoute(route);
    } else {
      alert("Unable to create route. Please check your points and try again");
    }
  };

  const cancelRoute = () => {
    routeLayer.clear();
    setCalculatedRoute(null);
  };
  const clearAllStops = () => {
    stopsLayer.clear();
    setDestinations({
      ...destinations,
      stops: [],
    });
  };

  return (
    <div className="action-component">
      <div className="action-component-wrapper">
        {!calculatedRoute && (
          <div>
            Create your best driving route between multiple points
            <RoutePoints
              updateStartFunction={addStartFromSearch}
              updateEndFunction={addEndFromSearch}
              addStopsFunction={addRoutePointFromSearch}
              removeStopsFunction={removeStopFromList}
              stops={destinations.stops}
              map={map}
              currentStart={destinations.startPoint?.get("name") || ""}
              currentEnd={destinations.endPoint?.get("name") || ""}
              copyEndFromStart={copyEndFromStart}
              clearStopsFunction={clearAllStops}
            />
          </div>
        )}
        {!calculatedRoute &&
          destinations.startPoint &&
          destinations.endPoint &&
          !!destinations.stops.length && (
            <div className="option-btn route" onClick={optimize}>
              Calculate Route
            </div>
          )}
        {!calculatedRoute && (
          <div
            onClick={() => setClickActive(!clickActive)}
            className="map-click-btn"
          >
            {clickActive ? "Disable" : "Enable"} adding points from map click
          </div>
        )}
        {calculatedRoute &&
          destinations.startPoint &&
          destinations.endPoint &&
          !!destinations.stops.length && (
            <ShowRoute
              route={calculatedRoute}
              map={map}
              lineLayer={routeLayer}
              destinations={destinations}
              exitFunction={cancelRoute}
            />
          )}
      </div>
    </div>
  );
};
