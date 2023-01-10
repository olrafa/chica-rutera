import { ReactElement, useContext } from "react";

import MapContext from "../MapComponent/MapContext";

import searchForAddress from "./searchAndAddPoint";
import { DestinationType } from "./types";

type FileUploaderProps = {
  updateFunction: (destinationType: DestinationType) => void;
};

const FileUploader = ({ updateFunction }: FileUploaderProps): ReactElement => {
  const { map, stopsLayer } = useContext(MapContext);

  const fileHandler = (files: FileList | null) => {
    const file = files && files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) =>
        e && e.target && addPointsFromFile(e.target.result as string);
      reader.onerror = () => console.log("error reading file");
    }
  };

  const addPointsFromFile = (text: string) => {
    const addresses = text
      .split("\n")
      .filter((a) => a)
      .map((a) => a.replace(/;/g, ", "));
    const addressList = Array.from(new Set(addresses));
    searchAddressesArray(addressList);
  };

  const searchAddressesArray = (addresses: string[]) => {
    for (const address of addresses) {
      setTimeout(
        () =>
          searchForAddress(address, "stops", map, stopsLayer, updateFunction),
        500
      );
    }
  };

  return (
    <div className="search-item">
      <label htmlFor="uploader">Or upload a file (txt/csv):</label>
      <input
        id="uploader"
        type="file"
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
