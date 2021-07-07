import { Feature, View } from 'ol';
import { toLonLat } from 'ol/proj';
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
  mapView: View;
  copyEndFromStart: () => void;
};

export const RoutePoints = ({
  updateStartFunction,
  updateEndFunction,
  addStopsFunction,
  removeStopsFunction,
  stops,
  mapView,
  currentStart,
  currentEnd,
  copyEndFromStart,
}: RoutePointsProps) => {
  const handleAddressInput = async (
    e: { key: string; target: any },
    item: string
  ) => {
    e.key === 'Enter' && searchForAddress(e.target.value, item);
  };

  const searchForAddress = (value: string, item: string) => {
    let mapCenter = [0, 0];
    const viewCenter = mapView.getCenter();
    if (viewCenter !== undefined) {
      mapCenter = toLonLat(viewCenter);
    }

    const [lon, lat] = mapCenter;
    addressSearch(value, lon, lat).then((r) => {
      if (r) {
        // r.displayAddress = formatAddress(r.address);
        value = item === 'stops' ? '' : r.formatted;
        updateState(r, item);
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

  const placeHolderTxt = 'Search an address';

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
    console.log(addresses);
    setAddressesFromFile(addresses);
  };

  useEffect(() => {
    if (addressesFromFile.length) {
      const nextAddress = addressesFromFile.pop();
      setTimeout(() => searchForAddress(nextAddress as string, 'stops'), 500);
    }
  }, [stops, addressesFromFile]);

  return (
    <div>
      <div>Starting point:</div>
      <input
        type="text"
        onKeyDown={(e) => handleAddressInput(e, 'start')}
        placeholder={placeHolderTxt}
        defaultValue={currentStart || ''}
      />
      <div>Ending point:</div>
      <input
        type="text"
        onKeyDown={(e) => handleAddressInput(e, 'end')}
        placeholder={placeHolderTxt}
        defaultValue={currentEnd || ''}
      />
      {currentStart && <span onClick={copyEndFromStart}>Same as start</span>}
      <div>
        Add stops:
        <div>
          <input
            type="text"
            onKeyDown={(e) => handleAddressInput(e, 'stops')}
            placeholder={placeHolderTxt}
          />
        </div>
        <div>
          Or upload a file
          <input
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
        {stops.length === 48 && <div>maximum number of points reached.</div>}
        <div>
          {stops.map((s, i) => (
            <div key={i + 1}>
              <input type="text" value={s.get('name')} disabled={true} />
              <span onClick={() => removeStopsFunction(s)}>&times;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
