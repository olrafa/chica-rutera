import { fromLonLat } from "ol/proj";

export const CARTO_URL =
  "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
  ' contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const INITIAL_ZOOM = 3;
export const MAX_ZOOM = 19;
export const IP_ZOOM = 13;

export const STROKE_COLOR = "#258";
export const STROKE_WIDTH = 2;

export const MAP_CENTER = fromLonLat([0, 0]);

// OpenLayers use WebMercator, but most APIs work with WGS84,
// so we need to convert coordinates in some places.
export const WGS84 = "EPSG:4326"; // https://epsg.io/4326
export const WEB_MERCATOR = "EPSG:3857"; // https://epsg.io/3857
