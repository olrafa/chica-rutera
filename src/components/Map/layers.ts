import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";

import {
  CARTO_ATTRIBUTION,
  CARTO_URL,
  END_LAYER,
  INITIAL_ZOOM,
  MAP_CENTER,
  MAX_ZOOM,
  ROUTE_LAYER,
  START_LAYER,
  STOPS_LAYER,
} from "./constants";
import { createStyle } from "./util";

export const createRouteVector = (name: string) => {
  const layer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({
        width: 6,
        color: [85, 170, 255, 0.6],
      }),
    }),
  });
  layer.set("name", name);
  return layer;
};

const tileLayer = new TileLayer({
  source: new XYZ({
    url: CARTO_URL,
    attributions: CARTO_ATTRIBUTION,
    attributionsCollapsible: false,
    maxZoom: MAX_ZOOM,
  }),
});

const createPointVector = (
  color: string,
  zIndex: number,
  name: string
): VectorLayer => {
  const layer = new VectorLayer({
    source: new VectorSource(),
    style: createStyle(color),
    zIndex,
  });
  layer.set("name", name);
  return layer;
};

const startVector = createPointVector("#5FA", 12, START_LAYER);
const endVector = createPointVector("#F08", 11, END_LAYER);
const stopsVector = createPointVector("#0AA", 10, STOPS_LAYER);
const routeVector = createRouteVector(ROUTE_LAYER);

export const MAP_SOURCES = [
  startVector.getSource(),
  endVector.getSource(),
  stopsVector.getSource(),
  routeVector.getSource(),
];

export const createMap = (target: HTMLDivElement) =>
  new Map({
    target,
    layers: [tileLayer, startVector, endVector, stopsVector, routeVector],
    view: new View({
      center: MAP_CENTER,
      zoom: INITIAL_ZOOM,
      maxZoom: MAX_ZOOM,
    }),
  });
