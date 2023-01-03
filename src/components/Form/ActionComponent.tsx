import React, { useCallback, useContext, useEffect, useState } from "react";
import { MapBrowserEvent } from "ol";
import Feature from "ol/Feature";
import { toLonLat } from "ol/proj";

import { reverseGeocode } from "../../requests/geoapify/input";
import { AddressResult } from "../../requests/geoapify/types";
import { calculateRoute } from "../../requests/route";
import { Destinations, DestinationType } from "../../types/route.types";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import MapContext from "../MapComponent/MapContext";
import { RoutePoints } from "../RoutePoints";
import { ShowRoute } from "../ShowRoute";

import "../components.css";

export const ActionComponent = () => {
  const { map, startLayer, endLayer, stopsLayer, routeLayer } =
    useContext(MapContext);

  const [destinations, setDestinations] = useState<Destinations>({
    start: undefined,
    end: undefined,
    stops: [],
  });

  const destinationLayers = {
    start: startLayer,
    end: endLayer,
    stops: stopsLayer,
  };

  const updateDestinations = (
    searchResult: AddressResult,
    pointType: DestinationType
  ) => {
    const point = addPointToLayer(searchResult, destinationLayers[pointType]);
    setDestinations({
      ...destinations,
      ...(pointType === "start" && { start: point }),
      ...(pointType === "end" && { end: point }),
      ...(pointType === "stops" && { stops: [...destinations.stops, point] }),
    });
  };

  const [calculatedRoute, setCalculatedRoute] = useState(null);

  const addStartFromSearch = (searchResult: AddressResult) => {
    const point = addPointToLayer(searchResult, startLayer);
    setDestinations({ ...destinations, start: point });
  };

  const addEndFromSearch = (searchResult: AddressResult) => {
    const point = addPointToLayer(searchResult, endLayer);
    setDestinations({ ...destinations, end: point });
  };

  const addRoutePointFromSearch = (searchResult: AddressResult) => {
    if (destinations.stops.length < 48) {
      const point = addPointToLayer(searchResult, stopsLayer, false);
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
    const { start } = destinations;
    if (start) {
      endLayer.clear();
      endLayer.addFeature(start);
      setDestinations({
        ...destinations,
        end: start,
      });
    }
  };

  const addPointOnClick = useCallback(
    (e: MapBrowserEvent) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        let point;
        if (!destinations.start) {
          point = addPointToLayer(searchResult, startLayer);
          setDestinations({
            ...destinations,
            start: point,
          });
        } else if (!destinations.end) {
          point = addPointToLayer(searchResult, endLayer);
          setDestinations({
            ...destinations,
            end: point,
          });
        } else {
          if (destinations.stops.length < 48) {
            point = addPointToLayer(searchResult, stopsLayer, false);
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
              destinations={destinations}
              copyEndFromStart={copyEndFromStart}
              clearStopsFunction={clearAllStops}
            />
          </div>
        )}
        {!calculatedRoute &&
          destinations.start &&
          destinations.end &&
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
          destinations.start &&
          destinations.end &&
          !!destinations.stops.length && (
            <ShowRoute
              route={calculatedRoute}
              destinations={destinations}
              exitFunction={cancelRoute}
            />
          )}
      </div>
    </div>
  );
};
