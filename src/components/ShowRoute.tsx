import React, { useContext } from "react";
import Feature from "ol/Feature";
import Polyline from "ol/format/Polyline";
import Geometry from "ol/geom/Geometry";

import { RouteDetail, RouteInfo, RouteStep } from "../types/route.types";

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

  const canRouteBeCalculated = start && end && !!stops.length;

  const routeLines = routes.map(({ geometry }: any) => {
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

  const routesDisplay = routes.map((r: RouteDetail) => {
    const { cost, distance, duration, service, steps } = r;
    return {
      cost,
      distance,
      duration,
      service,
      start: steps.find((s) => s.type === "start"),
      end: steps.find((s) => s.type === "end"),
      steps: steps
        .filter((s) => s.type === "job")
        .map((s) => {
          s.displayName = stops.find((f) => s.id === f.getId())?.get("name");
          return s;
        }),
    };
  });

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

  if (!canRouteBeCalculated) {
    return null;
  }

  return (
    <div>
      <div>Route ready</div>
      {routesDisplay.map((rd: RouteDetail, i: number) => {
        return (
          <div key={i}>
            {/* Route {i + 1} */}
            <div
              className="route-address"
              onMouseEnter={() => changeFeatureStyle(start, true)}
              onMouseLeave={() => changeFeatureStyle(start)}
            >
              <b>Start:</b> {start ? start.get("name") : "Starting point"}
            </div>
            {rd.steps.map((s: RouteStep, i: number) => {
              const mapFeature = stops.find((f) => s.id === f.getId());
              return (
                <div
                  key={i + 1}
                  className="route-address"
                  onMouseEnter={() => changeFeatureStyle(mapFeature, true)}
                  onMouseLeave={() => changeFeatureStyle(mapFeature)}
                >
                  <b>Stop {i + 1}</b>: {s.displayName}
                </div>
              );
            })}
            <div
              className="route-address"
              onMouseEnter={() => changeFeatureStyle(end, true)}
              onMouseLeave={() => changeFeatureStyle(end)}
            >
              <b>End:</b> {end ? end.get("name") : "Ending point"}
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
        );
      })}
    </div>
  );
};
