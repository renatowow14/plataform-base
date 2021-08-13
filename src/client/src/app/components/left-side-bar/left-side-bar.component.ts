import {Component, EventEmitter, OnInit, ElementRef, Output} from '@angular/core';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {

  @Output() onSideBarToggle = new EventEmitter<boolean>();
  @Output() onMenuSelected = new EventEmitter<boolean>();
  @Output() onChangeLng = new EventEmitter<any>();

  public display: boolean;
  public open: boolean;
  public layersSideBar: boolean;
  public lang: string;
  public menu: Menu[];

  constructor(private el: ElementRef) {
    this.open = true;
    this.layersSideBar = false;
    this.lang = 'pt';
    this.menu = [
      {
        key: 'dashboard',
        icon: 'bx bx-grid-alt',
        title: 'Dashboard',
        tooltip:'Dashboard',
      },
      {
        key: 'user',
        icon: 'bx bx-user',
        title: 'User',
        tooltip:'User',
      },
      {
        key: 'messages',
        icon: 'bx bx-chat',
        title: 'Messages',
        tooltip:'Messages',
      },
      {
        key: 'analytics',
        icon: 'bx bx-pie-chart-alt-2',
        title: 'Analytics',
        tooltip:'Analytics',
      },
      {
        key: 'files',
        icon: 'bx bx-folder',
        title: 'Files',
        tooltip:'Files',
      },
      {
        key: 'order',
        icon: 'bx bx-cart-alt',
        title: 'Order',
        tooltip:'Order',
      },
      {
        key: 'setting',
        icon: 'bx bx-cog',
        title: 'Setting',
        tooltip:'Setting',
      },
      {
        key: 'saved',
        icon: 'bx bx-heart',
        title: 'Saved',
        tooltip:'Saved',
      }
    ];
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

  handleMenu(key){
    console.log('key', key)
    let menuOption = this.el.nativeElement.querySelector("li");
    console.log(menuOption)
    this.layersSideBar = !this.layersSideBar;
    this.onMenuSelected.emit(key);
  }
}

export interface Menu {
  key: string;
  icon: string;
  title: string;
  tooltip: string;
}
