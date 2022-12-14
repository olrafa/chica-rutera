import React, { ReactElement, useEffect, useRef, useState } from "react";
import "ol/ol.css";
import "./index.css";
import { Map } from "ol";
import { createMap } from "./layers";
import { zoomToUserArea } from "./view";
import { ActionComponent } from "../ActionComponent";
import { PageInfo } from "../PageInfo";

const MapComponent = (): ReactElement => {
  const [map, setMap] = useState<Map>();
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapElement.current) {
      setMap(createMap(mapElement.current));
    }
  }, []);

  useEffect(() => {
    if (map) {
      zoomToUserArea(map);
    }
  }, [map]);

  return (
    <>
      <div ref={mapElement} className="ol-map" />
      {map && <ActionComponent map={map} />}
      <PageInfo />
    </>
  );
};

export default MapComponent;
