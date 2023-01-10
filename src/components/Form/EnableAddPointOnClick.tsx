import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";

import { reverseGeocode } from "../../requests/geoapify/input";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import MapContext from "../MapComponent/MapContext";

import useGetRoutePoints from "./useGetRoutePoints";

type EnableAddPointOnClickProps = {
  refreshLayerCallback: () => void;
};

const EnableAddPointOnClick = ({
  refreshLayerCallback,
}: EnableAddPointOnClickProps): ReactElement => {
  const { map, startLayer, endLayer, stopsLayer } = useContext(MapContext);
  const { start, end } = useGetRoutePoints();
  const [clickActive, setClickActive] = useState(false);

  // Add points via click
  const addPointOnClick = useCallback(
    (e: MapBrowserEvent) => {
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        if (!searchResult) {
          return;
        }
        if (!start) {
          addPointToLayer(searchResult, startLayer);
          refreshLayerCallback();
        }

        if (start && !end) {
          addPointToLayer(searchResult, endLayer);
          refreshLayerCallback();
        }
        if (start && end) {
          addPointToLayer(searchResult, stopsLayer, false);
          refreshLayerCallback();
        }
      });
    },
    [start, startLayer, end, endLayer, stopsLayer, refreshLayerCallback]
  );

  useEffect(() => {
    clickActive && map.on("singleclick", addPointOnClick);
    return () => map.un("singleclick", addPointOnClick);
  }, [map, addPointOnClick, clickActive]);

  return (
    <div onClick={() => setClickActive(!clickActive)} className="map-click-btn">
      {clickActive ? "Disable" : "Enable"} adding points from map click
    </div>
  );
};

export default EnableAddPointOnClick;
