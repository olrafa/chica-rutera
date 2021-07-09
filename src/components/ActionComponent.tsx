import { createEmpty, extend, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { toLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import React, { useCallback, useEffect, useState } from 'react';
import { reverseGeocode } from '../requests/geoapify';
import { calculateRoute } from '../requests/route';
import { ActionComponentProps, Destinations } from '../types/route.types';
import { createRoutePoint } from '../utils/createPoints';
import './components.css';
import { RoutePoints } from './RoutePoints';
import { ShowRoute } from './ShowRoute';

export const ActionComponent = ({
  map,
  startLayer,
  endLayer,
  stopsLayer,
  routeLayer,
}: ActionComponentProps) => {
  const [destinations, setDestinations] = useState<Destinations>({
    startPoint: undefined,
    endPoint: undefined,
    stops: [],
  });

  const [calculatedRoute, setCalculatedRoute] = useState(null);

  const addFeatureFromSearch = (searchResult: any, layer: VectorSource) => {
    const point = createRoutePoint(searchResult);
    layer !== stopsLayer && layer.clear();
    layer.addFeature(point);
    return point;
  };

  const addStartFromSearch = (searchResult: any) => {
    const point = createRoutePoint(searchResult);
    startLayer.clear();
    startLayer.addFeature(point);
    setDestinations({ ...destinations, startPoint: point });
  };

  const addEndFromSearch = (searchResult: any) => {
    const point = createRoutePoint(searchResult);
    endLayer.clear();
    endLayer.addFeature(point);
    setDestinations({ ...destinations, endPoint: point });
  };

  const addRoutePointFromSearch = (searchResult: any) => {
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
      setDestinations({ ...destinations, endPoint: startPoint });
    }
  };

  const addPointOnClick = useCallback(
    (e: any) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        let point;
        if (!destinations.startPoint) {
          point = addFeatureFromSearch(searchResult, startLayer);
          setDestinations({ ...destinations, startPoint: point });
        } else if (!destinations.endPoint) {
          point = addFeatureFromSearch(searchResult, endLayer);
          setDestinations({ ...destinations, endPoint: point });
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
    clickActive && map && map.on('singleclick', addPointOnClick);
    return () => map.un('singleclick', addPointOnClick);
  }, [map, addPointOnClick, clickActive]);

  useEffect(() => {
    if (
      map &&
      (destinations.startPoint ||
        destinations.endPoint ||
        destinations.stops.length)
    ) {
      const extent = createEmpty();
      [startLayer, endLayer, stopsLayer].forEach(function (layer) {
        layer.getFeatures.length && console.log(layer.getExtent());
        const layerExtent = layer.getExtent();
        extend(extent, layerExtent as Extent);
      });
      map.getView().fit(extent, { padding: Array(4).fill(200) });
    }
  }, [startLayer, endLayer, stopsLayer, map, destinations]);

  const optimize = async () => {
    routeLayer.clear();
    const route = await calculateRoute(destinations);
    route && setCalculatedRoute(route);
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
      Create your best delivery route
      {!calculatedRoute && (
        <div onClick={() => setClickActive(!clickActive)}>
          {clickActive
            ? 'Stop search from map click'
            : 'Add points as I click on the map'}
        </div>
      )}
      {!calculatedRoute && map && (
        <RoutePoints
          updateStartFunction={addStartFromSearch}
          updateEndFunction={addEndFromSearch}
          addStopsFunction={addRoutePointFromSearch}
          removeStopsFunction={removeStopFromList}
          stops={destinations.stops}
          mapView={map.getView()}
          currentStart={destinations.startPoint?.get('name') || ''}
          currentEnd={destinations.endPoint?.get('name') || ''}
          copyEndFromStart={copyEndFromStart}
          clearStopsFunction={clearAllStops}
        />
      )}
      {!calculatedRoute &&
        destinations.startPoint &&
        destinations.endPoint &&
        !!destinations.stops.length && (
          <div className="option-btn route" onClick={optimize}>
            Calculate Route
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
  );
};
