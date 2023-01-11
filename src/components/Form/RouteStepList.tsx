import { ReactElement } from "react";

import { RouteStep } from "../../requests/openRouteService/types";

import RouteStepBox from "./RouteStepBox";
import useGetRoutePoints from "./useGetRoutePoints";

type RouteStepListProps = {
  routeSteps: RouteStep[];
};

const RouteStepList = ({ routeSteps }: RouteStepListProps): ReactElement => {
  const { stops: userStops } = useGetRoutePoints();
  return (
    <>
      {routeSteps
        .filter((routeStep) => routeStep.type === "job")
        .map((routeStep, i: number) => {
          const mapFeature =
            userStops.find((userStop) => routeStep.id === userStop.getId()) ||
            userStops[0];
          const displayName = userStops
            .find((userStop) => routeStep.id === userStop.getId())
            ?.get("name");
          return (
            <RouteStepBox mapFeature={mapFeature} key={routeStep.id}>
              <b>Stop {i + 1}</b>: {displayName}
            </RouteStepBox>
          );
        })}
    </>
  );
};

export default RouteStepList;
