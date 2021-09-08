import {Component, Input, OnInit} from '@angular/core';
import { OlMapComponent } from "../ol-map/ol-map.component";
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import { BingMaps, XYZ } from "ol/source";
import {Attribution} from "ol/control";



@Component({
  selector: 'ol-basemaps',
  templateUrl: './ol-basemaps.component.html',
  styleUrls: ['./ol-basemaps.component.scss']
})
export class OlBasemapsComponent implements OnInit {



  public basemaps: any;

  constructor(private olMap: OlMapComponent) {
    this.basemaps = {
      'mapbox': {
        layer: new TileLayer({
          source: new XYZ({
            wrapX: false,
            url:
              'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
          }),
          visible: true
        })
      },
      'bing': {
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
      'google': {
        visible: false,
        layer: new TileLayer({
          source: new XYZ({
            url:
              'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          }),
          visible: false
        })
      },
      'estradas': {
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
      'relevo': {
        layer: new TileLayer({
          source: new XYZ({
            url:
              'https://server.arcgisonline.com/ArcGIS/rest/services/' +
              'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
          }),
          visible: false
        })
      },
      'planet': {
        layer: new TileLayer({
          source: new XYZ({
            url:
              'https://tiles{0-3}.planet.com/basemaps/v1/planet-tiles/global_quarterly_2021q2_mosaic/gmap/{z}/{x}/{y}.png?api_key=d6f957677fbf40579a90fb3a9c74be1a',

          }),
          visible: false
        })
      },
    }
  }

  ngOnInit(): void {
    if (this.olMap.map) {
      // this.olMap.addLayer(this.basemaps[this.bmap])
    } else {
      setTimeout(() => {
        this.ngOnInit();
      }, 10);
    }
  }

}
