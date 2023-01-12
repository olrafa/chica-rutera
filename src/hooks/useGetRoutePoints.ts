import { useContext } from "react";

import MapContext from "../components/MapComponent/MapContext";

const useGetRoutePoints = () => {
  const { startLayer, endLayer, stopsLayer } = useContext(MapContext);

  const [start] = startLayer.getFeatures();
  const [end] = endLayer.getFeatures();
  const stops = stopsLayer.getFeatures();

  return { start, end, stops };
};

export default useGetRoutePoints;
