import { Feature, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';
import React, { useEffect, useState } from 'react';
import { addressSearch } from '../requests/geoapify';

type RoutePointsProps = {
  updateStartFunction: (location: any) => void;
  updateEndFunction: (location: any) => void;
  addStopsFunction: (location: any) => void;
  removeStopsFunction: (stop: Feature) => void;
  stops: Feature[];
  currentStart: string;
  currentEnd: string;
  map: Map;
  copyEndFromStart: () => void;
  clearStopsFunction: () => void;
};

type GeocoderResponse = {
  formatted: string;
  lat: number;
  lon: number;
}

export const RoutePoints = ({
  updateStartFunction,
  updateEndFunction,
  addStopsFunction,
  removeStopsFunction,
  stops,
  map,
  currentStart,
  currentEnd,
  copyEndFromStart,
  clearStopsFunction,
}: RoutePointsProps) => {
  const handleAddressInput = async (
    e: { key: string; target: any },
    item: string
  ) => {
    e.key === 'Enter' && searchForAddress(e.target.value, item, e.target);
  };

  const searchForAddress = (
    value: string,
    item: string,
    elementToUpdate?: { value: string } | undefined
  ) => {
    let mapCenter = [0, 0];
    const viewCenter = map.getView().getCenter();
    if (viewCenter !== undefined) {
      mapCenter = toLonLat(viewCenter);
    }

    const [lon, lat] = mapCenter;
    addressSearch(value, lon, lat).then((r: GeocoderResponse) => {
      if (r) {
        if (elementToUpdate) {
          elementToUpdate.value = item === 'stops' ? '' : r.formatted;
        }
        updateState(r, item);
        const point = [r.lon, r.lat];
        map.getView().setCenter(fromLonLat(point) as Coordinate);
        map.getView().setZoom(15);
      } else {
        alert(
          'No address found. Please check for typos and/or add details (city, region, country)'
        );
      }
    });
  };

  const updateState = (r: any, item: string) => {
    if (item === 'start') {
      updateStartFunction(r);
    } else if (item === 'end') {
      updateEndFunction(r);
    } else if (item === 'stops') {
      addStopsFunction(r);
    }
  };

  const placeHolderTxt = 'Search for an address';

  const fileHandler = (files: FileList | null) => {
    const file = files && files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (e) =>
        e && e.target && addPointsFromFile(e.target.result as string);
      reader.onerror = () => console.log('error reading file');
    }
  };

  const [addressesFromFile, setAddressesFromFile] = useState<string[]>([]);

  const addPointsFromFile = (text: string) => {
    const addresses = text
      .split('\n')
      .filter((a) => a)
      .map((a) => a.replace(/;/g, ', '));
    setAddressesFromFile(Array.from(new Set(addresses)));
  };

  useEffect(() => {
    if (addressesFromFile.length) {
      const nextAddress = addressesFromFile.pop();
      setTimeout(() => searchForAddress(nextAddress as string, 'stops'), 500);
    }
  }, [stops, addressesFromFile]);

  return (
    <div>
      <div className="search-item">
        <label htmlFor="search-start">Starting point:</label>
        <input
          id="search-start"
          type="text"
          onKeyDown={(e) => handleAddressInput(e, 'start')}
          placeholder={placeHolderTxt}
          defaultValue={currentStart || ''}
        />
      </div>
      <div className="search-item">
        <label htmlFor="search-end">Ending point:</label>
        <input
          id="search-end"
          type="text"
          onKeyDown={(e) => handleAddressInput(e, 'end')}
          placeholder={placeHolderTxt}
          defaultValue={currentEnd || ''}
        />
        {currentStart && (
          <span className="repeat-start-btn" onClick={copyEndFromStart}>
            Same as start
          </span>
        )}
      </div>
      <div>
        <div className="search-item">
          <label htmlFor="search-stops">Add stops:</label>
          <input
            id="search-stops"
            type="text"
            onKeyDown={(e) => handleAddressInput(e, 'stops')}
            placeholder={placeHolderTxt}
          />
        </div>
        <div className="search-item">
          <label htmlFor="uploader">Or upload a file (txt/csv):</label>
          <input
            id="uploader"
            type="file"
            multiple={false}
            accept={
              '.csv, text/plain,' +
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, ' +
              'application/vnd.ms-excel'
            }
            onChange={(e) => fileHandler(e.target.files)}
          />
        </div>
        {stops.length === 48 && (
          <div>Maximum number of points (48) reached.</div>
        )}
        <div>
          {stops.map((s, i) => (
            <div key={i + 1}>
              <input type="text" value={s.get('name')} disabled={true} />
              <span onClick={() => removeStopsFunction(s)}>&times;</span>
            </div>
          ))}
          {stops.length > 1 && (
            <div className="option-btn" onClick={clearStopsFunction}>
              Clear all stops
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
