import {Component, OnInit, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {MapService} from "../services/map.service";
import Map from 'ol/Map';
import {LocalizationService} from "../../@core/internationalization/localization.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public openMenu:boolean;
  public showLayers: boolean;
  public limit : any;
  public descriptor: any;

  constructor(
    private mapService: MapService,
    private localizationService: LocalizationService,
    private cdRef: ChangeDetectorRef
  ) {
    this.openMenu = true;
    this.showLayers = false;
  }

  ngOnInit(): void {
    this.getDescriptor();
    this.cdRef.detectChanges();
  }

  getDescriptor(){
    this.mapService.getDescriptor(this.localizationService.currentLang()).subscribe(descriptor => {
      setTimeout(() => this.descriptor = descriptor, 0);
    }, error => {
      console.log(error)
    });
  }

  onMenuSelected(item){
    this.showLayers = item.show;
  }

  onSideBarToggle(isOpen){
    this.showLayers = isOpen;
  }

  onMenuToggle(isOpen){
    this.openMenu = isOpen;
  }

  onChangeLanguage(){
    this.getDescriptor();
  }
}

