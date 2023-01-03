import VectorSource from "ol/source/Vector";

import { AddressResult } from "../../requests/geoapify/types";

import { createRoutePoint } from "./createRoutePoint";

export const addPointToLayer = (
  searchResult: AddressResult,
  layer: VectorSource,
  clearLayer = true
) => {
  const point = createRoutePoint(searchResult);
  clearLayer && layer.clear();
  layer.addFeature(point);
  return point;
};
