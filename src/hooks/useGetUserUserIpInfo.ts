import { useQuery } from "@tanstack/react-query";

import { GEOAPIFY_IP_INFO } from "../requests/geoapify/constants";
import { IpInfoResponse } from "../requests/geoapify/types";
import convertTimeToMilliseconds from "../util/convertTimeToMilliseconds";

const useGetUserIpInfo = () =>
  useQuery(["ipInfo"], getIpInfo, {
    onError: (error) => console.log("Error getting IP Info", error),
    staleTime: convertTimeToMilliseconds(2, "hours"),
  });

/**
 * Gets the user's IP info to zoom the map to their area when opening the app.
 * @returns the result of the query
 */
const getIpInfo = async (): Promise<IpInfoResponse> => {
  const data = await fetch(GEOAPIFY_IP_INFO, {
    method: "GET",
  });
  const response = await data.json();
  return response;
};

export default useGetUserIpInfo;
