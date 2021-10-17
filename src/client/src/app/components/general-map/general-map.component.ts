import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import TileLayer from "ol/layer/Tile";
import Map from 'ol/Map';
import * as OlExtent from 'ol/extent.js';
import * as Proj from 'ol/proj';
import {LocalizationService} from "../../@core/internationalization/localization.service";
import TileGrid from "ol/tilegrid/TileGrid";
import {Descriptor, Control, Ruler} from "../../@core/interfaces";
import {DownloadService, MapService} from "../services";
import {saveAs} from 'file-saver';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Coordinate, createStringXY, toStringHDMS} from "ol/coordinate";
import {toLonLat} from "ol/proj";
import {Graticule, Overlay} from "ol";
import {BingMaps, XYZ} from "ol/source";
import {Fill, Stroke, Style} from "ol/style";
import {Geometry, LinearRing, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon} from 'ol/geom';
import {Feature} from "ol";
import {Draw, Interaction, Modify, Snap} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import VectorLayer from "ol/layer/Vector";
import CircleStyle from "ol/style/Circle";
import {RulerAreaCtrl, RulerCtrl} from "../../@core/interactions/ruler";


@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss']
})

export class GeneralMapComponent implements OnInit, Ruler{

  @Input() displayLayers = true as boolean;
  @Input() openMenu = true as boolean;
  @Input() showRightSideBar = false as boolean;
  @Input() descriptor: Descriptor;
  @Output() onHide = new EventEmitter<any>();
  @Output() mapInstance = new EventEmitter<Map>();

  public innerHeigth: number;
  public options: any = {}
  public bmaps = [] as any[];
  public layers = [] as any[];
  public selectedLayers = [] as any[];
  public limits = [] as any[];
  public graticule: Graticule;
  public map: Map;
  public mousePositionOptions: any;
  public showFormPoint: boolean;
  public loadingDown: boolean;
  public controlOptions: boolean;
  public lat: number;
  public lon: number;

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
  public regionFilterDefault: any;
  public msFilterRegion: string;
  public defaultRegion: any;
  public selectRegion: any;
  public year: any;

  private interaction: Interaction;

  private source: VectorSource<Geometry> = new VectorSource();
  private vector: VectorLayer<any> = new VectorLayer();
  private modify: Modify;
  private draw: any;
  private snap: any;
  private formataCoordenada: (coordinate: Coordinate) => string = createStringXY(8);

  valueRegion: any;

  optionsFilter: any[];

  constructor(
    public localizationService: LocalizationService,
    private downloadService: DownloadService,
    private cdRef: ChangeDetectorRef,
    private mapService: MapService
  ) {
    this.showFormPoint = false;
    this.loadingDown = false;
    this.controlOptions = false;
    this.layersTypes = [];
    this.layersNames = [];
    this.limitsNames = [];
    this.layersTMS = {};
    this.limitsTMS = {};

    this.mapControls = {
      swipe: false,
      search: false,
      drawArea: false,
      measure: false,
      measureArea: false,
      print: false,
    }

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
    this.initVectorLayerInteraction();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('descriptor')) {
      if (this.map && changes.descriptor.currentValue.hasOwnProperty('regionFilterDefault')) {
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
    this.basemapsAvaliable = [];
    this.cdRef.detectChanges();
  }

  changeVisibilityBasemap(ev) {
    let {bmap} = ev;
    this.map.getLayers().forEach(layer => {
      const properties = layer.getProperties();
      if (properties.key == bmap.key && properties.type == bmap.type) {
        layer.setVisible(true);
      } else if (properties.type == bmap.type) {
        layer.setVisible(false);
      }
    })
  }

  onChangeDescriptor() {
    // this.map.getLayers().forEach(layer => {
    //   if(layer){
    //     const properties = layer.getProperties();
    //     if (properties.type === 'layer') {
    //       this.map.removeLayer(layer)
    //     }
    //   }
    // });

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
        const baseMapAvaliable = this.bmaps.find(b => {
          return b.layer.get('key') === types.value;
        })
        if (baseMapAvaliable) {
          baseMapAvaliable.layer.set('label', types.viewValue)
          this.basemapsAvaliable.push(baseMapAvaliable)
        }
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

    if (layer.value == "planet") {
      result.push(`https://tiles.planet.com/basemaps/v1/planet-tiles/${layer.timeSelected}/gmap/{z}/{x}/{y}.png?api_key=d6f957677fbf40579a90fb3a9c74be1a`);
    } else {
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

    }
    return result;
  }

  private createTMSLayer(layer, type = 'layer') {
    return new TileLayer({
      properties: {
        key: layer.value,
        label: layer.label,
        descriptorLayer: layer,
        type: type,
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

    for (let bmap of this.basemapsAvaliable) {
      this.layers.push(bmap.layer)
    }

    for (let limits of this.limitsNames) {
      this.limitsTMS[limits.value] = this.createTMSLayer(limits, 'limit')
      this.layers.push(this.limitsTMS[limits.value])
    }
  }

  changeLayerVisibility(ev) {
    let {layer, updateSource} = ev;
    if (updateSource) {
      this.updateSourceLayer(layer);
    } else {
      if (layer.types) {
        for (let layerType of layer.types) {
          this.layersTMS[layerType.value].setVisible(false)
        }
      } else {
        this.layersTMS[layer.value].setVisible(false)
      }
      this.layersTMS[layer.selectedType].setVisible(layer.visible);

      if (layer.visible) {
        this.selectedLayers.push(this.layersTMS[layer.selectedType])
      } else {
        this.selectedLayers.forEach((item, index) => {
          if (item.getProperties().key === layer.selectedType) this.selectedLayers.splice(index, 1);
        });
      }

      this.selectedLayers.forEach((item, index) => {
        item.visible = item.get('visible');
      });

      this.updateZIndex();
    }
  }

  updateZIndex() {
    this.selectedLayers.forEach((item, index) => {
      item.setZIndex(index)
    });
  }

  onChangeTransparency(ev) {
    let {layer, opacity} = ev;
    const op = ((100 - opacity) / 100);
    const layerTMS = this.layersTMS[layer.value];
    if (layerTMS) {
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

    let {tipo, layer, e} = ev;
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
    } else if (tipo == 'csv') {
      this.downloadCSV(layer, yearDownload, filterRegion, columnsCSV);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedLayers, event.previousIndex, event.currentIndex);
    this.updateZIndex();
  }

  initVectorLayerInteraction(){
    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255,255,255,0.52)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 1,
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
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

  onSwipe(){
    this.controlOptions = true;
    this.mapControls.swipe = !this.mapControls.swipe
  }

  onSearch(){
    this.controlOptions = true;
    this.mapControls.search = !this.mapControls.search
  }

  onRuler(): void {
    this.mapControls.measure = !this.mapControls.measure;
    if(this.mapControls.measure){
      this.addInteraction(new RulerCtrl(this).getDraw());
    } else {
      this.unselect()
    }
  }

  onRulerArea(): void {
    this.mapControls.measureArea = !this.mapControls.measureArea
    if(this.mapControls.measureArea){
      this.addInteraction(new RulerAreaCtrl(this).getDraw());
    } else {
      this.unselect()
    }

  }

  onPolygon(): void {
    this.controlOptions = true;
    this.mapControls.drawArea= !this.mapControls.drawArea
    if(this.mapControls.drawArea){
      this.addDrawInteraction('Polygon');
    } else {
      this.unselect()
    }
  }

  removeInteraction(): void {
    if (this.interaction != null) {
      this.source.clear();
      this.map.removeInteraction(this.interaction);
      // @ts-ignore
      this.map.removeLayer(this.vector);
      this.map.removeInteraction(this.modify);
      this.map.removeInteraction(this.snap);
      // @ts-ignore

      this.interaction = null; this.vector = null; this.modify = null; this.snap = null;
      this.initVectorLayerInteraction();
    }
  }

  addInteraction(interaction: Interaction, type: string = ''): void {
    this.map.addLayer(this.vector);
    this.interaction = interaction;
    if(type === 'Polygon'){
      this.modify = new Modify({source: this.source});
      this.map.addInteraction(this.modify);
      this.map.addInteraction(this.interaction);
    }else{
      this.map.addInteraction(this.interaction);
    }

    this.snap = new Snap({source: this.source});
    this.map.addInteraction(this.snap);
  }

  getGeoJsonFromFeature(){
    this.draw.on('drawend', e => {
      if (this.isGeometry(e.feature)) {
        let geom: Feature<any>[] = [];
        this.source.getFeatures().forEach( function(feature) {
          geom.push(new Feature(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')));
        } );
        let writer = new GeoJSON();
        return writer.writeFeatures(geom);
      }
    });
  }

  addDrawInteraction(name: string): void {
    if (name !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: name
      });
      this.addInteraction(this.draw, name);
    }
  }

  handleSideBars() {
    let classes = "";
    if (this.displayLayers) {
      classes += 'open-layers '
    }
    if (this.showRightSideBar) {
      classes += 'open-layers-right'
    }

    return classes;
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
    this.removeInteraction();
  }

  private zoomExtent() {
    let map = this.map;
    if (this.selectRegion.type != '') {
      this.mapService.extent(this.selectRegion.value).subscribe(extentResult => {
        let features = (new GeoJSON()).readFeatures(extentResult, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        this.source.clear()
        this.source.addFeature(features[0])
        let extent = features[0].getGeometry().getExtent();
        map.getView().fit(extent, { duration: 1500 });
      })
    }
  }

  private updateSourceLayer(layer){
    let sourceLayers = this.layersTMS[layer.value].getSource();
    sourceLayers.setUrls(this.parseUrls(layer))
    sourceLayers.refresh();
  }

  private updateSourceAllLayers() {
    for (let layer of this.layersTypes) {
      this.updateSourceLayer(layer)
    }
  }

  updateRegion(region) {
    if (region == this.defaultRegion) {
      this.valueRegion = ''
    }

    this.selectRegion = region;

    if (this.selectRegion.type == 'municipio')
      this.msFilterRegion = "cd_geocmu = '" + this.selectRegion.value + "'"
    else if (this.selectRegion.type == 'estado')
      this.msFilterRegion = "uf = '" + this.selectRegion.value + "'"
    else
      this.msFilterRegion = ""

    this.zoomExtent();
    this.updateSourceAllLayers()

  }

  search(ev) {
    this.mapService.search(ev.query).subscribe(options => {
      this.optionsFilter = options;
    }, error => {
      console.log(error)
    });
  }

}
