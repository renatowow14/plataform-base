import { Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {MenuItem} from 'primeng/api';



@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',  
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit {

  public Legendas: Legendas[];
  public mapaBase: mapaBase[];
  public Limites: Limites[];
  public basemap: string;

  items: MenuItem[];

  activeItem: MenuItem;

  checked1: boolean = true;
  checked2: boolean = false;


  activeIndex: number = 0;

  @Output() onMenuSelected = new EventEmitter<boolean>();
  @Output() onChangeLng = new EventEmitter<any>();
  @Output() onChangeMap = new EventEmitter<any>();

  public display: boolean;
  public open: boolean;
  public layersSideBar: boolean;
  public lang: string;
  public menu: Menu[];

  public displayOpcoes = false as boolean;

  constructor() {
    this.basemap = 'mapbox';
  }

  ngOnInit(): void {

    //Limites
    this.Limites = [
      {
        nome: 'Municipios',
        checked: this.checked2
      },
      {
        nome: 'Cerrados',
        checked: this.checked1
      },
      {
        nome: 'Estados',
        checked: this.checked1
      }
  ];

      //Map-Base
    this.mapaBase = [
        {
          nome: 'Geopolitico (MapBox)',
          key: 'mapbox',
          checked: true
        },
        {
          nome: 'Google Maps',
          key: 'google',
          checked: false
        },
        {
          nome: 'Mosaico Planet',
          key: 'planet',
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

  handleMenu(key){

    this.onMenuSelected.emit(key);
  }

  onChangeBaseMap(bmap){
    this.mapaBase = this.mapaBase.map((b) => {
      if(bmap !== b.key){
        b.checked = false;
      }
      return b;
    })
    this.basemap = bmap;
    this.onChangeMap.emit(this.basemap);
    console.log(this.basemap)
  }

}

export interface Legendas {
  nome: string;
  color: string;
}

export interface Limites {
  nome: string;
  checked: boolean;
}

export interface mapaBase {
  nome: string;
  key:string;
  checked: boolean;
}


export interface Menu {
  key: string;
  icon: string;
  title: string;
  tooltip: string;
}

