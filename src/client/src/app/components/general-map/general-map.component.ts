import {Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import TileLayer from "ol/layer/Tile";
import {BingMaps, XYZ} from "ol/source";
import {Graticule} from "ol/layer";
import {Stroke} from "ol/style";
import Map from 'ol/Map';
import {Coordinate, createStringXY, toStringHDMS} from "ol/coordinate";
import {toLonLat} from "ol/proj";
import {LocalizationService} from "../../@core/internationalization/localization.service";

@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss']
})

export class GeneralMapComponent implements OnInit {

  @Input() displayLayers = true as boolean;
  @Input() openMenu = true as boolean;
  @Input() descriptor: any;
  @Input() basemap: any;
  @Output() onHide = new EventEmitter<any>();
  @Output() mapInstance = new EventEmitter<Map>();


  public innerHeigth: number;
  public options: any = {}
  public bmaps = [] as any[];
  public layers = [] as any[];
  public limits = [] as any[];
  public graticule: Graticule;
  public map: Map;
  public mousePositionOptions: any;
  public showFormPoint: boolean;
  public lat: number;
  public lon: number;
  private formataCoordenada: (coordinate: Coordinate) => string = createStringXY(8);

  constructor(private localizationService: LocalizationService) {
    this.showFormPoint = false;

    this.options = {
      units: 'metric',
      bar: true,
      text: true,
      minWidth: 100,
    };
    this.bmaps = [
      {
        layer: new TileLayer({
          properties: {
            key: 'mapbox',
            type: 'bmap',
            visible: true,
          },
          source: new XYZ({
            wrapX: false,
            url:
              'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
          }),
          visible: true
        })
      },
      {
        layer: new TileLayer({
          properties: {
            key: 'bing',
            type: 'bmap',
            visible: false,
          },
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
        layer: new TileLayer({
          properties: {
            key: 'google',
            type: 'bmap',
            visible: false,
          },
          source: new XYZ({
            url:
              'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          }),
          visible: false
        })
      },
      {
        layer: new TileLayer({
          properties: {
            key: 'estradas',
            type: 'bmap',
            visible: false,
          },
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
        layer: new TileLayer({
          properties: {
            key: 'relevo',
            type: 'bmap',
            visible: false,
          },
          source: new XYZ({
            url:
              'https://server.arcgisonline.com/ArcGIS/rest/services/' +
              'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
          }),
          visible: false
        })
      },
      {
        layer: new TileLayer({
          properties: {
            key: 'planet',
            type: 'bmap',
            visible: false,
          },
          source: new XYZ({
            url:
              'https://tiles{0-3}.planet.com/basemaps/v1/planet-tiles/global_quarterly_2021q2_mosaic/gmap/{z}/{x}/{y}.png?api_key=d6f957677fbf40579a90fb3a9c74be1a',
          }),
          visible: false
        })
      },
      {
        layer: new TileLayer({
          properties: {
            key: 'stadia',
            type: 'bmap',
            visible: false,
          },
          source: new XYZ({
            transition: 2,
            url:
              'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png',
          }),
          visible: false
        })
      }
    ];
    this.graticule = new Graticule({
      // the style to use for the lines, optional.
      zIndex: 10001,
      strokeStyle: new Stroke({
        color: 'rgb(23,22,22)',
        width: 0.7,
        lineDash: [0.9, 5]
      }),
      showLabels: true,
      wrapX: false,
    });
    this.mousePositionOptions = {
      coordinateFormat: (coordinate: Coordinate) => {
        const c: Coordinate = toLonLat(coordinate, this.map.getView().getProjection());
        return this.formataCoordenada(c);
      },
      className: 'mouse-position',
      placeholder: false,
      target: 'coordinates-label'
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes.hasOwnProperty('basemap')) {
      const bmap = changes.basemap.currentValue;
      this.map.getLayers().forEach(layer => {
        const properties = layer.getProperties();
        if (properties.key == bmap.key && properties.type == bmap.type) {
          layer.setVisible(true);
        } else if (properties.type == bmap.type) {
          layer.setVisible(false);
        }
      })
    }

    setTimeout(() => {
      this.map.updateSize()
    });
  }

  ngOnInit(): void {
    this.innerHeigth = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight;
    setTimeout(() => {
      this.map.updateSize()
    });
  }


  setMap(map) {
    this.map = map;
    this.mapInstance.emit(map);
  }

  hideLayers() {
    this.onHide.emit();
  }

  searchPoint() {
    if (this.lat && this.lon) {
      this.showFormPoint = !this.showFormPoint;
    }
  }

}
