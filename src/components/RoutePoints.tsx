import React from 'react';
import { addressSearch } from '../requests/addressSearch';

type RoutePointsProps = {
  start: number[] | undefined;
  end: number[] | undefined;
  stops: number[][];
  updateStartFunction: (location: any) => void;
  updateEndFunction: (location: any) => void;
};

export const RoutePoints = ({
  start,
  end,
  stops,
  updateStartFunction,
  updateEndFunction
}: RoutePointsProps) => {

  const handleKeyDownStart = async (e: { key: string; target: any }) => {
    if (e.key === 'Enter') {
      addressSearch(e.target.value).then((r) => updateStartFunction(r));
    }
  };

  const handleKeyDownEnd = async (e: { key: string; target: any }) => {
    if (e.key === 'Enter') {
      addressSearch(e.target.value).then((r) => updateEndFunction(r));
    }
  };


  return (
    <div>
      <div>Starting point:</div>
      <input type="text" onKeyDown={handleKeyDownStart} />
      <div>Ending point:</div>
      <input type="text" onKeyDown={handleKeyDownEnd}/>
      <div>
        Route stops
        <div>
          {stops.map((s, i) => (
            <div key={i + 1}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
