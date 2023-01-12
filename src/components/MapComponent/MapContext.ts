import { createContext } from "react";
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

/**
 * This module will start up the map, the layers and the style.
 */

const createRouteVector = () =>
  new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({
        width: 6,
        color: [85, 170, 255, 0.6],
      }),
    }),
  });

const createPointVector = (color: string, zIndex: number): VectorLayer =>
  new VectorLayer({
    source: new VectorSource(),
    style: createStyle(color),
    zIndex,
  });

const startVector = createPointVector("#5FA", 11);
const endVector = createPointVector("#F08", 12);
const stopsVector = createPointVector("#0AA", 10);
const routeVector = createRouteVector();

const tileLayer = new TileLayer({
  source: new XYZ({
    url: CARTO_URL,
    attributions: CARTO_ATTRIBUTION,
    attributionsCollapsible: false,
    maxZoom: MAX_ZOOM,
  }),
});

const map = new Map({
  layers: [tileLayer, startVector, endVector, stopsVector, routeVector],
  view: new View({
    center: MAP_CENTER,
    zoom: INITIAL_ZOOM,
    maxZoom: MAX_ZOOM,
  }),
});

const mapData = {
  map,
  startLayer: startVector.getSource(),
  endLayer: endVector.getSource(),
  stopsLayer: stopsVector.getSource(),
  routeLayer: routeVector.getSource(),
};

// This context will create the map component to be used anywhere in the app.
// Since we only load the map once and it doesn't change, we will keep the default at all times.
// Thus we will NOT use a provider.
const MapContext = createContext(mapData);
export default MapContext;
