import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { MapService } from "../services/map.service";
import {LocalizationService} from "../../@core/internationalization/localization.service";
@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.scss']
})
export class GeneralMapComponent implements OnInit {

  @Input() displayLayers = true as boolean;
  @Input() open = true as boolean;
  @Output() onHide = new EventEmitter<any>();
  @Input() basemap: string;
  public displayLegend = false as boolean;
  public innerHeigth: number;
  public descriptor = {} as any;

  constructor(
    private mapService: MapService,
    private localizationService: LocalizationService,
  ) { }

  ngOnInit(): void {
    this.innerHeigth = window.innerHeight;
    this.mapService.getDescriptor(this.localizationService.currentLang()).subscribe(descriptor => {
      this.descriptor = descriptor;
      console.log(this.descriptor)
    }, error => {
      console.log(error)
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight;
  }

  hideLayers(){
    this.onHide.emit();
  }

}
