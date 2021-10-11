import {Component, Input, OnInit} from '@angular/core';
import { OlMapComponent } from "../ol-map/ol-map.component";

@Component({
  selector: 'ol-layer',
  templateUrl: './ol-layer.component.html',
  styleUrls: ['./ol-layer.component.scss']
})
export class OlLayerComponent implements OnInit {
  @Input() layer: any = {};
  constructor(private olMap: OlMapComponent) {}

  ngOnInit(): void {
    if (this.olMap.map) {
      this.olMap.addLayer(this.layer)
    } else {
      setTimeout(() => {
        this.ngOnInit();
      }, 10);
    }
  }

}
