import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import Geometry from "ol/geom/Geometry";
import { toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { toast } from "react-toastify";

import { addressSearch } from "../../api/geoapify/requests";
import { AddressResult } from "../../api/geoapify/types";
import { DestinationType } from "../MainForm/types";

import { addPointToLayer, updateMapView } from "./util";

const getViewPortCoordinates = (map: Map): Coordinate =>
  toLonLat(map.getView().getCenter() || [0, 0]);

const searchForAddress = async (
  value: string,
  item: DestinationType,
  map: Map,
  layer: VectorSource<Geometry>,
  callback: () => void
) => {
  const [lon, lat] = getViewPortCoordinates(map);
  const addressResult = await addressSearch({ address: value, lon, lat });
  addressResult
    ? processAddress(addressResult, layer, map, item !== "stops", callback)
    : toast.error(
        "No address found. Please check for typos and/or add details (city, region, country)"
      );
};

const processAddress = (
  addressResult: AddressResult,
  layer: VectorSource<Geometry>,
  map: Map,
  clearLayer: boolean,
  callback: () => void
) => {
  addPointToLayer(addressResult, layer, clearLayer);
  updateMapView(map, [addressResult.lon, addressResult.lat]);
  callback();
};

export default searchForAddress;
