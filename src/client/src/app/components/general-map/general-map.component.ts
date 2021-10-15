import {Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import TileLayer from "ol/layer/Tile";
import {BingMaps, XYZ} from "ol/source";
import {Graticule} from "ol/layer";
import {Stroke} from "ol/style";
import Map from 'ol/Map';
import {Coordinate, createStringXY} from "ol/coordinate";
import * as OlExtent from 'ol/extent.js';
import {toLonLat} from "ol/proj";
import * as Proj from 'ol/proj';
import {LocalizationService} from "../../@core/internationalization/localization.service";
import TileGrid from "ol/tilegrid/TileGrid";
import { Descriptor } from "../interfaces";
import { DownloadService } from "../services";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss']
})

export class GeneralMapComponent implements OnInit {

  @Input() displayLayers = true as boolean;
  @Input() openMenu = true as boolean;
  @Input() descriptor: Descriptor;
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
  public loadingDown: boolean;
  public lat: number;
  public lon: number;

  public layersTypes: any[];
  public layersNames: any[];
  public basemapsNames: any[];
  public limitsNames: any[];
  public layersTMS: any;
  public tileGrid: TileGrid;
  public projection: any;
  public urls: string[];
  public regionFilterDefault: any;
  public msFilterRegion: string;
  public defaultRegion: any;
  public selectRegion: any;
  public year: any;

  private formataCoordenada: (coordinate: Coordinate) => string = createStringXY(8);

  constructor(
    private localizationService: LocalizationService,
    private downloadService: DownloadService
  ) {
    this.showFormPoint = false;
    this.loadingDown = false;
    this.layersTypes = [];
    this.layersNames = [];
    this.basemapsNames = [];
    this.limitsNames = [];
    this.layersTMS = {};

    this.defaultRegion = {
      type: 'bioma',
      text: 'CERRADO',
      value: 'CERRADO'
    }

    this.selectRegion = this.defaultRegion;

    this.urls = [
      'https://o1.lapig.iesa.ufg.br/ows',
      'https://o2.lapig.iesa.ufg.br/ows',
      'https://o3.lapig.iesa.ufg.br/ows',
      'https://o4.lapig.iesa.ufg.br/ows'
    ];

    this.projection = Proj.get('EPSG:900913');

    this.tileGrid = new TileGrid({
      extent: this.projection.getExtent(),
      resolutions: this.getResolutions(this.projection),
      tileSize: 512
    });

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

    if(changes.hasOwnProperty('descriptor')){
      if(this.map && changes.descriptor.currentValue.hasOwnProperty('regionFilterDefault')){
        this.descriptor = changes.descriptor.currentValue;
        this.onChangeDescriptor();
      }
    }

    setTimeout(() => {
      this.map.updateSize()
    });
  }

  ngOnInit(): void {
    this.innerHeigth = window.innerHeight;
  }

  onChangeDescriptor(){
    this.regionFilterDefault = this.descriptor.regionFilterDefault;

    for (let groups of this.descriptor.groups) {

      for (let layers of groups.layers) {
        if (layers.types) {
          for (let types of layers.types) {
            this.layersTypes.push(types)
          }
        } else {
          this.layersTypes.push(layers);
        }
        this.layersNames.push(layers);
      }

    }
    for (let basemap of this.descriptor.basemaps) {
      for (let types of basemap.types) {
        this.basemapsNames.push(types)
      }
    }

    for (let limits of this.descriptor.limits) {
      for (let types of limits.types) {
        this.limitsNames.push(types)
      }
    }

    this.createLayers();
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

  private parseUrls(layer) {
    let result: string[] = []

    let filters: any[] = []

    if (layer.timeHandler == 'msfilter' && layer.times) {
      filters.push(layer.timeSelected)
    }
    if (layer.layerfilter)
      filters.push(layer.layerfilter)
    if (this.regionFilterDefault)
      filters.push(this.regionFilterDefault)
    if (layer.regionFilter && this.msFilterRegion)
      filters.push(this.msFilterRegion)

    let msfilter = '&MSFILTER=' + filters.join(' AND ')


    let layername = layer.value

    if (layer.value == "uso_solo_mapbiomas") {
      this.year = layer.timeSelected
    }

    if (layer.timeHandler == 'layername')
      layername = layer.timeSelected

    for (let url of this.urls) {
      result.push(url + "?layers=" + layername + msfilter + "&mode=tile&tile={x}+{y}+{z}" + "&tilemode=gmap" + "&map.imagetype=png");
    }

    return result;
  }

  private createTMSLayer(layer) {
    return new TileLayer({
      properties: {
        key: layer.value,
        type: 'layer',
        visible: layer.visible,
      },
      source: new XYZ({
        urls: this.parseUrls(layer)
      }),
      visible: layer.visible,
      opacity: layer.opacity
    });
  }

  private getResolutions(projection) {
    let projExtent = projection.getExtent();
    let startResolution = OlExtent.getWidth(projExtent) / 256;
    let resolutions = new Array(22);
    for (let i = 0, ii = resolutions.length; i < ii; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i);
    }
    return resolutions
  }

  createLayers() {
    for (let layer of this.layersTypes) {
      this.layersTMS[layer.value] = this.createTMSLayer(layer);
      this.layers.push(this.layersTMS[layer.value])
    }
  }

  changeLayerVisibility(ev){
    let { layer, updateSource } = ev;
    if(updateSource){
      let sourceLayers = this.layersTMS[layer.value].getSource();
      sourceLayers.setUrls(this.parseUrls(layer))
      sourceLayers.refresh();
    } else {
      if (layer.types) {
        for (let layerType of layer.types) {
          this.layersTMS[layerType.value].setVisible(false)
        }
      } else {
        this.layersTMS[layer.value].setVisible(false)
      }
      this.layersTMS[layer.selectedType].setVisible(layer.visible)
    }
  }

  onChangeTransparency(ev) {
    let {layer, opacity} = ev;
    const op = ((100 - opacity) / 100);
    const layerTMS = this.layersTMS[layer.value];
    if(layerTMS){
      layerTMS.setOpacity(op);
    }
  }

  private selectedTimeFromLayerType(layerName) {
    for (let layer of this.layersTypes) {
      if (layer.value == layerName) {
        if (layer.hasOwnProperty('times')) {
          for (let time of layer.times) {
            if (time.value == layer.timeSelected) {
              return time;
            }
          }
        }
      }
    }
    return undefined;
  }

  downloadSHP(layer, format) {
    this.loadingDown = true;
    let parameters = {
      "layer": layer,
      "region": this.selectRegion,
      "time": this.selectedTimeFromLayerType(layer.selectedType),
      "typeShape": format
    };

    let name = ""
    if (parameters.time != undefined) {
      name = parameters.layer.selectedType + "_" + parameters.region.value+ "_" + parameters.time.Viewvalue
    }
    else {
      name = parameters.layer.selectedType + "_" + parameters.region.value
    }
    this.downloadService.downloadSHP(parameters).toPromise()
      .then(blob => {
        saveAs(blob, name + '.zip');
        this.loadingDown = false;
      }).catch(error => {
      this.loadingDown = false;
    });
  }

  downloadCSV(layer, yearDownload, filterRegion, columnsCSV) {
   this.loadingDown = true;
    let parameters = {
      "layer": layer.selectedType + yearDownload,
      "filterRegion": filterRegion + columnsCSV,
      "regionName": this.selectRegion.value
    };

    let name = parameters.layer + "_" + this.selectRegion.value

    this.downloadService.downloadCSV(parameters).toPromise()
      .then(blob => {
        saveAs(blob, name + '.csv');
        this.loadingDown = false;
      }).catch(error => {
        this.loadingDown = false;
    });
  }

  buttonDownload(ev){

    let {tipo, layer, e } = ev;
    let yearDownload = '';
    let columnsCSV = '';
    let regionType = this.selectRegion.type;
    let filterRegion;

    if (layer.types) {
      for (let layerSelected of layer.types) {
        if (layerSelected.value == layer.selectedType) {
          if (layerSelected.timeSelected)
            yearDownload = '&' + layerSelected.timeSelected;
          columnsCSV = '&columnsCSV=' + layerSelected.columnsCSV;
        }
      }
    } else if (layer.timeSelected) {
      yearDownload = '&' + layer.timeSelected;
      columnsCSV = '&columnsCSV=' + layer.columnsCSV;
    } else {
      columnsCSV = '&columnsCSV=' + layer.columnsCSV;
    }

    if (this.msFilterRegion == "") {
      filterRegion = this.regionFilterDefault
    } else {
      filterRegion = this.msFilterRegion
    }

    if (this.selectRegion.type == 'estado')
      regionType = "uf"

    if (tipo == 'shp') {
     this.downloadSHP(layer, tipo)
    } else if(tipo == 'csv'){
      this.downloadCSV(layer, yearDownload, filterRegion, columnsCSV);
    }
  }

}
