import { Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {MenuItem} from 'primeng/api';



@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit {

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

  public displayOpcoes = false as boolean;

  constructor() {
    this.basemap = 'mapbox';
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
    this.displayOpcoes = !this.displayOpcoes;
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
  key: string;
  icon: string;
  title: string;
  tooltip: string;
}

