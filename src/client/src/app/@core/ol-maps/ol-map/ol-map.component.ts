import {Component, OnInit, AfterViewInit, Input, ElementRef, SimpleChanges} from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import {defaults as defaultInteractions} from 'ol/interaction';
import {BingMaps, OSM} from 'ol/source';
import * as Proj from 'ol/proj';
import {
  defaults as defaultControls,
  Control
} from 'ol/control';

export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '500px';

export const DEFAULT_LAT = -34.603490361131385;
export const DEFAULT_LON = -58.382037891217465;

export const DEFAULT_BASEMAP = 'mapbox';
export const DEFAULT_LIMIT = 'mapbox';
@Component({
  selector: 'ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements OnInit, AfterViewInit {
  public basemaps = [] as any[];
  public limits = [] as any[];
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() zoom: number;
  @Input() width: string | number = DEFAULT_WIDTH;
  @Input() height: string | number = DEFAULT_HEIGHT;
  @Input() basemap: string = DEFAULT_BASEMAP;
  @Input() limit: string = DEFAULT_LIMIT;

  target: string = 'map-' + Math.random().toString(36).substring(2);
  map: Map;
  layers = [] as any[];

  private mapEl: HTMLElement;
  constructor(private elementRef: ElementRef) {
    this.basemaps = [
      {
        name: 'mapbox',
        visible: false,
        layer: new TileLayer({
          source: new XYZ({
            wrapX: false,
            url:
              'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
          }),
          visible: false
        })
      },
      {
        name: 'bing',
        visible: false,
        layer: new TileLayer({
          preload: Infinity,
          source: new BingMaps({
            key:
              'VmCqTus7G3OxlDECYJ7O~G3Wj1uu3KG6y-zycuPHKrg~AhbMxjZ7yyYZ78AjwOVIV-5dcP5ou20yZSEVeXxqR2fTED91m_g4zpCobegW4NPY',
            imagerySet: 'Aerial'
          }),
          visible: false
        })
      },
      {
        name: 'google',
        visible: false,
        layer: new TileLayer({
          source: new XYZ({
            url:
              'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          }),
          visible: false
        })
      },
      {
        name: 'estradas',
        visible: false,
        layer: new TileLayer({
          preload: Infinity,
          source: new BingMaps({
            key:
              'VmCqTus7G3OxlDECYJ7O~G3Wj1uu3KG6y-zycuPHKrg~AhbMxjZ7yyYZ78AjwOVIV-5dcP5ou20yZSEVeXxqR2fTED91m_g4zpCobegW4NPY',
            imagerySet: 'Road'
          }),
          visible: false
        })
      },
      {
        name: 'relevo',
        visible: false,
        layer: new TileLayer({
          source: new XYZ({
            url:
              'https://server.arcgisonline.com/ArcGIS/rest/services/' +
              'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
          }),
          visible: false
        })
      },
      {
        name: 'planet',
        visible: false,
        layer: new TileLayer({
          source: new XYZ({
            url:
              'https://tiles{0-3}.planet.com/basemaps/v1/planet-tiles/global_quarterly_2021q2_mosaic/gmap/{z}/{x}/{y}.png?api_key=d6f957677fbf40579a90fb3a9c74be1a',

          }),
          visible: false
        })
      }
    ]
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.basemaps.forEach(b => {
      if(b.name == changes.basemap.currentValue){
        b.layer.setVisible(true);
        b.layer.visible = true;
      } else {
        b.layer.setVisible(false);
        b.layer.visible = false;
      }
    })
  }

  ngAfterViewInit(): void {
    this.mapEl = this.elementRef.nativeElement.querySelector('#' + this.target);
    this.setSize();

    this.basemaps.forEach(b => {
      console.log(b.name, this.basemap)
      if(b.name == this.basemap){
        b.layer.setVisible(true);
        b.layer.visible = true;
      }
    })

    this.layers = this.basemaps.map(b => {return b.layer});

    this.map = new Map({
      target: this.target,
      layers: this.layers,
      view: new View({
        center: Proj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),
      interactions: defaultInteractions({altShiftDragRotate: false, pinchRotate: false}),
      controls: defaultControls({attribution: false, zoom: false}).extend([]),
    });
  }

  private setSize() {
    if (this.mapEl) {
      const styles = this.mapEl.style;
      styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }

  public addLayer(layer) {
    this.map.addLayer(layer);
  }

  public setMarker(vector) {
    this.map.addLayer(vector);
  }

  public setControl(control: Control) {
    this.map.addControl(control);
  }

}

const cssUnitsPattern = /([A-Za-z%]+)$/;

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return cssUnitsPattern.test(value) ? value : `${value}px`;
}
