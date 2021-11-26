import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnInit,
  AfterContentChecked
} from '@angular/core';
import TileLayer from "ol/layer/Tile";
import Map from 'ol/Map';
import * as OlExtent from 'ol/extent.js';
import * as Proj from 'ol/proj';
import { LocalizationService } from "../../@core/internationalization/localization.service";
import TileGrid from "ol/tilegrid/TileGrid";
import { Descriptor, Control, Ruler, TextFilter, DescriptorType, DescriptorLayer } from "../../@core/interfaces";
import { DownloadService, MapService } from "../services";
import { saveAs } from 'file-saver';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Coordinate, createStringXY } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import {MapEvent, Overlay} from "ol";
import {BingMaps, TileWMS, XYZ} from "ol/source";
import { Fill, Stroke, Style } from "ol/style";
import { Geometry, LinearRing, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom';
import { Feature } from "ol";
import { Draw, Interaction, Modify, Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { RulerAreaCtrl, RulerCtrl } from "../../@core/interactions/ruler";
import { SelectItem, PrimeNGConfig, MessageService } from 'primeng/api';
import { LayerSwipe } from "../../@core/interfaces/swipe";
import { AreaService } from '../services/area.service';
import Swipe from 'ol-ext/control/Swipe';
import Graticule from 'ol-ext/control/Graticule';
import Compass from 'ol-ext/control/Compass';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Pixel} from "ol/pixel";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss'],
  providers: [MessageService]
})

export class GeneralMapComponent implements OnInit, Ruler, AfterContentChecked {
  @Input() set displayLayers(value: boolean) {
    this._displayLayers = value;
    this.handleSideBars();
  }

  @Input() set descriptor(value: Descriptor) {
    if (value) {
      this._descriptor = value;
      this.onChangeDescriptor();
    }
  }

  @Input() openMenu = true as boolean;
  @Output() onHide = new EventEmitter<any>();
  @Output() onMapReadyLeftSideBar = new EventEmitter<any>();
  @Output() onSelectLayerSwipe = new EventEmitter<string>();
  @Output() onChangeRegion = new EventEmitter<any>();
  @Output() onMapReadyRightSideBar = new EventEmitter<any>();
  @Output() onBasemapsReady = new EventEmitter<any>();
  @Output() onLimitsReady = new EventEmitter<any>();
  @Output() onSearchDrawnGeometry = new EventEmitter<number>();

  public innerHeigth: number;
  public options: any = {}
  public bmaps = [] as any[];
  public layers = [] as any[];
  public selectedLayers = [] as any[];
  public limits = [] as any[];
  public graticule: Graticule;
  public compass: Compass;
  public map: any;
  public _descriptor: Descriptor;
  public mousePositionOptions: any;
  public showFormPoint: boolean;
  public loadingDown: boolean;
  public controlOptions: boolean;
  public _displayLayers: boolean;
  public showRightSideBar: boolean;
  public lat: number;
  public lon: number;
  public classes: string;
  public swipeLayers: any[];
  public swipeOptions: LayerSwipe[];
  public swiperControl: Swipe = new Swipe();
  public swipeLayer: DescriptorLayer;
  public mapControls: Control;


  public layersTypes: any[];
  public layersNames: any[];
  public basemapsAvaliable: any[];
  public limitsNames: any[];
  public layersTMS: any;
  public limitsTMS: any;
  public tileGrid: TileGrid;
  public projection: any;
  public urls: string[];
  public msFilterRegion: string;
  public selectRegion: any;
  public year: any;

  public defaultRegion: any;
  public regionsLimits: any;

  private interaction: Interaction;

  private source: VectorSource<Geometry> = new VectorSource();
  private vector: VectorLayer<any> = new VectorLayer();
  private modify: Modify;
  private draw: any;
  private snap: any;
  public features: any[];
  public highlightStyle: Style;
  public defaultStyle: Style;


  private formataCoordenada: (coordinate: Coordinate) => string = createStringXY(4);

  public otherLayerFromFilters: any = {
    layer: null,
    strokeColor: '#363230',
  }

  public selectedAutoCompleteText: any = { text: '' };
  public listForAutoComplete: any[];
  public textsComponentesFilters: TextFilter;
  public selectedSearchOption: string;
  public searchOptions: SelectItem[];

  public valueSwipe: any;
  public legendExpanded: boolean;

  constructor(
    public localizationService: LocalizationService,
    private downloadService: DownloadService,
    private cdRef: ChangeDetectorRef,
    private primeNGConfig: PrimeNGConfig,
    private mapService: MapService,
    private areaService: AreaService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.showFormPoint = false;
    this.loadingDown = false;
    this.legendExpanded = true;
    this.controlOptions = false;
    this.layersTypes = [];
    this.layersNames = [];
    this.limitsNames = [];
    this.swipeLayers = [];
    this.swipeLayer = { idLayer: '', labelLayer: '', selectedType: '', visible: false, types: [] };
    this.layersTMS = {};
    this.limitsTMS = {};
    this.map = {};

    this.features = [];

    this.textsComponentesFilters = {
      search_failed: '',
      search_placeholder: ''
    }

    this.mapControls = {
      swipe: false,
      search: false,
      drawArea: false,
      measure: false,
      measureArea: false,
      print: false,
      point: false
    }

    this.defaultRegion = {
      type: 'country',
      text: 'Brasil',
      value: 'BRASIL'
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
            key: 'mapbox-dark',
            type: 'bmap',
            visible: false,
          },
          source: new XYZ({
            wrapX: false,
            url:
              'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
          }),
          visible: false
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
      }

    ];
    this.graticule = new Graticule({
      stepCoord: 1,
      margin: 5,
      style: new Style({
        fill: new Fill({
          color: 'rgb(255,255,255)',
        }),
        stroke: new Stroke({
          color: 'rgb(0,0,0)',
          lineDash: [.1, 5],
          width: 0.14,
        }),
        text: new Text({
          font: 'bold 10px Montserrat',
          offsetY: 20,
          fill: new Fill({ color: 'rgb(0,0,0)' }),
          stroke: new Stroke({ color: 'rgb(255,255,255)', width: 1 })
        })
      }),
      projection: 'EPSG:4326',
      formatCoord: function (c) {
        return c.toFixed(1) + "°"
      }
    });
    this.compass = new Compass({
      className: "top",
      rotateWithView: true,
      style: new Stroke({ color: this.readStyleProperty('primary'), width: 0 })
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

    this.defaultStyle = new Style({
      fill: new Fill({
        color: 'rgba(255,255,255,0.52)',
      }),
      stroke: new Stroke({
        color: this.otherLayerFromFilters.strokeColor,
        width: 6,
        lineCap: 'round'
      }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: this.readStyleProperty('primary'),
        }),
      }),
    });

    this.highlightStyle = new Style({
      fill: new Fill({
        color: 'rgba(255,255,255,0.52)',
      }),
      stroke: new Stroke({
        color: '#03f4fc',
        width: 3,
      }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: '#fcba03',
        }),
      }),
    });

    this.initVectorLayerInteraction();
  }

  ngOnInit(): void {
    const self = this;
    this.primengConfig.ripple = true;
    this.innerHeigth = window.innerHeight;
    this.basemapsAvaliable = [];
    this.primeNGConfig.ripple = true;
    this.selectedSearchOption = 'region';

    this.setSearchOptions();

    this.source.on('addfeature', function (ev) {
      const text = new Style({
        // text: new Text({
        //   text: id.toString(),
        //   font: 'normal 12px Montserrat',
        //   offsetY: 14,
        //   fill: new Fill({ color: 'rgb(0,0,0)' }),
        //   stroke: new Stroke({ color: 'rgb(255,255,255)', width: 1 })
        // }),
        // fill: new Fill({
        //   color: 'rgba(255,255,255,0.40)',
        // }),
        stroke: new Stroke({
          color: self.readStyleProperty('primary'),
          width: 3,
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: self.readStyleProperty('primary'),
          }),
        }),
      });
      ev.feature!.setStyle(text);
      self.features.push(ev.feature)
    });
    this.onChangeSearchOption();
    this.cdRef.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  changeVisibilityBasemap(ev) {
    let { bmap } = ev;
    this.map.getLayers().forEach(layer => {
      const properties = layer.getProperties();
      if (properties.key == bmap.key && properties.type == bmap.type) {
        layer.setVisible(true);
      } else if (properties.type == bmap.type) {
        layer.setVisible(false);
      }
    })
    this.updateZIndex();
  }

  setSearchOptions() {
    this.searchOptions = [
      {
        label: this.localizationService.translate('controls.filter_texts.label_region'),
        value: 'region',
        icon: 'language'
      },
      { label: this.localizationService.translate('controls.filter_texts.label_car'), value: 'car', icon: 'home' },
      { label: this.localizationService.translate('controls.filter_texts.label_uc'), value: 'uc', icon: 'nature_people' },
    ];
    this.onChangeSearchOption();
  }

  getSwipeLayers() {
    this.swipeLayers = [];
    this.map.getLayers().forEach(layer => {
      if (layer) {
        const properties = layer.getProperties();
        if (properties.type === 'layer') {
          this.swipeLayers.push(layer)
        }
      }
    });
  }

  onClearSwipe() {
    this.valueSwipe = "";
    this.swipeLayer = { idLayer: '', labelLayer: '', selectedType: '', visible: false, types: [] };
    this.removeSwipe()
  }

  onSwipeSelectedLayer(ev) {
    this.swipeLayer.type = ev.layer.get('descriptorLayer');
    this.swipeLayer.visible = true;
    this.addSwipe(ev.layer);
  }

  onChangeDescriptor() {
    this.setSearchOptions();
    this.layersTypes = [];
    this.basemapsAvaliable = [];
    this.limitsNames = [];
    this.selectedLayers = [];

    for (let groups of this._descriptor.groups) {
      for (let layer of groups.layers) {
        layer.type = layer.types.find(type => type.valueType === layer.selectedType);
        layer.type!.visible = layer.visible;
        for (let types of layer.types) {
          this.layersTypes.push(types)
        }
        this.layersNames.push(layer);
      }
    }

    for (let basemap of this._descriptor.basemaps) {
      basemap.type = basemap.types.find(type => type.valueType === basemap.selectedType);
      basemap.type!.visible = basemap.visible;

      for (let types of basemap.types) {

        const baseMapAvaliable = this.bmaps.find(b => {
          return b.layer.get('key') === types.valueType;
        })

        if (baseMapAvaliable) {
          baseMapAvaliable.layer.set('label', types.viewValueType)
          this.basemapsAvaliable.push(baseMapAvaliable)
        }

      }
    }

    for (let limit of this._descriptor.limits) {
      limit.type = limit.types.find(type => type.valueType === limit.selectedType);
      limit.type!.visible = limit.visible;

      for (let types of limit.types) {
        this.limitsNames.push(types)
      }
    }

    this.onBasemapsReady.emit(this.basemapsAvaliable);

    this.createLayers();
  }


  private createVectorLayer(features, strokeColor, width) {
    return new VectorLayer({
      source: new VectorSource({ features }),
      style: [
        new Style({
          stroke: new Stroke({
            color: '#dedede',
            width: width + 1
          })
        }),
        new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: width
          })
        })
      ]
    });
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
    this.map.on('singleclick', (evt: MapEvent) => this.onDisplayFeatureInfo(evt));
    this.onMapReadyLeftSideBar.emit(map);
    this.onMapReadyRightSideBar.emit(map);
  }

  hideLayers() {
    this.onHide.emit();
  }

  searchPoint() {
    if (this.lat && this.lon) {
      this.showFormPoint = !this.showFormPoint;
    }
  }

  private parseUrls(layerType: DescriptorType) {
    let result: string[] = []

    let filters: any[] = []

    if (layerType!.valueType == "planet") {
      result.push(`https://tiles.planet.com/basemaps/v1/planet-tiles/${layerType!.filterSelected}/gmap/{z}/{x}/{y}.png?api_key=d6f957677fbf40579a90fb3a9c74be1a`);
    } else {
      if (layerType!.filterHandler == 'msfilter' && layerType!.filters) {
        filters.push(layerType!.filterSelected)
      }
      if (layerType!.regionFilter)
        filters.push(layerType!.regionFilter)

      if (layerType!.regionFilter && this.msFilterRegion)
        filters.push(this.msFilterRegion)

      let msfilter = '&MSFILTER=' + filters.join(' AND ')


      let layername = layerType!.valueType

      if (layerType!.valueType == "uso_solo_mapbiomas") {
        this.year = layerType!.filterSelected
      }

      if (layerType!.filterHandler == 'layername') {
        if (layerType!.filterSelected != null) {
          layername = layerType!.filterSelected
        }
      }

      for (let url of this.urls) {
        result.push(url + "?layers=" + layername + msfilter + "&mode=tile&tile={x}+{y}+{z}" + "&tilemode=gmap" + "&map.imagetype=png");
      }

    }
    return result;
  }

  private createTMSLayer(layerType: DescriptorType, type = 'layer') {
    return new TileLayer({
      properties: {
        key: layerType!.valueType,
        label: layerType!.viewValueType,
        descriptorLayer: layerType,
        type: type,
        visible: layerType.visible
      },
      source: new XYZ({
        urls: this.parseUrls(layerType)
      }),
      visible: layerType.visible
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
      this.layersTMS[layer.valueType] = this.createTMSLayer(layer);
      this.layers.push(this.layersTMS[layer.valueType]);
      this.addLayersLegend(layer);
    }
    for (let bmap of this.basemapsAvaliable) {
      this.layers.push(bmap.layer)
    }

    let limitsLayers: TileLayer<any>[] = [];

    for (let limits of this.limitsNames) {
      let layer = this.createTMSLayer(limits, 'limit');
      this.limitsTMS[limits.valueType] = layer;
      this.layers.push(this.limitsTMS[limits.valueType]);
      limitsLayers.push(layer);
    }

    this.onLimitsReady.emit(limitsLayers);

    this.getSwipeLayers();
    this.updateZIndex();
  }

  changeLayerVisibility(ev) {
    let { layer, updateSource } = ev;

    const layerType: DescriptorType = layer;
    if (updateSource) {
      this.updateSourceLayer(layerType);
    } else {
      if (layerType.type === 'layer') {
        this.layersTMS[layerType.valueType].setVisible(layerType.visible);

        this.addLayersLegend(layerType);

        if (this.swiperControl.layers.length > 0) {

          const existInSwipe = this.swiperControl.layers.find(l => {
            return l.layer.get('key') === layerType.valueType
          });

          if (layer.visible && !existInSwipe) {
            this.swiperControl.addLayer(layerType, false);
          }
        }

      } else {
        if (layer.layer.get('type') === 'bmap') {
          this.map.getLayers().forEach(layer => {
            if (layer.get('type') === 'bmap') {
              layer.setVisible(false)
            }
          });
          const lay = this.map.getLayers().getArray().find(l => l.get('key') === layer.layer.get('key'));
          lay.setVisible(true);
        } else if (layer.layer.get('type') === 'limit') {
          this.map.getLayers().forEach(layer => {
            if (layer.get('type') === 'limit') {
              layer.setVisible(false)
            }
          });
          const lay = this.map.getLayers().getArray().find(l => l.get('key') === layer.layer.get('key'));
          lay.setVisible(true);
        }
      }
    }
    this.updateZIndex();
  }

  addLayersLegend(layerType: DescriptorType) {
    if (layerType.visible) {
      let layerExist = false;
      this.selectedLayers.forEach((item, index) => {
        if (item.get('key') === layerType.valueType) layerExist = true;
      });
      if (!layerExist) {
        this.selectedLayers.push(this.layersTMS[layerType.valueType]);
      }

    } else {
      this.selectedLayers.forEach((item, index) => {
        if (item.get('key') === layerType.valueType) this.selectedLayers.splice(index, 1);
      });
    }
    this.selectedLayers.forEach((item) => {
      item.visible = item.get('visible');
    });
  }

  updateZIndex() {
    this.selectedLayers.forEach((item, index) => {
      item.setZIndex(index + 1);
    });
  }


  onChangeTransparency(ev) {
    let { layer, opacity } = ev;
    const op = ((100 - opacity) / 100);
    let layerTMS = this.layersTMS[layer.value];
    if (layerTMS) {
      layerTMS.setOpacity(op);
    } else {
      layerTMS = this.layersTMS[layer.selectedType];
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
      name = parameters.layer.selectedType + "_" + parameters.region.value + "_" + parameters.time.Viewvalue
    } else {
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

  buttonDownload(ev) {

    let { tipo, layer, e } = ev;
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

    filterRegion = this.msFilterRegion

    if (this.selectRegion.type == 'state')
      regionType = "uf"

    if (tipo == 'shp') {
      this.downloadSHP(layer, tipo)
    } else if (tipo == 'csv') {
      this.downloadCSV(layer, yearDownload, filterRegion, columnsCSV);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedLayers, event.previousIndex, event.currentIndex);
    this.updateZIndex();
  }

  initVectorLayerInteraction() {
    this.vector = new VectorLayer({
      source: this.source,
      style: this.defaultStyle
    });
  }

  // @ts-ignore
  isGeometry(feature: Feature) {

    if (feature.getGeometry) {
      const geometry = feature.getGeometry();
      return geometry instanceof Point || geometry instanceof LinearRing || geometry instanceof LineString
        || geometry instanceof MultiLineString || geometry instanceof MultiPoint
        || geometry instanceof MultiPolygon || geometry instanceof Point || geometry instanceof Polygon;
    }

    return false;
  }

  onSwipe() {
    this.getSwipeLayers();
    this.controlOptions = true;
    this.mapControls.swipe = !this.mapControls.swipe
  }

  onSearch(show) {
    this.controlOptions = true;
    this.mapControls.search = show;
  }

  onRuler(): void {
    this.mapControls.measure = !this.mapControls.measure;
    if (this.mapControls.measure) {
      this.addInteraction(new RulerCtrl(this).getDraw());
    } else {
      this.unselect()
    }
  }

  onRulerArea(): void {
    this.mapControls.measureArea = !this.mapControls.measureArea
    if (this.mapControls.measureArea) {
      this.addInteraction(new RulerAreaCtrl(this).getDraw());
    } else {
      this.unselect()
    }

  }

  onPoint(): void {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
    this.controlOptions = true;
    this.mapControls.point = !this.mapControls.point
    if (this.mapControls.point) {
      this.addDrawInteraction('Point');
    } else {
      this.unselect()
    }
  }

  onPolygon(): void {
    this.controlOptions = true;
    this.mapControls.drawArea = !this.mapControls.drawArea
    if (this.mapControls.drawArea) {
      this.addDrawInteraction('Polygon');
    } else {
      this.unselect()
    }
  }

  getOverlay(overlay: Overlay){
    return overlay;
  }

  onClearGeometries(){
    this.features = [];
    this.source.clear();
    this.map.removeInteraction(this.interaction);
    this.map.removeLayer(this.vector);
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.snap);

    // @ts-ignore
    this.interaction = null;

    // @ts-ignore
    this.modify = null;
    this.snap = null;
    this.initVectorLayerInteraction();
    this.map.getOverlays().getArray().slice(0).forEach(over => this.map.removeOverlay(over));
    this.mapControls.point = false;
    this.mapControls.drawArea = false;
  }

  removeInteraction(removeAll: boolean = false): void {
    this.features = [];
    if(removeAll) this.source.clear();

    this.map.removeInteraction(this.interaction);

    if(removeAll) this.map.removeLayer(this.vector);

    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.snap);

    // @ts-ignore
    if(removeAll) this.interaction = null;

    // @ts-ignore
    if(removeAll) this.modify = null;
    if(removeAll) this.snap = null;
    this.initVectorLayerInteraction();
  }

  addInteraction(interaction: Interaction, type: string = '', removeInteraction: boolean = false): void {
    if (removeInteraction) {
      this.removeInteraction(true);
    }

    this.vector.setZIndex(1000000);
    this.map.addLayer(this.vector);
    this.interaction = interaction;
    if (type === 'Polygon') {
      this.modify = new Modify({ source: this.source });
      this.map.addInteraction(this.modify);
      this.map.addInteraction(this.interaction);
    } else {
      this.map.addInteraction(this.interaction);
    }

    this.snap = new Snap({ source: this.source });
    this.map.addInteraction(this.snap);
  }

  getGeoJsonFromFeature(): string {
    let geom: Feature<any>[] = [];
    this.source.getFeatures().forEach(function (feature) {
      let feat = new Feature(feature.getGeometry()!.clone().transform('EPSG:3857', 'EPSG:4326'));
      // let feat = new Feature(feature.getGeometry()!.clone());
      feat.setProperties(feature.getProperties())
      geom.push(feat);
    });
    let writer = new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
    return writer.writeFeatures(geom);
  }

  addDrawInteraction(name: string): void {
    if (name !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: name
      });
      this.addInteraction(this.draw, name, true);
    }
  }

  handleSideBars() {
    this.classes = "";
    if (this._displayLayers) {
      this.classes += 'open-layers '
    }
    if (this.showRightSideBar) {
      this.classes += 'open-layers-right'
    }
  }

  addOverlay(overlay: Overlay): void {
    this.map.addOverlay(overlay);
  }

  getMap(): Map {
    return this.map;
  }

  // @ts-ignore
  getSource(): VectorSource {
    return this.source;
  }

  unselect(): void {
    this.mapControls.measureArea = false;
    this.mapControls.measure = false;
    this.removeInteraction();
  }

  private zoomExtent() {
    let map = this.map;
    if (this.selectRegion.type != '') {
      this.mapService.getExtent(this.selectRegion).subscribe(extentResult => {
        let features = (new GeoJSON()).readFeatures(extentResult, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });

        this.regionsLimits = this.createVectorLayer(features, '#666633', 3);
        this.map.addLayer(this.regionsLimits);

        // this.source = this.regionsLimits.getSource();
        this.source.clear()
        this.source.addFeature(features[0])
        let extent = features[0].getGeometry().getExtent();
        map.getView().fit(extent, { duration: 1500 });
      })
    }
  }

  private updateSourceLayer(layer) {
    let sourceLayers = this.layersTMS[layer.valueType].getSource();
    sourceLayers.setUrls(this.parseUrls(layer))
    sourceLayers.refresh();
  }

  private updateSourceAllLayers() {
    for (let layer of this.layersTypes) {
      this.updateSourceLayer(layer)
    }
  }

  updateRegion(region) {

    this.map.removeLayer(this.otherLayerFromFilters.layer)
    this.map.removeLayer(this.regionsLimits)

    this.selectRegion = region;

    if (region == this.defaultRegion) {
      this.selectedAutoCompleteText = region
      this.selectedAutoCompleteText.text = '';
    }

    if (this.selectRegion.type == 'city')
      this.msFilterRegion = "cd_geocmu = '" + this.selectRegion.value + "'"
    else if (this.selectRegion.type == 'state')
      this.msFilterRegion = "uf = '" + this.selectRegion.value + "'"
    else if (this.selectRegion.type == 'biome')
      this.msFilterRegion = "biome = '" + this.selectRegion.value + "'"
    else if (this.selectRegion.type == 'fronteira') {
      // this.msFilterRegion = "biome = '" + this.selectRegion.value + "'"
    } else
      this.msFilterRegion = ""

    this.onChangeRegion.emit(this.selectRegion);
    this.zoomExtent();
    this.updateSourceAllLayers()
  }

  search(ev) {
    this.swipeOptions = [];
    this.swipeLayers.forEach(layer => {
      let result = this.normalize(layer.get('label')).includes(this.normalize(ev.query));
      if (result) {
        this.swipeOptions.push({ name: layer.get('label'), key: layer.get('key'), layer: layer });
      }
    });
  }

  normalize(value): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  obtainSearchSuggestions(event) {

    let query = event.query;
    if (this.selectedSearchOption.toLowerCase() == 'region') {

      this.mapService.getRegions(query).subscribe(result => {
        this.listForAutoComplete = result.search;
      });
    } else if (this.selectedSearchOption.toLowerCase() == 'car') {
      this.mapService.getCARS(query).subscribe(result => {
        this.listForAutoComplete = result.search;
      });
    } else if (this.selectedSearchOption.toLowerCase() == 'uc') {
      this.mapService.getUCs(query).subscribe(result => {
        this.listForAutoComplete = result.search;
      });
    }
  }

  onSelectSuggestion(event) {
    if (this.selectedSearchOption.toLowerCase() == 'region') {
      this.updateRegion(event)
    } else if (this.selectedSearchOption.toLowerCase() == 'car' || this.selectedSearchOption.toLowerCase() == 'uc') {
      this.updateAreaOnMap(event)
    }
  }

  onChangeSearchOption() {
    this.textsComponentesFilters.search_placeholder = this.localizationService.translate('controls.filter_texts.search_placeholder_' + this.selectedSearchOption)
    this.textsComponentesFilters.search_failed = this.localizationService.translate('controls.filter_texts.search_failed_' + this.selectedSearchOption)
  }

  async clearAreaBeforeSearch() {
    await this.updateRegion(this.defaultRegion)

    await timer(2000).pipe(take(1)).toPromise();
  }

  async updateAreaOnMap(event) {

    if (this.selectRegion != this.defaultRegion) {
      await this.clearAreaBeforeSearch();
    }

    let map = this.map;

    map.removeLayer(this.otherLayerFromFilters.layer)

    this.selectedAutoCompleteText = event

    let vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(event.geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
    });

    this.otherLayerFromFilters.layer = new VectorLayer({
      source: vectorSource,
      style: [
        new Style({
          stroke: new Stroke({
            color: this.otherLayerFromFilters.strokeColor,
            width: 4
          })
        }),
        new Style({
          stroke: new Stroke({
            color: this.otherLayerFromFilters.strokeColor,
            width: 4,
            lineCap: 'round'
          })
        })
      ]
    });

    map.addLayer(this.otherLayerFromFilters.layer);
    let extent = this.otherLayerFromFilters.layer.getSource().getExtent();
    map.getView().fit(extent, { duration: 1800 });
  }

  readStyleProperty(name: string): string {
    let bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue('--' + name).trim();
  }

  onHoverFeature(feature, leave: boolean = false) {
    const style = feature!.getStyle();
    if (leave) {
      style.setFill(this.defaultStyle.getFill());
      style.setStroke(this.defaultStyle.getStroke());
      style.setImage(this.defaultStyle.getImage());
    } else {
      style.setFill(this.highlightStyle.getFill());
      style.setStroke(this.highlightStyle.getStroke());
      style.setImage(this.highlightStyle.getImage());
    }
    feature.setStyle(style);
  }

  onRemoveFeature(index, feature) {
    this.source.removeFeature(feature);
    this.features.splice(index, 1);
  }

  onSave() {
    let drawData = { geometry: this.getGeoJsonFromFeature(), app_origin: 'app-base' }
    this.areaService.saveDrawedGeometry(drawData)
      .subscribe(data => {
        this.onSearchDrawnGeometry.emit(data.token);
        this.printRegionsIdentification(data.token);
        this.onCancel();
      })
  }

  printRegionsIdentification(token) {
    let dd = {
      pageSize: { width: 400, height: 400 },

      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',

      content: [],
      styles: {
        titleReport: {
          fontSize: 16,
          bold: true
        },
        textFooter: {
          fontSize: 9
        },
        textImglegend: {
          fontSize: 9
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        data: {
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        codCar: {
          fontSize: 11,
          bold: true,
        },
        textObs: {
          fontSize: 11,
        },
        tableDpat: {
          margin: [0, 5, 0, 15],
          fontSize: 11,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        token: {
          bold: true,
          fontSize: 16,
        },
        metadata: {
          background: '#0b4e26',
          color: '#fff'
        }
      }
    }

    // @ts-ignore
    dd.content.push({ image: this.localizationService.translate('area.token.logo'), width: 200, alignment: 'center' });
    // @ts-ignore
    dd.content.push({ text: this.localizationService.translate('area.token.description'), alignment: 'center', margin: [10, 10, 20, 0] });
    // @ts-ignore
    dd.content.push({ text: token, alignment: 'center', style: 'token', margin: [20, 20, 20, 10] });

    // @ts-ignore
    dd.content.push({ qr: token.toString(), fit: '200', alignment: 'center' });

    const filename =  this.localizationService.translate('area.token.title') + ' - ' + token + '.pdf'
    const win = window.open('', '_blank');
    pdfMake.createPdf(dd).open({}, win);
    // pdfMake.createPdf(dd).download(filename);
  }

  onCancel() {
    this.removeInteraction();
    this.mapControls.drawArea = false;
    this.mapControls.point = false;
    this.controlOptions = false;
  }

  onRightSideBarOpen(show) {
    if (show != undefined) {
      this.showRightSideBar = show;
      this.handleSideBars();
      setTimeout(() => {
        this.map.updateSize()
      });
    }
  }

  onClearFilter(ev) {
    this.updateRegion(this.defaultRegion);
  }

  addSwipe(layer) {
    let layerType: DescriptorType = layer.get('descriptorLayer');
    layerType.visible = true;
    this.changeLayerVisibility({ layer: layerType, updateSource: false });
    this.onSelectLayerSwipe.emit(layerType.valueType);
    this.addLayersToLeftSideSwipe(layer);
    this.swiperControl.addLayer(layer, true);
    this.map.addControl(this.swiperControl);
    setTimeout(() => {
      this.map.updateSize()
    });
  }

  removeSwipe() {
    this.map.removeControl(this.swiperControl);
  }

  addLayersToLeftSideSwipe(lay) {
    this.map.getLayers().getArray().forEach(layer => {
      if (layer.get('type') === 'layer' && layer.get('key') !== lay.get('key') && layer.getVisible()) {
        this.swiperControl.addLayer(layer, false);
      }
    });
    setTimeout(() => {
      this.map.updateSize()
    });
  }

  onDisplayFeatureInfo(evt): void {
    const self = this;
    const pixel: Pixel = this.map.getEventPixel(evt.originalEvent);
    console.log(pixel)
    this.map.forEachFeatureAtPixel(pixel, function(feature) {
      console.log(feature)
      // if(layer.get('type') === 'layer'){
      //   const url = layer.getSource().getFeatureInfoUrl(
      //     evt.coordinate,
      //     self.map.getView().getResolution(),
      //     'EPSG:4326',
      //     {INFO_FORMAT: 'application/json'}
      //   );

      // }
    });

      // if (this.lastSelected != null && this.lastSelected !== this.selecao.nativeElement) {
    //   // Não apresenta as informações se houver uma ferramenta ativa que não seja a específica de seleção.
    //   return;
    // }
    //
    // if (this.lastInfo != null) {
    //   this.map.removeOverlay(this.lastInfo);
    //   this.lastInfo = null;
    // }
    //
    // const tipoCoordenada = this.tipoCoordenadas.value;
    // const features = new Array<Feature>();
    // const text: Element[] = new Array<Element>();
    //
    // const sources: TileWMS[] = this.map.getLayers().getArray().filter(layer => layer.getSource() instanceof TileWMS);
    // for (const layer of sources) {
    //   if (!layer.getVisible()) {
    //     continue;
    //   }
    //
    //   const div = document.createElement('div');
    //   div.innerHTML = 'Carregando...';
    //   text.push(div);
    //
    //   const url = layer.getSource().getFeatureInfoUrl(
    //     evt.coordinate,
    //     this.map.getView().getResolution(),
    //     'EPSG:4674',
    //     {INFO_FORMAT: 'application/json'}
    //   );
    //
    //   this.httpClient.get<Camada[]>(`${environment.URL_GEOPORTAL_BASE_REFERENCIA}/api/camadas/featureInfo`, {
    //     responseType: 'json',
    //     params: {
    //       url: url
    //     }
    //   }).subscribe((ret: any) => {
    //     div.innerHTML = '';
    //     ret.forEach(item => {
    //       const properties = item.properties;
    //       Object.keys(properties).forEach((property: string) => {
    //         if (property !== 'geometry') {
    //           let valor = properties[property];
    //           if (valor instanceof Date) {
    //             valor = [valor.getDate(), valor.getMonth() + 1, valor.getFullYear()].map(n => n < 10 ? `0${n}` : `${n}`).join('/');
    //           }
    //           div.innerHTML += `<p><strong>${property.replace(/_/g, ' ')}:</strong> ${valor || ''}</p>`;
    //         }
    //       });
    //     });
    //   }, error => {
    //     if (error.status === 0) {
    //       alert('Sistema de informações de ponto indisponível');
    //     } else {
    //       console.log(error);
    //       alert(error.error || error.message);
    //       div.innerHTML = '';
    //     }
    //   });
    // }
    //
    // const geometrias: GeometriaMapa[] = this.getGeometriaCamadas();
    // this.map.forEachFeatureAtPixel(pixel, feature => features.push(feature));
    // features.forEach(feature => {
    //   // Não apresentar as informações se for a régua.
    //   if (!feature.regua) {
    //     const geometria = geometrias.find(g => g.feature === feature);
    //     const properties = {...(geometria && geometria.propriedades), ...feature.getProperties() || feature.properties};
    //
    //     if (properties) {
    //       if (feature.id_) {
    //         properties.id = feature.id_;
    //       }
    //
    //       Object.keys(properties).forEach((property: string) => {
    //         if (property !== 'geometry') {
    //           let valor = properties[property];
    //           if (valor) {
    //             if (valor instanceof Date) {
    //               valor = [valor.getDate(), valor.getMonth() + 1, valor.getFullYear()].map(n => n < 10 ? `0${n}` : `${n}`).join('/');
    //             }
    //             const div = document.createElement('div');
    //             div.innerHTML = `<p><strong>${property.replace(/_/g, ' ')}:</strong> ${valor || ''}</p>`;
    //             text.push(div);
    //           }
    //         }
    //       });
    //     }
    //
    //     let coordinate: Coordinate;
    //     const geometry: Polygon = feature.getGeometry() || feature.geometry;
    //     if (geometry instanceof Polygon || geometry instanceof MultiPolygon) {
    //       if (text.length !== 0) {
    //         text.push(document.createElement('hr'));
    //       }
    //
    //       const div = document.createElement('div');
    //       div.innerHTML = `<p><strong>Área:</strong> ${calculaArea(getArea(geometry, {
    //         projection: this.map.getView().getProjection()
    //       }))}</p>`;
    //       text.push(div);
    //
    //       coordinate = geometry.getInteriorPoint().getCoordinates();
    //     } else if (geometry instanceof Point) {
    //       coordinate = toLonLat(geometry.getCoordinates(), this.map.getView().getProjection());
    //     } else {
    //       coordinate = toLonLat(evt.coordinate, this.map.getView().getProjection());
    //     }
    //
    //     if (coordinate != null) {
    //       let valor: string;
    //       if (tipoCoordenada === '1') {
    //         const formatado: string[] = this.formataCoordenada(coordinate).split(', ');
    //
    //         if (text.length > 0) {
    //           text.push(document.createElement('hr'));
    //         }
    //         valor = `<p><strong>Latitude:</strong> ${formatado[1]}</p>
    //                             <p class="latitude"><strong>Longitude:</strong> ${formatado[0]}</p>`;
    //       } else {
    //         valor = `<p class="latitude"><strong>Coordenadas:</strong> ${toStringHDMS(coordinate)}</p>`;
    //       }
    //
    //       const div = document.createElement('div');
    //       div.innerHTML = valor;
    //       text.push(div);
    //     }
    //
    //     if (geometria && ((geometria.extraOptions && geometria.extraOptions.length) || ((geometria.permissao && geometria.permissao.editar)))) {
    //       const div = document.createElement('div');
    //       div.style.marginTop = '10px';
    //       div.style.textAlign = 'right';
    //       div.style.whiteSpace = 'nowrap';
    //
    //       if (geometria.extraOptions) {
    //         geometria.extraOptions.forEach(option => {
    //           const span = document.createElement('span');
    //           span.className = 'mat-button-wrapper';
    //
    //           if (option.icon) {
    //             const icon = document.createElement('mat-icon');
    //             icon.className = 'mat-icon notranslate material-icons mat-icon-no-color';
    //             icon.setAttribute('role', 'img');
    //             icon.innerText = option.icon;
    //             span.appendChild(icon);
    //           }
    //
    //           span.appendChild(document.createTextNode(' ' + option.text));
    //           const button = document.createElement('button');
    //           button.style.marginLeft = '10px';
    //           if (option.callback) {
    //             button.addEventListener('click', (_) => {
    //               option.callback(geometria);
    //             });
    //           }
    //           button.appendChild(span);
    //           button.className = 'mat-raised-button mat-secondary';
    //           div.appendChild(button);
    //
    //           text.push(div);
    //         });
    //       }
    //
    //       if (geometria.permissao && geometria.permissao.editar) {
    //         const button = document.createElement('button');
    //         button.addEventListener('click', (_) => {
    //           this.editFeature.emit(geometria);
    //         });
    //
    //         const span = document.createElement('span');
    //         span.className = 'mat-button-wrapper';
    //
    //         const icon = document.createElement('mat-icon');
    //         icon.className = 'mat-icon notranslate material-icons mat-icon-no-color';
    //         icon.setAttribute('role', 'img');
    //         icon.innerText = 'edit';
    //         span.appendChild(icon);
    //
    //         span.appendChild(document.createTextNode(' Editar atributos'));
    //         button.style.marginLeft = '10px';
    //         button.appendChild(span);
    //         button.className = 'mat-raised-button mat-primary';
    //
    //         div.appendChild(button);
    //         text.push(div);
    //       }
    //     }
    //   }
    // });
    //
    // if (features.length === 0) {
    //   const coordinate = toLonLat(evt.coordinate, this.map.getView().getProjection());
    //   let valor: string;
    //   if (this.tipoCoordenadas.value === '1') {
    //     const formatado: string[] = this.formataCoordenada(coordinate).split(', ');
    //
    //     if (text.length > 0) {
    //       text.push(document.createElement('hr'));
    //     }
    //     valor = `<p><strong>Latitude:</strong> ${formatado[1]}</p>
    //                      <p class="latitude"><strong>Longitude:</strong> ${formatado[0]}</p>`;
    //   } else {
    //     valor = `<p class="latitude"><strong>Coordenadas:</strong> ${toStringHDMS(coordinate)}</p>`;
    //   }
    //   const div = document.createElement('div');
    //   div.innerHTML = valor;
    //
    //   text.push(div);
    // }
    //
    // if (text.length !== 0) {
    //   const closer = document.createElement('span');
    //   closer.className = 'ol-popup-closer';
    //
    //   const toolTip = document.createElement('div');
    //   toolTip.className = 'ol-popup ol-popup-info';
    //   toolTip.appendChild(closer);
    //   text.forEach(e => toolTip.appendChild(e));
    //
    //   // Não adiciona o offset da popup se não houver uma feature.
    //   const offset = features.length === 0 ? 0 : -15;
    //   this.lastInfo = new Overlay({
    //     element: toolTip,
    //     offset: [0, offset],
    //     positioning: 'bottom-center',
    //   });
    //
    //   this.lastInfo.setPosition(evt.coordinate);
    //   this.addOverlay(this.lastInfo);
    //
    //   closer.addEventListener('click', () => {
    //     if (this.lastInfo != null) {
    //       this.map.removeOverlay(this.lastInfo);
    //       this.lastInfo = null;
    //     }
    //   });
    // }
  }

}
