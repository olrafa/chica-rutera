import { ReactElement } from "react";

type CalculateRouteButtonProps = {
  enabled: boolean;
  callback: () => void;
};

const CalculateRouteButton = ({
  enabled,
  callback,
}: CalculateRouteButtonProps): ReactElement | null => {
  if (enabled) {
    return (
      <div className="option-btn route" onClick={callback}>
        Calculate Route
      </div>
    );
  }

  return null;
};

export default CalculateRouteButton;
