import {Component, EventEmitter, OnInit, Renderer2, ElementRef, Output, HostListener} from '@angular/core';
import {LocalizationService} from "../../@core/internationalization/localization.service";

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit{

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
  public currentMenu: Menu;
  public descriptor: any;

  public textSearch: string;
  public results: string[];

  constructor(private el: ElementRef, private localizationService: LocalizationService, private renderer: Renderer2) {


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
        icon: 'fg-polygon-hole-pt',
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

    }

  ngOnInit(): void {



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
    this.innerHeigth = window.innerHeight - 160;
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight - 160;
  }

  toggleMenu() {
    this.open = !this.open;
    this.onMenuToggle.emit(this.open);
  }

  handleLang(lng) {
    this.lang = lng;
    this.localizationService.useLanguage(this.lang).then(r => {
      this.layersTitle = this.localizationService.translate('menu.'+this.currentMenu.key);
    });
  }

  onSideBarShow(){
    const div = this.renderer.createElement('div');
    const img = this.renderer.createElement('img');
    this.renderer.addClass(div, 'header');
    this.renderer.addClass(img, 'logo');
    this.renderer.setProperty(img, 'src', '../../../assets/logos/logo.svg')
    this.renderer.setProperty(img, 'alt', 'Logo')
    this.renderer.appendChild(div, img);
    this.renderer.insertBefore(this.el.nativeElement.querySelector(".p-sidebar-header"), div, this.el.nativeElement.querySelector(".p-sidebar-close"))
  }


  onSideBarShowMobile(){
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
    this.layersTitle = this.localizationService.translate('menu.'+menu.key);

    if (menu.key == 'filters') {
      this.displayFilter = !this.displayFilter;
    } else {
      this.menu[menu.index].show = true;
    }
    if (mobile) {
      this.layersSideBarMobile = true;
      this.onMenuSelected.emit({show: this.layersSideBarMobile, key: menu.key});
      console.log(menu);

    }else{
      this.layersSideBar = true;
      this.onMenuSelected.emit({show: this.layersSideBar, key: menu.key})
      console.log(menu);
    }
    
;
  }
  
  search(event) {
    // this.mylookupservice.getResults(event.query).then(data => {
    //   this.results = data;
    // });
  }
}

export interface Menu {
  index: number;
  key: string;
  icon: string;
  show: boolean;
}
