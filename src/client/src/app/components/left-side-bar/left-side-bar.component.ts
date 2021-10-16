import {
  Component,
  EventEmitter,
  AfterViewInit,
  Renderer2,
  ElementRef,
  Output,
  HostListener,
  Input,
  SimpleChanges
} from '@angular/core';
import Map from 'ol/Map';
import {LocalizationService} from "../../@core/internationalization/localization.service";
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements AfterViewInit {
  @Input() map: Map;
  @Output() onSideBarToggle = new EventEmitter<boolean>();
  @Output() onMenuToggle = new EventEmitter<boolean>();
  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onChangeLng = new EventEmitter<any>();
  @Output() onChangeMap = new EventEmitter<any>();
  @Output() onChangeLimits = new EventEmitter<any>();

  public Legendas: Legendas[];
  public mapaBase: Layer[];
  public Limites: Layer[];
  public basemap: any;
  public limit: any;

  items: MenuItem[];
  activeItem: MenuItem;



  public display: boolean;
  public open: boolean;
  public lang: string;
  public menu: Menu[];
  public displayOpcoes = false as boolean;
  public displayFilter: boolean;
  public innerHeigth: number;
  public layersSideBar: boolean;
  public layersSideBarMobile: boolean;
  public layersTitle: string;
  public menuMobile: Menu[];
  public currentMenu: Menu;
  public descriptor: any;
  public expendGroup: boolean;

  public textSearch: string;
  public results: string[];

  constructor(private el: ElementRef, private localizationService: LocalizationService, private renderer: Renderer2) {
    this.basemap = 'mapbox';
    this.open = true;
    this.layersSideBar = false;
    this.layersSideBarMobile = false;
    this.menu = [
      {
        index: 0,
        key: 'layers',
        icon: 'fg-layers',
        show: false
      },
      {
        index: 1,
        key: 'statistics',
        icon: 'bx bx-bar-chart-alt',
        show: false
      },
      {
        index: 2,
        key: 'area',
        icon: 'fg-polygon-hole-pt',
        show: false
      },
      {
        index: 3,
        key: 'options',
        icon: 'fg-map-options-alt',
        show: false
      }

    ];

    this.menuMobile = [
      {
        index: 0,
        key: 'layers',
        icon: 'fg-layers',
        show: false
      },
      {
        index: 1,
        key: 'statistics',
        icon: 'bx bx-bar-chart-alt',
        show: false
      },
      {
        index: 2,
        key: 'area',
        icon: 'fg-polygon-hole-pt',
        show: false
      },
      {
        index: 3,
        key: 'options',
        icon: 'fg-map-options-alt',
        show: false
      }
    ];
    this.displayFilter = false;
    this.descriptor = {
      "groups": []
    }
    this.currentMenu = {
      index: 0,
      key: 'layers',
      icon: 'fg-layers',
      show: false
    }
    this.expendGroup = false;

  }

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
    this.innerHeigth = window.innerHeight - 170;
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

    // this.http.get('service/map/descriptor?lang=' + this.language).subscribe(result => {
    //   this.descriptor = result
    //   this.regionFilterDefault = this.descriptor.regionFilterDefault;
    //
    //   for (let groups of this.descriptor.groups) {
    //
    //     for (let layers of groups.layers) {
    //       if (layers.types) {
    //         for (let types of layers.types) {
    //           this.layersTypes.push(types)
    //         }
    //       } else {
    //         this.layersTypes.push(layers);
    //       }
    //       // this.layersTypes.sort(function (e1, e2) {
    //       // 	return (e2.order - e1.order)
    //       // });
    //
    //       this.layersNames.push(layers);
    //     }
    //
    //   }
    //   for (let basemap of this.descriptor.basemaps) {
    //     for (let types of basemap.types) {
    //       this.basemapsNames.push(types)
    //     }
    //   }
    //
    //   for (let limits of this.descriptor.limits) {
    //     for (let types of limits.types) {
    //       this.limitsNames.push(types)
    //     }
    //   }
    //
    //   this.createMap();
    //   this.updateCharts();
    //   this.addPoints();
    // });
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
  
  ngOnChanges(changes: SimpleChanges) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight - 170;
  }

  toggleMenu() {
    this.open = !this.open;
    this.onMenuToggle.emit(this.open);
    if(this.map){
      setTimeout(() => { this.map.updateSize() }, 300);
    }
  }

  handleLang(lng) {
    this.lang = lng;
    this.localizationService.useLanguage(this.lang).then(r => {
      this.layersTitle = this.localizationService.translate('menu.' + this.currentMenu.key);
    });
  }

  onSideBarShow() {
    const div = this.renderer.createElement('div');
    const img = this.renderer.createElement('img');
    this.renderer.addClass(div, 'header');
    this.renderer.addClass(img, 'logo');
    this.renderer.setProperty(img, 'src', '../../../assets/logos/logo.svg')
    this.renderer.setProperty(img, 'alt', 'Logo')
    this.renderer.appendChild(div, img);
    this.renderer.insertBefore(this.el.nativeElement.querySelector(".p-sidebar-header"), div, this.el.nativeElement.querySelector(".p-sidebar-close"))
  }


  onSideBarShowMobile() {
    const div = this.renderer.createElement('div');
    const img = this.renderer.createElement('img');
    this.renderer.addClass(div, 'header');
    this.renderer.addClass(img, 'logo');
    this.renderer.setProperty(img, 'src', '../../../assets/logos/logo.svg')
    this.renderer.setProperty(img, 'alt', 'Logo')
    this.renderer.appendChild(div, img);
    this.renderer.insertBefore(this.el.nativeElement.querySelector(".p-sidebar-header"), div, this.el.nativeElement.querySelector(".p-sidebar-close"));
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

  search(event) {
    // this.mylookupservice.getResults(event.query).then(data => {
    //   this.results = data;
    // });
  }

  setMap(map) {
    this.map = map;
  }
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
