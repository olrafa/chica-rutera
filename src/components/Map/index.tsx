import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Map } from "ol";
import { fromLonLat } from "ol/proj";

import { ActionComponent } from "../Form/ActionComponent";
import { PageInfo } from "../PageInfo";

import { IP_ZOOM } from "./constants";
import { createMap } from "./layers";
import useGetUserIpInfo from "./useGetUserUserIpInfo";

import "ol/ol.css";
import "./index.css";

const MapComponent = (): ReactElement => {
  const [map, setMap] = useState<Map>();
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect will build the map and attach it to the node.
    // The !map assertion will prevent a new map to be added on every reload.
    if (mapElement.current && !map) {
      setMap(createMap(mapElement.current));
    }
  }, [map]);

  const { data: userIpInfo } = useGetUserIpInfo();

  useEffect(() => {
    if (map && userIpInfo) {
      const { latitude, longitude } = userIpInfo.location;
      const userLocation = fromLonLat([longitude, latitude]);
      map.getView().setCenter(userLocation);
      map.getView().setZoom(IP_ZOOM);
    }
  }, [map, userIpInfo]);

  return (
    <>
      <div ref={mapElement} className="ol-map" />
      {map && <ActionComponent map={map} />}
      <PageInfo />
    </>
  );
};

export default MapComponent;
