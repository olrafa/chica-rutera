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

  const handleKeyDownStart = async (e: { key: string; target: any }) => {
    if (e.key === 'Enter') {
      addressSearch(e.target.value).then((r) => {
        e.target.value = formatAddress(r.address);
        updateStartFunction(r);
      });
    }
  };

  const handleKeyDownEnd = async (e: { key: string; target: any }) => {
    if (e.key === 'Enter') {
      addressSearch(e.target.value).then((r) => {
        e.target.value = formatAddress(r.address);
        updateEndFunction(r);
      });
    }
  };

  const handleKeyDownStop = async (e: { key: string; target: any }) => {
    if (e.key === 'Enter') {
      addressSearch(e.target.value).then((r) => {
        e.target.value = '';
        addStopsFunction(r);
        setStopsList([...stopsList, formatAddress(r.address)]);
      });
    }
  };

  return (
    <div>
      <div>Starting point:</div>
      <input type="text" onKeyDown={handleKeyDownStart} />
      <div>Ending point:</div>
      <input type="text" onKeyDown={handleKeyDownEnd} />
      <div>
        Add stops:
        <div>
          <input type="text" onKeyDown={handleKeyDownStop} />
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
