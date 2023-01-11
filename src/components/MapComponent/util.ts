import { Feature, Map } from "ol";
import { Coordinate } from "ol/coordinate";
import Polyline from "ol/format/Polyline";
import { fromLonLat } from "ol/proj";

import { RouteDetail } from "../../requests/openRouteService/types";

import { createStyle } from "./createStyle";

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
