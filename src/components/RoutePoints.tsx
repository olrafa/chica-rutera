import React from 'react';
import { addressSearch } from '../requests/addressSearch';

type RoutePointsProps = {
  start: number[] | undefined;
  end: number[] | undefined;
  stops: number[][];
};

export const RoutePoints = ({ start, end, stops }: RoutePointsProps) => {
  const handleKeyDown = async (e: { key: string; target: any }) => {
    if (e.key === 'Enter') {
      const location = await addressSearch(e.target.value);
      console.log(location);
    }
  };

  return (
    <div>
      <div>Starting point:</div>
      <input type="text" onKeyDown={handleKeyDown} />
      <div>Ending point:</div>
      <input type="text" />
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
