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
import { MenuItem } from 'primeng/api'
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  providers: [MessageService]
})
export class LeftSideBarComponent implements AfterViewInit {
  @Input() map: Map;
  @Input() descriptor: any;
  @Output() onSideBarToggle = new EventEmitter<boolean>();
  @Output() onMenuToggle = new EventEmitter<boolean>();
  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onChangeLng = new EventEmitter<any>();

  public displayFilter: boolean;
  public open: boolean;
  public innerHeigth: number;
  public layersSideBar: boolean;
  public layersSideBarMobile: boolean;
  public layersTitle: string;
  public lang: string;
  public menu: Menu[];
  public menuMobile: Menu[];
  public currentMenu: Menu;
  public expendGroup: boolean;

  public textSearch: string;
  public results: string[];

  public groupLayers: any[];
  public

  constructor(
    private el: ElementRef,
    private localizationService: LocalizationService,
    private renderer: Renderer2,
    private messageService: MessageService
  ) {


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

  ngOnChanges(changes: SimpleChanges) {
    console.log('LEFT SIDE BAR', changes);
    if (changes.hasOwnProperty('descriptor')) {
      if (changes.descriptor) {

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
      }, 300);
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

  layerMenu(layer) {
    let menu: MenuItem[];
    menu = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-plus'
      },
      {
        label: 'File',
        icon: 'pi pi-fw pi-plus'
      },
      {
        label: 'File',
        icon: 'pi pi-fw pi-plus'
      },
      {
        label: 'File',
        icon: 'pi pi-fw pi-plus'
      }
    ];

    return menu
  }
}

export interface Menu {
  index: number;
  key: string;
  icon: string;
  show: boolean;
}
