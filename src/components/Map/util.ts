import { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { STROKE_COLOR, STROKE_WIDTH } from "./constants";

const createPoint = (coordinate: Coordinate, formatted?: string) =>
  new Feature({
    type: "geoMarker",
    geometry: new Point(coordinate),
    name: formatted,
  });

const getCoordinates = (lon: string, lat: string) => {
  const lonLat = [lon, lat].map((c) => parseFloat(c));
  return fromLonLat(lonLat) as Coordinate;
};

export const createRoutePoint = ({ formatted, lon, lat }: any) => {
  const coordinate = getCoordinates(lon, lat);
  return createPoint(coordinate, formatted);
};

export const createPointVector = (
  color: string,
  zIndex: number,
) =>
  new VectorLayer({
    source: new VectorSource(),
    style: createStyle(color),
    zIndex,
  });

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