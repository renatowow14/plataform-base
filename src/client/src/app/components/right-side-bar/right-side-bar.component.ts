import {
  Component,
  EventEmitter,
  OnInit,
  Renderer2,
  ElementRef,
  Output,
  HostListener,
  Input, SimpleChanges,
} from '@angular/core';
import { LocalizationService } from "../../@core/internationalization/localization.service";
import { MenuItem } from 'primeng/api';
import { ChartService } from '../services/charts.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../services/customer.service';
import { Customer } from 'src/app/@core/interfaces/customer';
import { Descriptor, Layer, Legend, Menu } from "../../@core/interfaces";
import Map from 'ol/Map';
import { reduce } from 'rxjs/operators';

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

  public Legendas: Legend[];
  public map: Map;
  public _displayOptions: boolean;
  public basemap: any;
  public limit: any;
  public innerHeigth: number;
  public timeSeriesResultDeforestation: any = {};
  public timeSeriesResultLulc: any = {};
  public timeSeriesResultLulc2: any = {};
  //Charts Variables
  public selectRegion: any;
  public optionsTimeSeriesDeforestation: any = {};
  public optionsTimeSeriesLulc: any = {};
  public layersNames = [];
  public desmatInfo: any;
  public changeTabSelected = ""
  public data: any;
  public DeforestationChart: any;
  public ob: any = {};
  public LulcChart: any;
  public LulcChart2: any;
  public userAppData2: any;
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

  items: MenuItem[];
  activeItem: MenuItem;


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
    private renderer: Renderer2,
    public dialog: MatDialog
  ) {

    //Charts Variables
    this.displayFullScreenCharts = false;
    this.displayDashboard = false;
    this.chartObject = {};
    this.changeTabSelected = "";

    this.LulcChart = {};

    this.dataSeries = {};

    this.defaultRegion = {
      type: 'biome',
      text: 'BRASIL',
      value: 'Brasil'
    };
    this.selectRegion = this.defaultRegion;

    this.desmatInfo = {
      value: 'year=2020',
      Viewvalue: '2019/2020',
      year: 2020
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

    this.options = {
      title: {
        display: true,
        text: 'My Title',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };


    this.expendGroup = false;

    //End charts


    this.basemap = 'mapbox';
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
    this.lang = this.localizationService.currentLang();
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

    this.activeItem = this.items[0];

    this.updateDeforestationTimeSeries();
    this.updateLulcTimeSeries();
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
    this.displayFullScreenCharts = true;

    this.ob = ob;

    console.log(this.ob);
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
    this.LulcChart = {
      dataLulc: this.timeSeriesResultLulc.data,
      optionsLulc: this.optionsTimeSeriesLulc,
      typeLulc: this.timeSeriesResultLulc.type
    }

    this.LulcChart2 = {
      dataLulc: this.timeSeriesResultLulc2.data,
      optionsLulc: this.optionsTimeSeriesLulc,
      typeLulc: this.timeSeriesResultLulc.type
    }

    console.log(this.LulcChart);
  }

  triggerSeriesChartDeforestation(event: Event) {
    this.DeforestationChart = {
      dataDeforestation: this.timeSeriesResultDeforestation.data,
      optionsDeforestation: this.optionsTimeSeriesDeforestation,
      typeDeforestation: this.timeSeriesResultDeforestation.type
    }

    console.log(this.DeforestationChart);
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
    // params.push('lang=' + this.lang)
    // params.push('typeRegion=' + this.selectRegion.type)
    // params.push('valueRegion=' + this.selectRegion.value)
    let textParam = params.join('&');
    let tempResultDeforestation: any[] = [];

    this.chartService.getDeforestation(textParam).subscribe(result => {
      tempResultDeforestation = result;
      for (let graphic of tempResultDeforestation) {

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

      this.timeSeriesResultDeforestation = tempResultDeforestation[0];
    }, error => {
      console.log(error)
    });


    this.DeforestationChart = {};
    this.ob = {};

    this.optionsTimeSeriesDeforestation = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(tooltipItem, data) {
              console.log('data:', data);
              let percent = parseFloat(
                data['datasets'][0]['data'][tooltipItem['index']]
              ).toLocaleString('de-DE');
              return percent + ' km²';
            }
          },
          usePointStyle: true
        },
        title: {
          align: 'bottom'
        },
        legend: {
          align: 'end',
          position: 'bottom'
        }
      },
        scales: {
          y:
            {
              ticks: {
                callback(value) {
                  return value.toLocaleString('de-DE') + ' km²';
                },
                color: 'red'
              }
            }
        },


    };

  }

  updateStatistics(region) {
   this.selectRegion = region;
   console.log("region:", region);
   this.updateLulcTimeSeries();
   this.triggerSeriesChartLulc();
  }

  updateLulcTimeSeries() {

    let params: string[] = [];

    console.log(this.selectRegion)

    params.push('lang=' + this.lang)
    params.push('typeRegion=' + this.selectRegion.type)
    params.push('valueRegion=' + this.selectRegion.value)
    let textParam = params.join('&');
    let tempResultLulc: any[] = [];

    this.chartService.getLulc(textParam).subscribe(result => {
      tempResultLulc = result;
      for (let graphic of tempResultLulc) {

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

      }
      console.log("result:", tempResultLulc);
      this.timeSeriesResultLulc = tempResultLulc[0];
      this.timeSeriesResultLulc2 = tempResultLulc[1];
    }, error => {
      console.log(error)
    });


    this.LulcChart = {};
    this.LulcChart2 = {};

    this.optionsTimeSeriesLulc = {
      responsive: true,
      plugins: {
        tooltips: {
          callbacks: {
            text: function(tooltipItem, data) {
              console.log('data:', data);
              let percent = parseFloat(
                data['datasets'][0]['data'][tooltipItem['index']]
              ).toLocaleString('de-DE');
              return percent + ' km²';
            }
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            fontSize: 14
          },
          // onHover(event) {
          //   event.target.style.cursor = 'pointer';
          // },
          // onLeave(event) {
          //   event.target.style.cursor = 'default';
          // },
          position: 'bottom'
        }
      },
        scales: {
          y:
            {
              ticks: {
                callback(value) {
                  return value.toLocaleString('de-DE') + ' km²';
                }
              }
            }
        },
        title: {
          display: false,
          fontSize: 14
        },


    };
  }

}



