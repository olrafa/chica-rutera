import React, { useContext } from "react";
import Feature from "ol/Feature";
import Polyline from "ol/format/Polyline";
import Geometry from "ol/geom/Geometry";

import { RouteInfo } from "../types/route.types";

import { createStyle } from "./MapComponent/createStyle";
import MapContext from "./MapComponent/MapContext";
import { ShareRoute } from "./ShareRoute";

export const ShowRoute = ({ route, exitFunction }: RouteInfo) => {
  const { map, routeLayer, startLayer, stopsLayer, endLayer } =
    useContext(MapContext);
  const [start] = startLayer.getFeatures();
  const [end] = endLayer.getFeatures();
  const stops = stopsLayer.getFeatures();
  const { routes } = route;

  const routeLines = routes.map(({ geometry }) => {
    const trace = new Polyline().readGeometry(geometry, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    return new Feature({
      type: "route",
      geometry: trace,
    });
  });

  routeLines.forEach((line: Feature<Geometry>) => routeLayer.addFeature(line));

  const zoomToRoute = () =>
    map.getView().fit(routeLayer.getExtent(), {
      size: map.getSize(),
      padding: [50, 50, 50, 450],
    });

  zoomToRoute();

  const changeFeatureStyle = (
    mapFeature: Feature | undefined,
    add?: boolean
  ) => {
    mapFeature?.setStyle(add ? createStyle("yellow") : undefined);
  };

  const secondsToHours = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    const hDisplay = h ? h + (h === 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m ? m + (m === 1 ? " minute, " : " minutes ") : "";
    return hDisplay + mDisplay;
  };

  return (
    <div>
      <div>Route ready</div>
      {routes.map((rd) => (
        <div key="main-route">
          <div
            className="route-address"
            onMouseEnter={() => changeFeatureStyle(start, true)}
            onMouseLeave={() => changeFeatureStyle(start)}
          >
            <b>Start:</b> {start?.get("name") || "Starting point"}
          </div>
          {rd.steps
            .filter((step) => step.type === "job")
            .map((s, i: number) => {
              const mapFeature = stops.find((f) => s.id === f.getId());
              const displayName = stops
                .find((f) => s.id === f.getId())
                ?.get("name");
              return (
                <div
                  key={s.id}
                  className="route-address"
                  onMouseEnter={() => changeFeatureStyle(mapFeature, true)}
                  onMouseLeave={() => changeFeatureStyle(mapFeature)}
                >
                  <b>Stop {i + 1}</b>: {displayName}
                </div>
              );
            })}
          <div
            className="route-address"
            onMouseEnter={() => changeFeatureStyle(end, true)}
            onMouseLeave={() => changeFeatureStyle(end)}
          >
            <b>End:</b> {end?.get("name") || "Ending point"}
          </div>
          <div>Distance: {(rd.distance / 1000).toFixed(1)} km</div>
          <div>Travel time: {secondsToHours(rd.duration)}</div>
          <div className="option-btn" onClick={zoomToRoute}>
            Zoom to route
          </div>
          <ShareRoute route={rd} />
          <div className="option-btn" onClick={exitFunction}>
            Return
          </div>
        </div>
      ))}
    </div>
  );
};
