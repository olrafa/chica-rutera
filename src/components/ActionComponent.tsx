import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { createEmpty, extend, Extent } from 'ol/extent';
import React, { useEffect, useState, useCallback } from 'react';
import { calculateRoute } from '../requests/route';
import './ActionComponent.css';
import { ShowRoute } from './ShowRoute';
import { RoutePoints } from './RoutePoints';
import { Coordinate } from 'ol/coordinate';

type ActionComponentProps = {
  map: Map;
  startLayer: VectorSource;
  endLayer: VectorSource;
  stopsLayer: VectorSource;
  routeLayer: VectorSource;
};

type RouteInfo = {
  startPoint: Coordinate | undefined;
  endPoint: Coordinate | undefined;
  stops: Coordinate[];
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

  const { startPoint, endPoint, stops } = routeInfo;

  const [calculatedRoute, setCalculatedRoute] = useState(null);

  const createPoint = (coordinate: Coordinate, displayAddress?: string) =>
    new Feature({
      type: 'geoMarker',
      geometry: new Point(coordinate),
      name: displayAddress
    });

  const addPointOnClick = useCallback(
    (e: any) => {
      const { coordinate } = e;
      if (!routeInfo.startPoint) {
        startLayer.addFeature(createPoint(coordinate));
        setRouteInfo({ ...routeInfo, startPoint: coordinate });
      } else if (!routeInfo.endPoint) {
        endLayer.addFeature(createPoint(coordinate));
        setRouteInfo({ ...routeInfo, endPoint: coordinate });
      } else {
        stopsLayer.addFeature(createPoint(coordinate));
        setRouteInfo({
          ...routeInfo,
          stops: [...routeInfo.stops, [coordinate]],
        });
      }
    },
    [endLayer, routeInfo, startLayer, stopsLayer]
  );

  useEffect(() => {
    map && map.on('singleclick', addPointOnClick);
    return () => map.un('singleclick', addPointOnClick);
  }, [map, addPointOnClick]);

  const addStartFromSearch = ({ displayAddress, lon, lat }: any) => {
    // const { displayAddress } = searchResult;
    const coordinate = getCoordinates(lon, lat);
    startLayer.clear();
    startLayer.addFeature(createPoint(coordinate, displayAddress));
    setRouteInfo({ ...routeInfo, startPoint: coordinate });
  };

  const addEndFromSearch = ({ displayAddress, lon, lat }: any) => {
    const coordinate = getCoordinates(lon, lat);
    endLayer.clear();
    endLayer.addFeature(createPoint(coordinate,  displayAddress));
    setRouteInfo({ ...routeInfo, endPoint: coordinate });
  };

  const addRoutePointFromSearch = ({ displayAddress, lon, lat }: any) => {
    const coordinate = getCoordinates(lon, lat);
    stopsLayer.addFeature(createPoint(coordinate, displayAddress));
    setRouteInfo({
      ...routeInfo,
      stops: [...routeInfo.stops, coordinate],
    });
  };

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

  const getCoordinates = (lon: string, lat: string) => {
    const lonLat = [lon, lat].map((c) => parseFloat(c));
    return fromLonLat(lonLat) as Coordinate;
  };

  const optimize = async () => {
    routeLayer.clear();
    const route = await calculateRoute(startLayer, endLayer, stopsLayer);
    route && setCalculatedRoute(route);
  };

  return (
    <div className="action-component">
      Create your best delivery route
      <RoutePoints
        start={startPoint}
        end={endPoint}
        stops={stops}
        updateStartFunction={addStartFromSearch}
        updateEndFunction={addEndFromSearch}
        addStopsFunction={addRoutePointFromSearch}
      />
      <div onClick={optimize}>Calculate Route</div>
      {calculatedRoute && (
        <ShowRoute route={calculatedRoute} map={map} layer={routeLayer} />
      )}
    </div>
  );
};
