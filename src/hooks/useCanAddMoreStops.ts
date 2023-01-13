import { MAX_JOBS } from "../api/geoapify/constants";

import useGetRoutePoints from "./useGetRoutePoints";

const useCanAddMoreStops = () => {
  const { stops } = useGetRoutePoints();
  return stops.length < MAX_JOBS;
};

export default useCanAddMoreStops;
