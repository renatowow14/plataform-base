import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';

export function stringToEl(html: string) {
  const parser = new DOMParser();
  const DOM = parser.parseFromString(html, 'text/html');
  return DOM.body.firstChild;
}

export function defaultLayers() {
  return [
    osmLayer()
  ];
}

export function osmLayer() {
  return new TileLayer({
    source: new OSM()
  });
}

export function osmSource() {
  return new OSM();
}
