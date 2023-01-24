import { ReactElement, useContext } from "react";
import { toast } from "react-toastify";

import { MAX_JOBS } from "../../api/geoapify/constants";
import useGetRoutePoints from "../../hooks/useGetRoutePoints";
import MapContext from "../MapComponent/MapContext";
import searchForAddress from "../MapComponent/searchAndAddPoint";
import { zoomToLayer } from "../MapComponent/util";

type FileUploaderProps = {
  updateFunction: () => void;
};

const FileUploader = ({ updateFunction }: FileUploaderProps): ReactElement => {
  const { map, stopsLayer } = useContext(MapContext);
  const { stops } = useGetRoutePoints();

  const stopsSpots = MAX_JOBS - stops.length;

  const fileHandler = (files: FileList | null) => {
    const file = files && files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) =>
        e && e.target && addPointsFromFile(e.target.result as string);
      reader.onerror = () => toast("Error reading file");
    }
  };

  const addPointsFromFile = (text: string) => {
    const addresses = text
      .split("\n")
      .filter((a) => a)
      .map((a) => a.replace(/;/g, ", "));
    const uniqueAddresses = Array.from(new Set(addresses));
    const addressesToSearch = getAddressesToSearch(uniqueAddresses);
    searchAddressesFromList(addressesToSearch);
  };

  const getAddressesToSearch = (allAddresses: string[]) =>
    allAddresses.slice(1, stopsSpots + 1); // +1 assuming the first line on the file is the header (for now)

  const searchAddressesFromList = (addresses: string[]) =>
    addresses.map((address) =>
      searchForAddress(address, "stops", map, stopsLayer, updateCallback)
    );

  const updateCallback = () => {
    updateFunction();
    zoomToLayer(map, stopsLayer);
  };

  return (
    <div className="search-item">
      <div className="field-title">Or upload a file (txt/csv):</div>
      <input
        type="file"
        className="file-upload"
        multiple={false}
        accept={
          ".csv, text/plain," +
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, " +
          "application/vnd.ms-excel"
        }
        onChange={(e) => fileHandler(e.target.files)}
      />
    </div>
  );
};

export default FileUploader;
