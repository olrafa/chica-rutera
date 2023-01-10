import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";

const MAP_ZOOM_TO_RESULT = 15;

export const updateMapView = (map: Map, coords: Coordinate): void => {
  map.getView().setCenter(fromLonLat(coords));
  map.getView().setZoom(MAP_ZOOM_TO_RESULT);
};
