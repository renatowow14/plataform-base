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



@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit {

  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onSideBarToggle = new EventEmitter<boolean>()
  
  public Legendas: Legendas[];
  public mapaBase: Layer[];
  public Limites: Layer[];
  public basemap: any;
  public limit: any;
  

  items: MenuItem[];
  activeItem: MenuItem;

  @Input() descriptor: any;

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

  public displayOptions = false as boolean;

  constructor(private el: ElementRef, private localizationService: LocalizationService, private renderer: Renderer2) {
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

  this.activeItem = this.items[0];

  }
  displayOp(){
    this.displayOptions = !this.displayOptions;
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



