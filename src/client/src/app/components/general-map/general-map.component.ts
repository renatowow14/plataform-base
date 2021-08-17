import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss']
})
export class GeneralMapComponent implements OnInit {

  @Input() displayLayers = true as boolean;
  @Input() open = true as boolean;
  @Output() onHide = new EventEmitter<any>();
  public displayLegend = false as boolean;

  constructor() { }

  ngOnInit(): void {

  }

  hideLayers(){
    this.onHide.emit();
  }

}
