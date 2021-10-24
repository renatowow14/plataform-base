import {
  Component,
  EventEmitter,
  OnInit,
  Renderer2,
  ElementRef,
  Output,
  HostListener,
  Input,
  SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import Map from 'ol/Map';
import {LocalizationService} from "../../@core/internationalization/localization.service";

import {Legend, Menu, Layer, Metadata} from "../../@core/interfaces";
import {MessageService} from "primeng/api";
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  providers: [MessageService]
})
export class LeftSideBarComponent implements OnInit {
  @Input() map: Map;
  @Input() descriptor: any;
  @Input() basesmaps: any[];
  @Input() loadingDownload: any;
  @Output() onSideBarToggle = new EventEmitter<boolean>();
  @Output() onMenuToggle = new EventEmitter<boolean>();
  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onChangeLng = new EventEmitter<any>();
  @Output() onLayerChangeVisibility = new EventEmitter<any>();
  @Output() onLayerChangeTransparency = new EventEmitter<any>();
  @Output() onDownload = new EventEmitter<any>();
  @Output() onChangeMap = new EventEmitter<any>();
  @Output() onChangeLimits = new EventEmitter<any>();
  @Output() displayFilter = new EventEmitter<any>();

  public Legendas: Legend[];
  public limits: Layer[];
  public basemap: any;
  public limit: any;

  items: MenuItem[];

  public display: boolean;
  public open: boolean;
  public lang: string;
  public menu: Menu[];
  public innerHeigth: number;
  public layersSideBar: boolean;
  public layersSideBarMobile: boolean;
  public showFilter: boolean;
  public layersTitle: string;
  public menuMobile: Menu[];
  public currentMenu: Menu;
  public optionsGroups: any;
  public expendGroup: boolean;
  public expendGroup2: boolean;

  public displayStatistics: boolean;

  public textSearch: string;
  public results: string[];
  public groupLayers: any[];

  public metadata: any;
  public displayMetadata: boolean;

  constructor(
    private el: ElementRef,
    private localizationService: LocalizationService,
    private renderer: Renderer2,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef
  ) {
    this.metadata = {};
    this.displayMetadata = false;
    this.showFilter = false;
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

    this.currentMenu = {
      index: 0,
      key: 'layers',
      icon: 'fg-layers',
      show: false
    }

    this.optionsGroups = {
      basemaps: false,
      limits: false,
      settings: false
    };
    this.expendGroup = false;
    this.expendGroup2 = false;

  }

  ngOnInit(): void {
    // this.basesmaps = [
    //   {
    //     name: 'Geopolitico (MapBox)',
    //     key: 'mapbox',
    //     type: 'bmap',
    //     checked: true
    //   },
    //   {
    //     name: 'Google Maps',
    //     key: 'google',
    //     type: 'bmap',
    //     checked: false
    //   },
    //   {
    //     name: 'Mosaico Planet',
    //     key: 'planet',
    //     type: 'bmap',
    //     checked: false
    //   },
    //   {
    //     name: 'Stadia Dark',
    //     key: 'stadia',
    //     type: 'bmap',
    //     checked: false
    //   }
    // ];

    if(this.basesmaps){
      this.basesmaps = this.basesmaps.map(bmap => {
        return bmap['visible'] = bmap.layer.get('visible')
      });
    }

    this.lang = this.localizationService.currentLang();
    this.innerHeigth = window.innerHeight - 170;
    this.cdRef.detectChanges();
  }

  onChangeBaseMap(bmap) {
    this.basesmaps = this.basesmaps.map((b) => {
      if (bmap !== b.key) {
        b.checked = false;
      }
      return b;
    })
    this.basemap = this.basesmaps.find(b => bmap === b.key);
    this.onChangeMap.emit({layer: this.basemap, updateSource: false});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('descriptor')) {
      if (changes.descriptor.currentValue) {
        this.descriptor = changes.descriptor.currentValue;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight - 170;
  }

  toggleMenu() {
    this.open = !this.open;
    this.onMenuToggle.emit(this.open);
    if (this.map) {
      setTimeout(() => {
        this.map.updateSize()
      });
    }
  }

  handleLang(lng) {
    this.lang = lng;
    this.localizationService.useLanguage(this.lang).then(r => {
      this.layersTitle = this.localizationService.translate('menu.' + this.currentMenu.key);
      this.onChangeLng.emit()
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

  hideSidebar(){
    setTimeout(() => {
      this.map.updateSize()
    });
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

    if (menu.key == 'statistics') {
      this.displayStatistics = !this.displayStatistics;
      this.layersSideBar = false;
      this.onSideBarToggle.emit(this.layersSideBar);
    } else {
      this.menu[menu.index].show = true;
      this.layersSideBar = true;
    }

    if (mobile) {
      this.layersSideBarMobile = true;
      // this.onMenuSelected.emit({show: this.layersSideBarMobile, key: menu.key});

    } else {
      if (menu.key == 'statistics') {

      } else {
        this.layersSideBar = true;
        this.onMenuSelected.emit({show: this.layersSideBar, key: menu.key})
      }
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

  enableMetadata(layer) {
    let enable = false;

    if (layer.hasOwnProperty('types')) {
      const seleted = layer.types.find(type => {
        return type.value = layer.selectedType;
      });
      enable = seleted.hasOwnProperty('metadata');
    } else {
      enable = layer.hasOwnProperty('metadata')
    }

    return enable && layer.visible;
  }

  formatMetadata(metadata) {
    let dt: any = {
      title: '',
      data: []
    };
    Object.getOwnPropertyNames(metadata).forEach(col => {
      if (col == 'title') {
        dt.title = metadata[col];
      }
      dt.data.push({title: this.localizationService.translate('metadata.' + col), description: metadata[col]})
    });
    return dt;
  }

  showMetadata(layer) {
    this.metadata = null;
    if (layer.hasOwnProperty('types')) {
      const seleted = layer.types.find(type => {
        return type.value == layer.selectedType;
      });
      if (seleted.metadata) {
        this.metadata = this.formatMetadata(seleted.metadata);
        this.displayMetadata = true;
      } else {
        this.metadata = null;
        this.displayMetadata = false;
      }
    } else {
      this.metadata = this.formatMetadata(layer.metadata);
      this.displayMetadata = true;
    }
  }

  isDetails(data) {
    return (data == "Detalhes" || data == "Details") ? true : false;
  }

  download(type, layer, ev) {
    this.onDownload.emit({tipo: type, layer: layer, e: ev});
  }

  onChangeTransparency(layer, ev) {
    this.onLayerChangeTransparency.emit({layer: layer, opacity: ev.target.value})
  }

  changeLayerVisibility(layer, updateSource = false) {
    this.onLayerChangeVisibility.emit({layer: layer, updateSource: updateSource})
  }

  onFilter(){
    this.showFilter = !this.showFilter;
    this.displayFilter.emit(this.showFilter);
    setTimeout(() => {
      this.map.updateSize()
    });
    this.cdRef.detectChanges();
  }

  handleMenuActive(menu){
    let classes = '';
    if(menu.key == 'statistics'){
      classes = this.displayStatistics ? 'menu-active' : '';
    }else{
      classes =  menu.show ? 'menu-active' : '';
    }
    return classes;
  }
}
