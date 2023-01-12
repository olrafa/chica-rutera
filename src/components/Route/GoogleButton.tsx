import { ReactElement } from "react";

import { RouteDetail } from "../../api/openRouteService/types";

import { createGoogleMapsUrl } from "./util";

type GoogleButtonProps = {
  route: RouteDetail;
};

const GoogleButton = ({ route }: GoogleButtonProps): ReactElement => (
  <div className="option-btn google">
    <a
      className="google-link"
      href={createGoogleMapsUrl(route)}
      target="_blank"
      rel="noreferrer"
    >
      Open on GoogleMaps
    </a>
  </div>
);

export default GoogleButton;
