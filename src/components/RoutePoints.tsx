import { Feature } from 'ol';
import React from 'react';
import { addressSearch } from '../requests/geoapify';
import { formatAddress } from '../requests/formatAddress';

type RoutePointsProps = {
  updateStartFunction: (location: any) => void;
  updateEndFunction: (location: any) => void;
  addStopsFunction: (location: any) => void;
  removeStopsFunction: (stop: Feature) => void;
  stops: Feature[];
};

export const RoutePoints = ({
  updateStartFunction,
  updateEndFunction,
  addStopsFunction,
  removeStopsFunction,
  stops,
}: RoutePointsProps) => {
  // const [stopsList, setStopsList] = useState<string[]>([]);

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
      // setStopsList([...stopsList, r.displayAddress]);
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
          {stops.map((s, i) => (
            <div key={i + 1}>
              <input
                type="text"
                value={s.get('name')}
                disabled={true}
              />
              <span onClick={() => removeStopsFunction(s)}>&times;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
