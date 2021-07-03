import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import { createEmpty, extend, Extent } from 'ol/extent';
import React, { useEffect, useState, useCallback } from 'react';
import { calculateRoute } from '../requests/route';
import './ActionComponent.css';
import { ShowRoute } from './ShowRoute';
import { RoutePoints } from './RoutePoints';
import { Coordinate } from 'ol/coordinate';
import { reverseGeocode } from '../requests/geoapify';

type ActionComponentProps = {
  map: Map;
  startLayer: VectorSource;
  endLayer: VectorSource;
  stopsLayer: VectorSource;
  routeLayer: VectorSource;
};

type RouteInfo = {
  startPoint: Feature | undefined;
  endPoint: Feature | undefined;
  stops: Feature[];
};

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

  const createPoint = (coordinate: Coordinate, formatted?: string) =>
    new Feature({
      type: 'geoMarker',
      geometry: new Point(coordinate),
      name: formatted,
    });

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

  const createRoutePoint = ({ formatted, lon, lat }: any) => {
    const coordinate = getCoordinates(lon, lat);
    return createPoint(coordinate, formatted);
  };

  const getCoordinates = (lon: string, lat: string) => {
    const lonLat = [lon, lat].map((c) => parseFloat(c));
    return fromLonLat(lonLat) as Coordinate;
  };

  const addPointOnClick = useCallback(
    (e: any) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        console.log(searchResult);
        if (!routeInfo.startPoint) {
          addStartFromSearch(searchResult);
        } else if (!routeInfo.endPoint) {
          addEndFromSearch(searchResult);
        } else {
          addRoutePointFromSearch(searchResult);
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
