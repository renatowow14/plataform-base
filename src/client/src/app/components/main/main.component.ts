import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public open:boolean;
  public showLayers:boolean;

  constructor() {
    this.open = true;
    this.showLayers = false;
  }

  ngOnInit(): void {

  }

  onMenuSelected(item){
    this.showLayers = item;
  }


}

