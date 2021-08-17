import {Component, EventEmitter, OnInit, ElementRef, Output} from '@angular/core';
import { LocalizationService } from "../../@core/internationalization/localization.service";

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {

  @Output() onSideBarToggle = new EventEmitter<boolean>();
  @Output() onMenuSelected = new EventEmitter<any>();
  @Output() onChangeLng = new EventEmitter<any>();

  public displayFilter: boolean;
  public open: boolean;
  public layersSideBar: boolean;
  public lang: string;
  public menu: Menu[];

  constructor(private el: ElementRef, private localizationService: LocalizationService) {
    this.open = true;
    this.layersSideBar = false;
    this.lang = 'pt';
    this.menu = [
      {
        index: 0,
        key: 'dashboard',
        icon: 'bx bx-grid-alt',
        title: 'Dashboard',
        tooltip:'Dashboard',
        show: false
      },
      {
        index: 1,
        key: 'user',
        icon: 'bx bx-user',
        title: 'User',
        tooltip:'User',
        show: false
      },
      {
        index: 2,
        key: 'messages',
        icon: 'bx bx-chat',
        title: 'Messages',
        tooltip:'Messages',
        show: false
      },
      {
        index: 3,
        key: 'analytics',
        icon: 'bx bx-pie-chart-alt-2',
        title: 'Analytics',
        tooltip:'Analytics',
        show: false
      },
      {
        index: 4,
        key: 'files',
        icon: 'bx bx-folder',
        title: 'Files',
        tooltip:'Files',
        show: false
      },
      {
        index: 5,
        key: 'order',
        icon: 'bx bx-cart-alt',
        title: 'Order',
        tooltip:'Order',
        show: false
      },
      {
        index: 6,
        key: 'setting',
        icon: 'bx bx-cog',
        title: 'Setting',
        tooltip:'Setting',
        show: false
      },
      {
        index: 7,
        key: 'saved',
        icon: 'bx bx-heart',
        title: 'Saved',
        tooltip:'Saved',
        show: false
      }
    ];
    this.displayFilter = false;
  }

  ngOnInit(): void {

  }

  toggleMenu(){
    this.open = !this.open;
    this.onSideBarToggle.emit(this.open);
  }

  handleLang(lng){
    this.lang = lng;
  }

  handleMenu(menu){
    this.menu.map(m => { return m.show = false});
    this.displayFilter = false;
    if(menu.key == 'filter'){
      this.displayFilter = !this.displayFilter;
    } else {
      this.menu[menu.index].show = true;
    }

    this.layersSideBar = !this.layersSideBar;
    this.onMenuSelected.emit({show: this.layersSideBar, key: menu.key});
  }
}

export interface Menu {
  index: number;
  key: string;
  icon: string;
  title: string;
  tooltip: string;
  show: boolean;
}
