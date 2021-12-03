import {
  Component,
  EventEmitter,
  OnInit,
  Renderer2,
  ElementRef,
  Output,
  HostListener,
  Input, SimpleChanges, ViewChild, ViewChildren, ChangeDetectorRef, QueryList
} from '@angular/core';
import { LocalizationService } from "../../@core/internationalization/localization.service";
import { ChartService } from '../services/charts.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../services/customer.service';
import { Customer } from 'src/app/@core/interfaces/customer';
import { Descriptor, Layer, Legend, Menu } from "../../@core/interfaces";
import Map from 'ol/Map';

import { UIChart } from 'primeng/chart';
import { GoogleAnalyticsService } from "../services/google-analytics.service";

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  providers: [CustomerService],
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit {

  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onSideBarToggle = new EventEmitter<boolean>()
  @Input() descriptor: Descriptor;

  @Input() set displayOptions(value: boolean) {
    this.onSideBarToggle.emit(value);
    this._displayOptions = value;
  }

  @ViewChildren('chartU') chartU: QueryList<UIChart>;

  public Legendas: Legend[];
  public map: Map;
  public _displayOptions: boolean;
  public innerHeigth: number;
  public timeSeriesResultDeforestation: any = {};

  public tempLulc = [] as any;
  public tempDeforestation = [] as any;

  public lulcCharts = [] as any;
  public deforestationCharts = [] as any;

  //Charts Variables
  public selectRegion: any;
  public optionsTimeSeriesDeforestation: any = {};
  public optionsTimeSeriesLulc: any = {};
  public changeTabSelected = ""
  public data: any;
  public ob: any = {};

  public options: any;
  public expendGroup: boolean;
  public expendGroup2: boolean;
  public expendGroup3: boolean;
  public groupLayers: any[];
  //End Charts Variables

  //Customer variables
  public customers: Customer[];
  public first = 0;
  public rows = 10;
  //end customer variables

  @Output() onChangeMap = new EventEmitter<any>();
  @Output() onChangeLimits = new EventEmitter<any>();

  public display: boolean;
  public open: boolean;
  public lang: string;
  public menu: Menu[];
  public currentMenu: Menu;
  public layersTitle: string;
  public displayFilter: boolean;
  public layersSideBar: boolean;
  public layersSideBarMobile: boolean;
  public displayFullScreenCharts: boolean;
  public displayDashboard: boolean;
  public chartObject: any;


  constructor(
    private el: ElementRef,
    private customerService: CustomerService,
    private localizationService: LocalizationService,
    private chartService: ChartService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    //Charts Variables
    this.displayFullScreenCharts = false;
    this.displayDashboard = false;
    this.chartObject = {};
    this.changeTabSelected = "";

    this.selectRegion = {
      type: 'country',
      text: 'BRASIL',
      value: 'Brasil'
    };

    this.data = [{
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],

      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    }];


    this.lang = this.localizationService.currentLang();

    this.updateStatistics(this.selectRegion)


    this.expendGroup = false;

    //End charts




    this.layersSideBar = false;
    this.layersSideBarMobile = false;
    this.currentMenu = {
      index: 0,
      key: 'layers',
      icon: 'fg-layers',
      show: false
    }
    this.displayFilter = false;

  }

  ngOnInit(): void {

    this.innerHeigth = window.innerHeight;

    this._displayOptions = false;

    this.customerService.getCustomersLarge().then(customers => this.customers = customers);

    this.options = {
      //display labels on data elements in graph
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          borderRadius: 4,
          backgroundColor: 'teal',
          color: 'white',
          font: {
            weight: 'bold',
          },
        },
        // display chart title
        title: {
          display: true,
          fontSize: 16,
        },
        legend: {
          position: 'bottom',
        },
      },
    };

    this.expendGroup = false;
    this.expendGroup2 = false;
    this.expendGroup3 = false;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight;
  }


  openDashboard() {
    this.displayDashboard = true;
  }

  openCharts(data, type, options) {
    let ob = {
      // title: title,
      // description: description,
      type: type,
      data: data,
      options: options,
    }

    this.ob = ob;

    this.displayFullScreenCharts = true;


    // this.dialog.open(ChartsComponent, {
    //   width: 'calc(100% - 20em)',
    //   height: 'calc(100% - 10em)',
    //   data: {ob}
    // });
  }

  next() {
    this.first = this.first + this.rows;
  }

  setMap(map) {
    this.map = map;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows) : true;
  }

  hideSideBar() {
    this.onSideBarToggle.emit(false);
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

  triggerSeriesChartLulc() {
    this.lulcCharts = this.tempLulc;
  }

  triggerSeriesChartDeforestation() {
    this.deforestationCharts = this.tempDeforestation
  }


  handleMenu(menu, mobile = false) {

    this.menu.map(m => {
      return m.show = false
    });
    this.currentMenu = menu;
    this.layersTitle = this.localizationService.translate('menu.' + menu.key);

    if (menu.key == 'filters') {
      this.displayFilter = !this.displayFilter;
    } else {
      this.menu[menu.index].show = true;
    }
    if (mobile) {
      this.layersSideBarMobile = true;
      // this.onMenuSelected.emit({show: this.layersSideBarMobile, key: menu.key});

    } else {
      this.layersSideBar = true;
      this.onMenuSelected.emit({ show: this.layersSideBar, key: menu.key })
    }

  }


  handleLang(lng) {
    this.lang = lng;
  }



  updateDeforestationTimeSeries() {
    let params: string[] = [];
    params.push('lang=' + this.localizationService.currentLang())
    params.push('typeRegion=' + this.selectRegion.type)
    params.push('valueRegion=' + this.selectRegion.value)
    params.push('textRegion=' + this.selectRegion.text)
    let textParam = params.join('&');

    this.chartService.getDeforestation(textParam).subscribe(result => {
      this.tempDeforestation = result;
      for (let graphic of this.tempDeforestation) {

        graphic.data = {
          labels: graphic.indicators.map(element => element.label),
          datasets: [
            {
              label: graphic.title,
              data: graphic.indicators.map(element => element.value),
              fill: false,
              borderColor: '#289628',
              backgroundColor: '#289628'

            }
          ],

        }

      }
    }, error => {
      console.log(error)
    });


    this.ob = {};


  }

  updateStatistics(region) {
    this.selectRegion = region;

    this.updateDeforestationTimeSeries();
    this.updateLulcTimeSeries();
    this.triggerSeriesChartDeforestation();
    this.triggerSeriesChartLulc();
  }

  triggerChartsDeforestation() {
    this.updateDeforestationTimeSeries();
    this.triggerSeriesChartDeforestation();
  }

  triggerChartsLulc() {
    this.updateLulcTimeSeries();
    this.triggerSeriesChartLulc();
  }

  updateAndTriggerCharts() {
    this.updateDeforestationTimeSeries();
    this.updateLulcTimeSeries();
    this.triggerSeriesChartDeforestation();
    this.triggerSeriesChartLulc();

    this.expendGroup = false;
    this.expendGroup2 = false;
    this.expendGroup3 = false;
  }

  updateLulcTimeSeries() {

    let params: string[] = [];

    params.push('lang=' + this.localizationService.currentLang())
    params.push('typeRegion=' + this.selectRegion.type)
    params.push('valueRegion=' + this.selectRegion.value)
    params.push('textRegion=' + this.selectRegion.text)
    let textParam = params.join('&');

    this.chartService.getLulc(textParam).subscribe(result => {
      this.tempLulc = result;
      for (let graphic of this.tempLulc) {

        graphic.data = {
          labels: graphic.indicators.map(element => element.label),
          datasets: [
            {
              label: graphic.title,
              data: graphic.indicators.map(element => element.value),
              backgroundColor: graphic.indicators.map(element => element.color),
              hoverBackgroundColor: graphic.indicators.map(element => element.color)

            }
          ],

        };

        graphic.options = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                fontSize: 10
              },
              position: 'bottom'
            }
          },
          title: {
            display: false,
            fontSize: 14
          }
        }

      }

    }, error => {
      console.log(error)
    })

  }

}



