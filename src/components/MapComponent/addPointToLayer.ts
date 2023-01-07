import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";

import { AddressResult } from "../../requests/geoapify/types";

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
  clearLayer && layer.clear();
  layer.addFeature(point);
};
