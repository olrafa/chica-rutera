import { Feature, Map } from "ol";
import { Coordinate } from "ol/coordinate";
import Polyline from "ol/format/Polyline";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

import { AddressResult } from "../../api/geoapify/types";
import { RouteDetail } from "../../api/openRouteService/types";

import { STROKE_COLOR, STROKE_WIDTH } from "./constants";

const MAP_ZOOM_TO_RESULT = 15;

export const updateMapView = (map: Map, coords: Coordinate): void => {
  map.getView().setCenter(fromLonLat(coords));
  map.getView().setZoom(MAP_ZOOM_TO_RESULT);
};

export const changeFeatureStyle = (mapFeature: Feature, highlight?: boolean) =>
  mapFeature.setStyle(highlight ? createStyle("yellow") : undefined);

export const getRoutesAsLines = (routes: RouteDetail[]) =>
  routes.map(
    ({ geometry }) =>
      new Feature({
        type: "route",
        geometry: new Polyline().readGeometry(geometry, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      })
  );

export const createStyle = (color: string) =>
  new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color }),
      stroke: new Stroke({
        color: STROKE_COLOR,
        width: STROKE_WIDTH,
      }),
    }),
  });

const createPoint = (coordinate: Coordinate, formatted?: string) =>
  new Feature({
    type: "geoMarker",
    geometry: new Point(coordinate),
    name: formatted,
  });

const createRoutePoint = ({ formatted, lon, lat }: AddressResult) => {
  const coordinate = fromLonLat([lon, lat]);
  return createPoint(coordinate, formatted);
};

export const addPointToLayer = (
  searchResult: AddressResult,
  layer: VectorSource,
  clearLayer = true
): void => {
  const point = createRoutePoint(searchResult);
  point.setId(Date.now());
  clearLayer && layer.clear();
  layer.addFeature(point);
};
