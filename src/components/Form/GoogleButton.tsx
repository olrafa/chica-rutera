import { ReactElement } from "react";

import { RouteDetail } from "../../requests/openRouteService/types";

import { createGoogleMapsUrl } from "./util";

type GoogleButtonProps = {
  route: RouteDetail;
};

const GoogleButton = ({ route }: GoogleButtonProps): ReactElement => {
  return (
    <div className="option-btn">
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
};

export default GoogleButton;
