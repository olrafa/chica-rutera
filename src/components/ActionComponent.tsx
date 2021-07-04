import { createEmpty, extend, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { toLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import React, { useCallback, useEffect, useState } from 'react';
import { reverseGeocode } from '../requests/geoapify';
import { calculateRoute } from '../requests/route';
import { createRoutePoint } from '../utils/createPoints';
import './ActionComponent.css';
import { ActionComponentProps, RouteInfo } from './ActionComponent.types';
import { RoutePoints } from './RoutePoints';
import { ShowRoute } from './ShowRoute';

export const ActionComponent = ({
  map,
  startLayer,
  endLayer,
  stopsLayer,
  routeLayer,
}: ActionComponentProps) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({
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
    setRouteInfo({ ...routeInfo, startPoint: point });
  };

  const addEndFromSearch = (searchResult: any) => {
    const point = createRoutePoint(searchResult);
    endLayer.clear();
    endLayer.addFeature(point);
    setRouteInfo({ ...routeInfo, endPoint: point });
  };

  const addRoutePointFromSearch = (searchResult: any) => {
    const point = createRoutePoint(searchResult);
    stopsLayer.addFeature(point);
    setRouteInfo({
      ...routeInfo,
      stops: [...routeInfo.stops, point],
    });
  };

  const removeStopFromList = (stop: Feature) => {
    stopsLayer.removeFeature(stop);
    setRouteInfo({
      ...routeInfo,
      stops: routeInfo.stops.filter((s) => s !== stop),
    });
  };

  const addPointOnClick = useCallback(
    (e: any) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        console.log(searchResult);
        let point;
        if (!routeInfo.startPoint) {
          point = addFeatureFromSearch(searchResult, startLayer);
          setRouteInfo({ ...routeInfo, startPoint: point });
        } else if (!routeInfo.endPoint) {
          point = addFeatureFromSearch(searchResult, endLayer);
          setRouteInfo({ ...routeInfo, endPoint: point });
        } else {
          point = addFeatureFromSearch(searchResult, stopsLayer);
          setRouteInfo({
            ...routeInfo,
            stops: [...routeInfo.stops, point],
          });
        }
      });
    },
    [endLayer, routeInfo, startLayer, stopsLayer]
  );

  useEffect(() => {
    map && map.on('singleclick', addPointOnClick);
    return () => map.un('singleclick', addPointOnClick);
  }, [map, addPointOnClick]);

  useEffect(() => {
    if (
      map &&
      (routeInfo.startPoint || routeInfo.endPoint || routeInfo.stops.length)
    ) {
      let extent = createEmpty();
      [startLayer, endLayer, stopsLayer].forEach(function (layer) {
        layer.getFeatures.length && console.log(layer.getExtent());
        const layerExtent = layer.getExtent();
        extend(extent, layerExtent as Extent);
      });
      map.getView().fit(extent, { padding: Array(4).fill(150) });
    }
  }, [startLayer, endLayer, stopsLayer, map, routeInfo]);

  const optimize = async () => {
    routeLayer.clear();
    const route = await calculateRoute(routeInfo);
    route && setCalculatedRoute(route);
  };

  return (
    <div className="action-component">
      Create your best delivery route
      {!calculatedRoute && map && (
        <RoutePoints
          updateStartFunction={addStartFromSearch}
          updateEndFunction={addEndFromSearch}
          addStopsFunction={addRoutePointFromSearch}
          removeStopsFunction={removeStopFromList}
          stops={routeInfo.stops}
          mapView={map.getView()}
          currentStart={routeInfo.startPoint?.get('name') || ''}
          currentEnd={routeInfo.endPoint?.get('name') || ''}
        />
      )}
      {!calculatedRoute &&
        routeInfo.startPoint &&
        routeInfo.endPoint &&
        !!routeInfo.stops.length && (
          <div onClick={optimize}>Calculate Route</div>
        )}
      {calculatedRoute &&
        routeInfo.startPoint &&
        routeInfo.endPoint &&
        !!routeInfo.stops.length && (
          <ShowRoute
            route={calculatedRoute}
            map={map}
            lineLayer={routeLayer}
            startPoint={routeInfo.startPoint}
            endPoint={routeInfo.endPoint}
            stops={routeInfo.stops}
          />
        )}
    </div>
  );
};
