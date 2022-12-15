import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";

import {
  CARTO_ATTRIBUTION,
  CARTO_URL,
  INITIAL_ZOOM,
  MAP_CENTER,
  MAX_ZOOM,
} from "./constants";
import { createStyle } from "./util";

export const createRouteVector = () =>
  new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({
        width: 6,
        color: [85, 170, 255, 0.6],
      }),
    }),
  });

const tileLayer = new TileLayer({
  source: new XYZ({
    url: CARTO_URL,
    attributions: CARTO_ATTRIBUTION,
    attributionsCollapsible: false,
    maxZoom: MAX_ZOOM,
  }),
});

const createPointVector = (color: string, zIndex: number): VectorLayer =>
  new VectorLayer({
    source: new VectorSource(),
    style: createStyle(color),
    zIndex,
  });

const startVector = createPointVector("#5FA", 12);
const endVector = createPointVector("#F08", 11);
const stopsVector = createPointVector("#0AA", 10);
const routeVector = createRouteVector();

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
