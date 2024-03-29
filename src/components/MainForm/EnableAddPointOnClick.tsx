import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MapBrowserEvent } from "ol";
import { toLonLat } from "ol/proj";

import { reverseGeocode } from "../../api/geoapify/requests";
import useCanAddMoreStops from "../../hooks/useCanAddMoreStops";
import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";
import { addPointToLayer } from "../MapComponent/util";

type EnableAddPointOnClickProps = {
  refreshLayerCallback: () => void;
};

const EnableAddPointOnClick = ({
  refreshLayerCallback,
}: EnableAddPointOnClickProps): ReactElement => {
  const { map, startLayer, endLayer, stopsLayer } = useContext(MapContext);
  const { start, end } = useGetRoutePoints();
  const [clickActive, setClickActive] = useState(false);

  const canAddMoreStops = useCanAddMoreStops();

  // Add points via click
  const addPointOnClick = useCallback(
    (e: MapBrowserEvent<UIEvent>) => {
      if (!canAddMoreStops) return;
      const { coordinate } = e;
      reverseGeocode(toLonLat(coordinate)).then((searchResult) => {
        if (!searchResult) return;
        if (!start) addPointToLayer(searchResult, startLayer);
        if (start && !end) addPointToLayer(searchResult, endLayer);
        if (start && end) addPointToLayer(searchResult, stopsLayer, false);

        refreshLayerCallback();
      });
    },
    [
      canAddMoreStops,
      start,
      end,
      startLayer,
      refreshLayerCallback,
      endLayer,
      stopsLayer,
    ],
  );

  useEffect(() => {
    clickActive && map.on("singleclick", addPointOnClick);
    return () => map.un("singleclick", addPointOnClick);
  }, [map, addPointOnClick, clickActive]);

  const getText = () => {
    const clickText = "Click on the map to";
    if (!start) return `${clickText} set a starting point`;
    if (!end) return `${clickText} set an ending point`;
    return `${clickText} add a stop`;
  };

  return (
    <>
      <div
        onClick={() => setClickActive(!clickActive)}
        className="map-click-btn"
      >
        {clickActive ? "Disable" : "Enable"} adding points from map click
      </div>
      {clickActive && (
        <div className="click-instruction">{clickActive && getText()}</div>
      )}
    </>
  );
};

export default EnableAddPointOnClick;
