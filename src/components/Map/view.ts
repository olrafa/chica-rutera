import { Map } from 'ol';
import { fromLonLat } from 'ol/proj';

import { getIpInfo } from '../../requests/geoapify/output';
import { IP_ZOOM } from './constants';

export const zoomToUserArea = async (map: Map): Promise<void> => {
  const ipInfo = await getIpInfo();
  const { latitude, longitude } = ipInfo.location;
  const userLocation = fromLonLat([longitude, latitude]);
  map.getView().setCenter(userLocation);
  map.getView().setZoom(IP_ZOOM);
};
