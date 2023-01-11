import { ReactElement, ReactNode } from "react";

import { changeFeatureStyle } from "../MapComponent/util";

import { RoutePoint } from "./types";

type RouteStepBoxProps = {
  mapFeature: RoutePoint;
  children: ReactNode;
};

const RouteStepBox = ({
  mapFeature,
  children,
}: RouteStepBoxProps): ReactElement => (
  <div
    className="route-address"
    onMouseEnter={() => changeFeatureStyle(mapFeature, true)}
    onMouseLeave={() => changeFeatureStyle(mapFeature)}
  >
    {children}
  </div>
);

export default RouteStepBox;
