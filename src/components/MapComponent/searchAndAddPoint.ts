import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { toast } from "react-toastify";

import { addressSearch } from "../../api/geoapify/requests";
import { DestinationType } from "../MainForm/types";

import { addPointToLayer, updateMapView } from "./util";

const getViewPortCoordinates = (map: Map): Coordinate =>
  toLonLat(map.getView().getCenter() || [0, 0]);

const searchForAddress = (
  value: string,
  item: DestinationType,
  map: Map,
  layer: VectorSource<Geometry>,
  callback: () => void
) => {
  const [lon, lat] = getViewPortCoordinates(map);
  addressSearch({ address: value, lon, lat }).then((addressResult) => {
    if (addressResult) {
      addPointToLayer(addressResult, layer, item !== "stops");
      updateMapView(map, [addressResult.lon, addressResult.lat]);
      callback();
    } else {
      toast.error(
        "No address found. Please check for typos and/or add details (city, region, country)"
      );
    }
  });
};

export default searchForAddress;
