import React, { useState } from 'react';
import { addressSearch } from '../requests/addressSearch';
import { formatAddress } from '../requests/formatAddress';

type RoutePointsProps = {
  start: number[] | undefined;
  end: number[] | undefined;
  stops: number[][];
  updateStartFunction: (location: any) => void;
  updateEndFunction: (location: any) => void;
  addStopsFunction: (location: any) => void;
};

export const RoutePoints = ({
  start,
  end,
  stops,
  updateStartFunction,
  updateEndFunction,
  addStopsFunction,
}: RoutePointsProps) => {
  const [stopsList, setStopsList] = useState<string[]>([]);

  const handleAddressInput = async (
    e: { key: string; target: any },
    item: string
  ) => {
    if (e.key === 'Enter') {
      addressSearch(e.target.value).then((r) => {
        if (r) {
          r.displayAddress = formatAddress(r.address);
          e.target.value = item === 'stops' ? '' : r.displayAddress;
          updateState(r, item);
        } else {
          alert(
            'No address found. Please check for typos and/or add details (city, region, country)'
          );
        }
      });
    }
  };

  const updateState = (r: any, item: string) => {
    if (item === 'start') {
      updateStartFunction(r);
    } else if (item === 'end') {
      updateEndFunction(r);
    } else if (item === 'stops') {
      addStopsFunction(r);
      setStopsList([...stopsList, r.displayAddress]);
    }
  };

  const placeHolderTxt = 'Search an address';

  return (
    <div>
      <div>Starting point:</div>
      <input
        type="text"
        onKeyDown={(e) => handleAddressInput(e, 'start')}
        placeholder={placeHolderTxt}
      />
      <div>Ending point:</div>
      <input
        type="text"
        onKeyDown={(e) => handleAddressInput(e, 'end')}
        placeholder={placeHolderTxt}
      />
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
          {stopsList.map((s, i) => (
            <input type="text" key={i + 1} value={s} disabled={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
