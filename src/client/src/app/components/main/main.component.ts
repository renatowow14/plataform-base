import {Component, OnInit, SimpleChanges} from '@angular/core';
import {MapService} from "../services/map.service";
import {LocalizationService} from "../../@core/internationalization/localization.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public openMenu:boolean;
  public showLayers: boolean;
  public descriptor = {} as any;
  public bmap : string = 'mapbox';
  public limit : any;

  constructor(
    private mapService: MapService,
    private localizationService: LocalizationService
  ) {
    this.openMenu = true;
    this.showLayers = false;
  }

  ngOnInit(): void {
    this.mapService.getDescriptor(this.localizationService.currentLang()).subscribe(descriptor => {
      this.descriptor = descriptor;
      console.log(this.descriptor)
    }, error => {
      console.log(error)
    });
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

}

