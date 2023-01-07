import { Map } from "ol";
import Geometry from "ol/geom/Geometry";
import { toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";

import { addressSearch } from "../../requests/geoapify/input";
import { DestinationType } from "../../types/route.types";
import { addPointToLayer } from "../MapComponent/addPointToLayer";
import { updateMapView } from "../MapComponent/util";

const searchForAddress = (
  value: string,
  item: DestinationType,
  map: Map,
  layer: VectorSource<Geometry>,
  callback: (item: DestinationType) => void
) => {
  const viewCenter = map.getView().getCenter();
  const [lon, lat] = toLonLat(viewCenter || [0, 0]);
  addressSearch({ address: value, lon, lat }).then((result) => {
    if (result) {
      addPointToLayer(result, layer, item !== "stops");
      updateMapView(map, [result.lon, result.lat]);
      callback(item);
    } else {
      alert(
        "No address found. Please check for typos and/or add details (city, region, country)"
      );
    }
  });
};

export default searchForAddress;
