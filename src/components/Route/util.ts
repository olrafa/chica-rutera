import { RouteStep } from "../../api/openRouteService/types";

export const createGoogleMapsUrl = (steps: RouteStep[]) => {
  const [start] = steps;
  const end = steps[steps.length - 1];

  const [startLon, startLat] = start.location;
  const [endLon, endLat] = end.location;

  const googleUrl = "https://www.google.com/maps/dir/?api=1";
  const origin = `&origin=${startLat},${startLon}`;
  const destination = `&destination=${endLat},${endLon}`;
  const travelmode = "&travelmode=driving";

  const waypoints =
    "&waypoints=" +
    steps
      .filter(({ type }) => type === "job")
      .map(({ location }) => {
        const [lon, lat] = location;
        return `${lat},${lon}`;
      })
      .join("%7C");

  return googleUrl + origin + destination + travelmode + waypoints;
};

export const secondsToHours = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const hDisplay = h ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m ? m + (m === 1 ? " minute, " : " minutes ") : "";
  return hDisplay + mDisplay;
};
