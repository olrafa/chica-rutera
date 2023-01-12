import { ReactElement, ReactNode } from "react";

import { RoutePoint } from "../MainForm/types";
import { changeFeatureStyle } from "../MapComponent/util";

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
