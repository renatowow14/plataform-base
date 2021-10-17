import {
  Component,
  EventEmitter,
  AfterViewInit,
  Renderer2,
  ElementRef,
  OnInit,
  Output,
  HostListener,
  Input,
  SimpleChanges
} from '@angular/core';
import Map from 'ol/Map';
import {LocalizationService} from "../../@core/internationalization/localization.service";
import {MenuItem} from 'primeng/api';
import { ChartService } from '../services/charts.service';
import {Legend, Metadata} from "../interfaces";


@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit {

  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onSideBarToggle = new EventEmitter<boolean>()
  @Input() descriptor: any;

  public activeIndexLateralAccordion: any

  public Legendas: Legendas[];
  public mapaBase: Layer[];
  public Limites: Layer[];
  public basemap: any;
  public limit: any;
  public innerHeigth: number;

  //Charts Variables
  public selectRegion: any;
  public dataSeries: any;
  public optionsTimeSeries: any;
  public layersNames = [];
  public desmatInfo: any;
  public defaultRegion: any;
  public changeTabSelected = ""
  public viewWidth = 600;
  public viewWidthMobile = 350;
  public data: any;
  public data2: any;
  public userAppData2: any;
  public options: any;
  public expendGroup: boolean;
  public expendGroup2: boolean;
  public groupLayers: any[];
  //End Charts Variables

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

  //examples chart
  public userAppData: any;
  public appUserCount1: any;
  public appUserCount2: any;
  public appUserCount3: any;
  public appUserCount4: any;
  public appUserCount5: any;
  public userLabel: any;
  public userUsageHoursData;
  //end examples chart


  public displayOptions = false as boolean;

  constructor(private el: ElementRef, private localizationService: LocalizationService, private chartService: ChartService, private renderer: Renderer2) {

    //Charts Variables

    this.changeTabSelected = "";

    this.dataSeries = {};

    this.defaultRegion = {
      type: 'biome',
      text: 'Cerrado',
      value: 'Cerrado',
      area_region: 2040047.67930316,
      regionTypeBr: 'Bioma'
    };
    this.selectRegion = this.defaultRegion;

    this.desmatInfo = {
      value: 'year=2020',
      Viewvalue: '2019/2020',
      year: 2020
    };

    this.data = {
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
  };

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
  //char test
  appUsageData = [
    { name: 'user1', country: 'USA', appname: 'app-1' },
    { name: 'user2', country: 'UK', appname: 'app-1' },
    { name: 'user3', country: 'Canada', appname: 'app-1' },
    { name: 'user4', country: 'Germany', appname: 'app-1' },
    { name: 'user5', country: 'Poland', appname: 'app-2' },
    { name: 'user6', country: 'USA', appname: 'app-2' },
    { name: 'user7', country: 'Canada', appname: 'app-2' },
    { name: 'user8', country: 'Germany', appname: 'app-3' },
    { name: 'user9', country: 'USA', appname: 'app-3' },
    { name: 'user10', country: 'Germany', appname: 'app-3' },
    { name: 'user11', country: 'Canada', appname: 'app-3' },
    { name: 'user12', country: 'USA', appname: 'app-3' },
    { name: 'user13', country: 'India', appname: 'app-3' },
    { name: 'user14', country: 'India', appname: 'app-3' },
    { name: 'user15', country: 'Canada', appname: 'app-4' },
    { name: 'user16', country: 'USA', appname: 'app-4' },
    { name: 'user17', country: 'India', appname: 'app-5' },
    { name: 'user18', country: 'India', appname: 'app-5' },
    { name: 'user19', country: 'Canada', appname: 'app-5' },
    { name: 'user20', country: 'USA', appname: 'app-5' },
    { name: 'user21', country: 'manager', appname: 'app-5' },
  ];
  //end chart test

  ngAfterViewInit(): void {
    let navtab = document.querySelector("nav.navtab");
    let navtabItems = document.querySelectorAll("li.navtab-item");
    navtabItems.forEach((navtabItem, activeIndex) =>
      navtabItem.addEventListener("click", () => {
        navtabItems.forEach(navtabItem => navtabItem.classList.remove("active"));
        navtabItem.classList.add("active");
        (navtab as HTMLElement).style.setProperty(
          "--active-index",
          `${activeIndex}`
        );
      })
    );
    this.lang = this.localizationService.currentLang();
    this.innerHeigth = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight;
  }

  ngOnInit(): void {

    //chart test
    this.appUserCount1 = this.appUsageData.filter(
      (app) => app.appname === 'app-1'
    ).length;
    this.appUserCount2 = this.appUsageData.filter(
      (app) => app.appname === 'app-2'
    ).length;
    this.appUserCount3 = this.appUsageData.filter(
      (app) => app.appname === 'app-3'
    ).length;
    this.appUserCount4 = this.appUsageData.filter(
      (app) => app.appname === 'app-4'
    ).length;
    this.appUserCount5 = this.appUsageData.filter(
      (app) => app.appname === 'app-5'
    ).length;

    this.userLabel = this.appUsageData
      .map((app) => app.appname)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.userAppData = {
      labels: this.userLabel,
      datasets: [
        {
          data: [
            this.appUserCount1,
            this.appUserCount2,
            this.appUserCount3,
            this.appUserCount4,
            this.appUserCount5,
          ],
          backgroundColor: [
            '#ff0000',
            '#0000FF',
            '#FFFF00',
            '#FFC0CB',
            '#7f00ff ',
          ],
        },
      ],
    };

    this.userUsageHoursData = {
      labels: ['Jan', 'Feb', 'March', 'April'],
      datasets: [
        {
          label: 'app-1',
          backgroundColor: '#42A5F5',
          data: [44, 65, 23, 77],
        },
        {
          label: 'app-2',
          backgroundColor: '#ff0000',
          borderColor: '#7CB342',
          data: [14, 65, 16, 100],
        },
      ],
    };

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
  
    //end chart test
    //Limites
    this.Limites = [];

      //Map-Base
    this.mapaBase = [
        {
          nome: 'Geopolitico (MapBox)',
          key: 'mapbox',
          type: 'bmap',
          checked: true
        },
        {
          nome: 'Google Maps',
          key: 'google',
          type: 'bmap',
          checked: false
        },
        {
          nome: 'Mosaico Planet',
          key: 'planet',
          type: 'bmap',
          checked: false
        },
        {
          nome: 'Stadia Dark',
          key: 'stadia',
          type: 'bmap',
          checked: false
        }
    ];

    //Legendas
    this.Legendas = [
      {
        nome: '<= 5km²',
        color: 'green'
      },
      {
        nome: '5 - 15 km²',
        color: 'orange'
      },
      {
        nome: '15 - 25 km²',
        color: 'yellow'
      }
  ];

    //titulos do menu
    this.items = [
      {label: 'Legenda', icon: 'pi pi-fw pi-home'},
      {label: 'Mapa-Base', icon: 'pi pi-fw pi-calendar'},
      {label: 'Limites', icon: 'pi pi-fw pi-pencil'},
  ];
  this.expendGroup = false;
  this.expendGroup2 = false;

  this.activeItem = this.items[0];

  /* this.updateDeforestationTimeSeries();
  this.updateLulcTimeSeries(); */

}
  displayOp(){
    this.displayOptions = !this.displayOptions;
  }


  update2(event: Event) {
   this.userAppData2 = this.userAppData //create new data
}

  update(event: Event) {
    this.data2 = this.userUsageHoursData //create new data
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
      this.onMenuSelected.emit({show: this.layersSideBar, key: menu.key})
    }
  }


  handleLang(lng){
    this.lang = lng;
  }

  onChangeBaseMap(bmap){
    this.mapaBase = this.mapaBase.map((b) => {
      if(bmap !== b.key){
        b.checked = false;
      }
      return b;
    })
    this.basemap = this.mapaBase.find(b => bmap === b.key);
    this.onChangeMap.emit(this.basemap);
  }

  /* private updateDeforestationTimeSeries() {
    let timeseriesUrl = '/service/deforestation/timeseries' + this.getServiceParams();
  

    this.http.get(timeseriesUrl).subscribe(timeseriesResult => {

      this.dataSeries = {
        title: timeseriesResult['title'],
        labels: timeseriesResult['series'].map(element => element.year),
        datasets: [
          {
            label: timeseriesResult['name'],
            data: timeseriesResult['series'].map(element => element.value),
            fill: false,
            borderColor: '#289628',
            backgroundColor: '#289628'
          }
        ],
        area_antropica: timeseriesResult['indicator'].anthropic,
        description: timeseriesResult['getText'],
        label: timeseriesResult['label'],
        type: timeseriesResult['type'],
        pointStyle: 'rect'

      };

      this.optionsTimeSeries = {
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              let percent = parseFloat(
                data['datasets'][0]['data'][tooltipItem['index']]
              ).toLocaleString('de-DE');
              return percent + ' km²';
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback(value) {
                  return value.toLocaleString('de-DE') + ' km²';
                }
              }
            }
          ]
        },
        title: {
          display: false,
          fontSize: 14
        },
        legend: {
          labels: {
            usePointStyle: true,
            fontSize: 14
          },
          onHover(event) {
            event.target.style.cursor = 'pointer';
          },
          onLeave(event) {
            event.target.style.cursor = 'default';
          },
          position: 'bottom'
        }
      };
    });
  } */

  onOpenLateralAccordionLULCTab(e) {

    if (((this.selectRegion.type == 'city') && (e.index == 1)) || ((this.selectRegion.type == 'state') && (e.index == 1))) {
      this.activeIndexLateralAccordion = true
     // this.changeSelectedLulcChart({ index: 0 });
    }
    else {
      this.activeIndexLateralAccordion = false
    }

  }

  // onChangeLimit(limit){
  //   this.mapaBase = this.mapaBase.map((b) => {
  //     if(bmap !== b.key){
  //       b.checked = false;
  //     }
  //     return b;
  //   })
  //   this.basemap = this.mapaBase.find(b => bmap === b.key);
  //   this.onChangeLimit.emit(this.basemap);
  // }

}

export interface Legendas {
  nome: string;
  color: string;
}

export interface Layer {
  nome: string;
  key:string;
  type: string;
  checked: boolean;
}


export interface Menu {
  index: number;
  key: string;
  icon: string;
  show: boolean;
}



