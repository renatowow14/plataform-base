import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss']
})
export class GeneralMapComponent implements OnInit {

  @Input() displayLayers = true as boolean;
  @Input() open = true as boolean;
  public displayLegend = false as boolean;

  constructor() { }

  ngOnInit(): void {

  }

}
