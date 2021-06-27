// react
import React, { useEffect, useRef, useState } from 'react';

// openlayers
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

// css
import 'ol/ol.css';
import './App.css';

import { ActionComponent } from './components/ActionComponent';

function App() {
  const [map, setMap] = useState<Map | null>(null);
  const [startLayer, setStartLayer] = useState<VectorSource | null>(null);
  const [endLayer, setEndLayer] = useState<VectorSource | null>(null);
  const [stopsLayer, setStopsLayer] = useState<VectorSource | null>(null);

  const mapElement = useRef<HTMLDivElement>(null);

  const createPointVector = (
    source: VectorSource,
    color: string,
    zIndex: number
  ) => {
    return new VectorLayer({
      source,
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color }),
          stroke: new Stroke({
            color: '#258',
            width: 2,
          }),
        }),
      }),
      zIndex,
    });
  };

  useEffect(() => {
    if (mapElement.current) {

      const startSource = new VectorSource();
      const endSource = new VectorSource();
      const stopsSource = new VectorSource();
      
      const startVector = createPointVector(startSource, '#5FA', 12);
      const endVector = createPointVector(endSource, '#F08', 11);
      const stopsVector = createPointVector(stopsSource, '#0AA', 10);

      const initialMap = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          startVector,
          endVector,
          stopsVector,
        ],
        view: new View({
          center: fromLonLat([-58.43, -34.63]),
          zoom: 12,
          maxZoom: 20,
        }),
      });

      setStartLayer(startSource);
      setEndLayer(endSource);
      setStopsLayer(stopsSource);
      setMap(initialMap);
    }
  }, []);

  return (
    <div className="App">
      <div ref={mapElement} className="ol-map"></div>
      {map && stopsLayer && startLayer && endLayer && (
        <ActionComponent
          map={map}
          startLayer={startLayer}
          endLayer={endLayer}
          stopsLayer={stopsLayer}
        />
      )}
    </div>
  );
}

export default App;
