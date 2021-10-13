import {Component, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {MapService} from "../services/map.service";
import Map from 'ol/Map';
import {LocalizationService} from "../../@core/internationalization/localization.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  public openMenu:boolean;
  public showLayers: boolean;
  public descriptor = {} as any;
  public bmap : string = 'mapbox';
  public limit : any;
  public map: Map;

  constructor(
    private mapService: MapService,
    private localizationService: LocalizationService,
    private cdRef: ChangeDetectorRef
  ) {
    this.openMenu = true;
    this.showLayers = false;
  }

  ngAfterViewInit(): void {
    this.mapService.getDescriptor(this.localizationService.currentLang()).subscribe(descriptor => {
      this.descriptor = descriptor;
    }, error => {
      console.log(error)
    });
    this.cdRef.detectChanges();
  }

  onMenuSelected(item){
    this.showLayers = item.show;
  }

  onChangeBaseMap(bmap){
    this.bmap = bmap;
  }

  onChangeLimit(limit){
    this.limit = limit;
  }

  onSideBarToggle(isOpen){
    this.showLayers = isOpen;
  }

  onMenuToggle(isOpen){
    this.openMenu = isOpen;
  }

  setMap(map){
    this.map = map;
    this.cdRef.detectChanges();
  }


}

