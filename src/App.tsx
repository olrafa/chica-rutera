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
  const [pointLayer, setPointLayer] = useState<VectorSource | null>(null);

  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapElement.current) {
      const source = new VectorSource();

      const vector = new VectorLayer({
        source,
        style: new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: '#0AA' }),
            stroke: new Stroke({
              color: '#258',
              width: 2,
            }),
          }),
        }),
        zIndex: 10
      });
      const initialMap = new Map({
        target: mapElement.current,
        layers: [new TileLayer({ source: new OSM() }), vector],
        view: new View({
          center: fromLonLat([-58.43, -34.63]),
          zoom: 12,
          maxZoom: 20,
        }),
      });

      setPointLayer(source);
      setMap(initialMap);
    }
  }, []);

  return (
    <div className="App">
      <div ref={mapElement} className="ol-map"></div>
      {map && pointLayer && (
        <ActionComponent map={map} pointLayer={pointLayer} />
      )}
    </div>
  );
}

export default App;
