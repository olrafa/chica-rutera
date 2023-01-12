import { RouteDetail } from "../../api/openRouteService/types";

export const createGoogleMapsUrl = (route: RouteDetail) => {
  const { steps } = route;

  const [start] = route.steps;
  const end = route.steps[route.steps.length - 1];

  const [startLon, startLat] = start.location;
  const [endLon, endLat] = end.location;

  const googleUrl = "https://www.google.com/maps/dir/?api=1";
  const origin = `&origin=${startLat},${startLon}`;
  const destination = `&destination=${endLat},${endLon}`;
  const travelmode = "&travelmode=driving";

  const waypoints =
    "&waypoints=" +
    steps
      .map((s) => {
        const [lon, lat] = s.location;
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
