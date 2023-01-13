import { ReactElement } from "react";

import { RouteStep } from "../../api/openRouteService/types";
import useGetRoutePoints from "../../hooks/useGetRoutePoints";

import RouteStepBox from "./RouteStepBox";

type RouteStepListProps = {
  routeSteps: RouteStep[];
};

const RouteStepList = ({ routeSteps }: RouteStepListProps): ReactElement => {
  const { stops: userStops } = useGetRoutePoints();
  return (
    <>
      {routeSteps
        .filter(({ type }) => type === "job")
        .map(({ id }, i: number) => {
          const mapFeature =
            userStops.find((userStop) => id === userStop.getId()) ||
            userStops[0];
          const displayName = userStops
            .find((userStop) => id === userStop.getId())
            ?.get("name");
          return (
            <RouteStepBox mapFeature={mapFeature} key={id}>
              <b>Stop {i + 1}</b>: {displayName}
            </RouteStepBox>
          );
        })}
    </>
  );
};

export default RouteStepList;
