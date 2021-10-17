import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import Map from 'ol/Map';

import { MenuItem } from 'primeng/api';

import * as OlProj from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as OlExtent from 'ol/extent.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-leftsidebar-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @Input() map: Map;
  @Input() lang: string;

  httpOptions: any;

  /** Variables for upload shapdefiles **/
  public layerFromUpload: any = {
    label: null,
    layer: null,
    checked: false,
    visible: null,
    loading: false,
    dragArea: true,
    error: false,
    strokeColor: '#2224ba',
    token: '',
    analyzedAreaLoading: false,
    analyzedArea: {},
    heavyAnalysis: {},
    heavyAnalysisLoading: false
  };

  loadingPrintReport: boolean;

  public layerFromConsulta: any = {
    label: null,
    layer: null,
    checked: false,
    visible: null,
    loading: false,
    dragArea: true,
    error: false,
    strokeColor: '#257a33',
    token: '',
    analyzedAreaLoading: false,
    analyzedArea: {},
    heavyAnalysis: {},
    heavyAnalysisLoading: false
  };

  selectedIndexUpload: number;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

  }

  ngOnInit(): void {

  }


  public onFileComplete(data: any) {

    let map = this.map;

    this.layerFromUpload.checked = false;
    this.layerFromUpload.error = false;

    if (this.layerFromUpload.layer != null) {
      map.removeLayer(this.layerFromUpload.layer);
    }
    if (!data.hasOwnProperty('features')) {
      return;
    }

    if (data.features.length > 1) {
      this.layerFromUpload.loading = false;

      this.layerFromUpload.visible = false;
      this.layerFromUpload.label = data.name;
      this.layerFromUpload.layer = data;
      this.layerFromUpload.token = data.token;

    } else {
      this.layerFromUpload.loading = false;

      if (data.features[0].hasOwnProperty('properties')) {

        let auxlabel = Object.keys(data.features[0].properties)[0];
        this.layerFromUpload.visible = false;
        this.layerFromUpload.label = data.features[0].properties[auxlabel];
        this.layerFromUpload.layer = data;
        this.layerFromUpload.token = data.token;

      } else {
        this.layerFromUpload.visible = false;
        this.layerFromUpload.label = data.name;
        this.layerFromUpload.layer = data;
        this.layerFromUpload.token = data.token;
      }
    }

    this.layerFromUpload.visible = true;
    let vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
    });

    this.layerFromUpload.layer = new VectorLayer({
      source: vectorSource,
      style: [
        new Style({
          stroke: new Stroke({
            color: this.layerFromUpload.strokeColor,
            width: 4
          })
        }),
        new Style({
          stroke: new Stroke({
            color: this.layerFromUpload.strokeColor,
            width: 4,
            lineCap: 'round',
          })
        })
      ]
    });

    //	this.googleAnalyticsService.eventEmitter("uploadLayer", "Upload", "uploadLayer", 4);
  }

  changeTextUpload($e) {

    if (this.layerFromConsulta.error) {
      this.layerFromConsulta = {
        label: null,
        layer: null,
        checked: false,
        visible: null,
        loading: false,
        dragArea: true,
        error: false,
        strokeColor: '#257a33',
        token: '',
        analyzedAreaLoading: false,
        analyzedArea: {},
      };
    }
  }

  onChangeCheckUpload(event) {
    let map = this.map;
    this.layerFromUpload.checked = !this.layerFromUpload.checked;

    if (this.layerFromUpload.checked) {

      map.addLayer(this.layerFromUpload.layer);
      let extent = this.layerFromUpload.layer.getSource().getExtent();
      map.getView().fit(extent, { duration: 1800 });

      //   let prodes = this.layersNames.find(element => element.id === 'desmatamento_prodes');
      //   prodes.selectedType = 'bi_ce_prodes_desmatamento_100_fip';
      //   this.changeVisibility(prodes, undefined);
      //   this.infodataPastagemcity = null;

    } else {
      map.removeLayer(this.layerFromUpload.layer);
    }

  }

  async printRegionsIdentification(token) {
    console.log("TO DO")
  }

  async analyzeUploadShape(fromConsulta = false) {
    let params: string[] = [];
    let self = this;
    let urlParams = '';
    let urlParamsHeavyAnalysis = '';

    if (fromConsulta) {
      this.layerFromConsulta.analyzedAreaLoading = true;
      params.push('token=' + this.layerFromConsulta.token)
      this.layerFromConsulta.error = false;
      urlParams = '/service/upload/initialanalysis?' + params.join('&');

      try {
        let result = await this.http.get(urlParams, this.httpOptions).toPromise()
        this.layerFromConsulta.analyzedArea = result;
        this.layerFromConsulta.analyzedAreaLoading = false;

      } catch (err) {
        self.layerFromConsulta.analyzedAreaLoading = false;
        self.layerFromConsulta.error = true;
      }

      console.log(this.layerFromConsulta)

      // this.layerFromConsulta.heavyAnalysisLoading = true;
      // urlParamsHeavyAnalysis = '/service/upload/analysisarea?' + params.join('&');
      // let resultHeavyAnalysis = await this.http.get(urlParamsHeavyAnalysis).toPromise();
      // this.layerFromConsulta.heavyAnalysis = resultHeavyAnalysis;
      // this.layerFromConsulta.heavyAnalysisLoading = false;

      // this.googleAnalyticsService.eventEmitter("analyzeConsultaUploadLayer", "Analyze-Consulta-Upload", this.layerFromConsulta.token, 5);
    } else {
      this.layerFromUpload.analyzedAreaLoading = true;
      params.push('token=' + this.layerFromUpload.token)
      this.layerFromUpload.error = false;
      urlParams = '/service/upload/initialanalysis?' + params.join('&');

      try {
        let result = await this.http.get(urlParams, this.httpOptions).toPromise()
        this.layerFromUpload.analyzedArea = result;
        this.layerFromUpload.analyzedAreaLoading = false;
      } catch (err) {
        self.layerFromUpload.analyzedAreaLoading = false;
        self.layerFromUpload.error = true;
      }
      // this.layerFromUpload.heavyAnalysisLoading = true;
      // urlParamsHeavyAnalysis = '/service/upload/analysisarea?' + params.join('&');
      // let resultHeavyAnalysis = await this.http.get(urlParamsHeavyAnalysis).toPromise();
      // this.layerFromUpload.heavyAnalysis = resultHeavyAnalysis
      // this.layerFromUpload.heavyAnalysisLoading = false;
      // this.googleAnalyticsService.eventEmitter("analyzeUploadLayer", "Analyze-Upload", this.layerFromUpload.token, 6);
    }

  }

  clearUpload(fromConsulta = false) {
    if (fromConsulta) {
      this.layerFromConsulta.analyzedArea = {}
      this.map.removeLayer(this.layerFromConsulta.layer);
      this.layerFromConsulta.visible = false;
      this.layerFromConsulta.checked = false;
      this.layerFromConsulta.token = '';
      this.layerFromConsulta.error = false;
    } else {
      this.layerFromUpload.analyzedArea = {}
      this.map.removeLayer(this.layerFromUpload.layer);
      this.layerFromUpload.visible = false;
      this.layerFromUpload.checked = false;
    }
    //this.updateRegion(this.defaultRegion);
  }

  getCitiesAnalyzedArea(fromConsulta = false) {
    let cities = '';
    if (fromConsulta) {
      if (this.layerFromConsulta.analyzedArea.regions_intersected.hasOwnProperty('city')) {
        for (let [index, city] of this.layerFromConsulta.analyzedArea.regions_intersected.city.entries()) {
          let citiesCount = this.layerFromConsulta.analyzedArea.regions_intersected.city.length;
          if (citiesCount === 1) {
            cities += city.name + '.';
            return cities;
          }
          if (index === citiesCount - 1) {
            cities += city.name + '.';
          } else {
            cities += city.name + ', ';
          }
        }
      }
    } else {
      if (this.layerFromUpload.analyzedArea.regions_intersected.hasOwnProperty('city')) {
        for (let [index, city] of this.layerFromUpload.analyzedArea.regions_intersected.city.entries()) {
          let citiesCount = this.layerFromUpload.analyzedArea.regions_intersected.city.length;
          if (citiesCount === 1) {
            cities += city.name + '.';
            return cities;
          }
          if (index === citiesCount - 1) {
            cities += city.name + '.';
          } else {
            cities += city.name + ', ';
          }
        }
      }
    }

    return cities;
  }
  getStatesAnalyzedArea(fromConsulta = false) {
    let states = '';
    if (fromConsulta) {
      if (this.layerFromConsulta.analyzedArea.regions_intersected.hasOwnProperty('state')) {
        for (let [index, state] of this.layerFromConsulta.analyzedArea.regions_intersected.state.entries()) {
          let statesCount = this.layerFromConsulta.analyzedArea.regions_intersected.state.length;
          if (statesCount === 1) {
            states += state.name + '.';
            return states;
          }
          if (index === statesCount - 1) {
            states += state.name + '.';
          } else {
            states += state.name + ', ';
          }
        }
      }
    } else {
      if (this.layerFromUpload.analyzedArea.regions_intersected.hasOwnProperty('state')) {
        for (let [index, state] of this.layerFromUpload.analyzedArea.regions_intersected.state.entries()) {
          let statesCount = this.layerFromUpload.analyzedArea.regions_intersected.state.length;
          if (statesCount === 1) {
            states += state.name + '.';
            return states;
          }
          if (index === statesCount - 1) {
            states += state.name + '.';
          } else {
            states += state.name + ', ';
          }
        }
      }
    }

    return states;
  }

  async printAnalyzedAreaReport(fromConsulta = false) {
    this.loadingPrintReport = true;
    console.log("TO DO PRINT")
    this.loadingPrintReport = false;
  }

  async searchUploadShape() {
    let params: string[] = [];
    let self = this;
    let urlParams = '';


    this.layerFromConsulta.analyzedAreaLoading = true;
    params.push('token=' + this.layerFromConsulta.token)
    this.layerFromConsulta.error = false;
    urlParams = '/service/upload/findgeojsonbytoken?' + params.join('&');

    try {
      let result = await this.http.get(urlParams, this.httpOptions).toPromise()

      this.layerFromConsulta.analyzedArea = result;
      this.layerFromConsulta.analyzedAreaLoading = false;
      this.loadLayerFromConsultaToMap();

    } catch (err) {
      self.layerFromConsulta.analyzedAreaLoading = false;
      self.layerFromConsulta.error = true;
    }

  }

  loadLayerFromConsultaToMap() {
    const currentMap = this.map;
    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(this.layerFromConsulta.analyzedArea.geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
    });
    this.layerFromConsulta.layer = new VectorLayer({
      source: vectorSource,
      style: [
        new Style({
          stroke: new Stroke({
            color: this.layerFromConsulta.strokeColor,
            width: 4
          })
        }),
        new Style({
          stroke: new Stroke({
            color: this.layerFromConsulta.strokeColor,
            width: 4,
            lineCap: 'round'
          })
        })
      ]
    });
    currentMap.addLayer(this.layerFromConsulta.layer);
    const extent = this.layerFromConsulta.layer.getSource().getExtent();
    currentMap.getView().fit(extent, { duration: 1800 });

  }


}
