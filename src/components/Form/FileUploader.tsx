import { ReactElement, useContext, useEffect, useState } from "react";

import { DestinationType } from "../../types/route.types";
import MapContext from "../MapComponent/MapContext";

import searchForAddress from "./searchAndAddPoint";

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

  const [addressesFromFile, setAddressesFromFile] = useState<string[]>([]);

  const addPointsFromFile = (text: string) => {
    const addresses = text
      .split("\n")
      .filter((a) => a)
      .map((a) => a.replace(/;/g, ", "));
    setAddressesFromFile(Array.from(new Set(addresses)));
  };

  useEffect(() => {
    if (addressesFromFile.length) {
      const nextAddress = addressesFromFile.pop() || "";
      setTimeout(
        () =>
          searchForAddress(
            nextAddress,
            "stops",
            map,
            stopsLayer,
            updateFunction
          ),
        500
      );
    }
  }, [addressesFromFile]);

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
