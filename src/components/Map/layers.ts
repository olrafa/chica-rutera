import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Stroke, Style } from 'ol/style';

import { CARTO_ATTRIBUTION, CARTO_URL, INITIAL_ZOOM, MAP_CENTER, MAX_ZOOM } from './constants';

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

export const createMap = (target: HTMLDivElement) =>
  new Map({
    target,
    layers: [tileLayer],
    view: new View({
      center: MAP_CENTER,
      zoom: INITIAL_ZOOM,
      maxZoom: MAX_ZOOM,
    }),
  });
