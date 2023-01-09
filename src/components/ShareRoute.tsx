import waLogo from "../images/WhatsApp_Logo.png";
import { RouteDetail } from "../requests/openRouteService/types";

type ShareRouteProps = {
  route: RouteDetail;
};

export const ShareRoute = ({ route }: ShareRouteProps) => {
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

  const googleLink = googleUrl + origin + destination + travelmode + waypoints;
  const whatsApp = `https://wa.me/?text=${encodeURIComponent(googleLink)}`;

  return (
    <div>
      <div className="option-btn" onClick={() => window.open(googleLink)}>
        Open route in GoogleMaps
      </div>
      <div className="option-btn social">
        <span className="social-btn">Share driving directions</span>
        <img
          className="social-logos"
          src={waLogo}
          alt="WhatsApp logo"
          onClick={() => window.open(whatsApp)}
        />
      </div>
    </div>
  );
};
