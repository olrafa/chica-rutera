import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { AddressResult } from "../../requests/geoapify/types";

import { STROKE_COLOR, STROKE_WIDTH } from "./constants";

const createPoint = (coordinate: Coordinate, formatted?: string) =>
  new Feature({
    type: "geoMarker",
    geometry: new Point(coordinate),
    name: formatted,
  });

export const createRoutePoint = ({ formatted, lon, lat }: AddressResult) => {
  const coordinate = fromLonLat([lon, lat]);
  return createPoint(coordinate, formatted);
};

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
