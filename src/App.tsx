// react
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

// openlayers
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

import { ActionComponent } from './components/ActionComponent';

function App() {
  const [map, setMap] = useState<any | null>(null);

  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapElement.current) {
      const initialMap = new Map({
        target: mapElement.current,
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({
          center: fromLonLat([-58.43, -34.63]),
          zoom: 12,
          maxZoom: 20,
        }),
      });

      setMap(initialMap);
    }
  }, []);

  return (
    <div className="App">
      <div ref={mapElement} className="ol-map"></div>
      {/* <ActionComponent map={map} /> */}
    </div>
  );
}

export default App;
