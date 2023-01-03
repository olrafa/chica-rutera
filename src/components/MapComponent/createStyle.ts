import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { STROKE_COLOR, STROKE_WIDTH } from "./constants";

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
