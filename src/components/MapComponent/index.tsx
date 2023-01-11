import React, { ReactElement, useContext, useEffect, useRef } from "react";
import { fromLonLat } from "ol/proj";

import { MainForm } from "../Form/MainForm";

import { IP_ZOOM } from "./constants";
import MapContext from "./MapContext";
import useGetUserIpInfo from "./useGetUserUserIpInfo";

import "ol/ol.css";
import "./index.css";

const MapComponent = (): ReactElement => {
  const { map } = useContext(MapContext);
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect will attach the map to the node.
    // The !map.getTarget assertion will prevent it from adding a new map on every reload.
    if (mapElement.current && !map.getTarget()) {
      map.setTarget(mapElement.current);
    }
    // this must run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: userIpInfo } = useGetUserIpInfo();

  useEffect(() => {
    if (userIpInfo) {
      const { latitude, longitude } = userIpInfo.location;
      const userLocation = fromLonLat([longitude, latitude]);
      map.getView().setCenter(userLocation);
      map.getView().setZoom(IP_ZOOM);
    }
  }, [map, userIpInfo]);

  return (
    <>
      <div ref={mapElement} className="ol-map" />
      <MainForm />
    </>
  );
};

export default MapComponent;
