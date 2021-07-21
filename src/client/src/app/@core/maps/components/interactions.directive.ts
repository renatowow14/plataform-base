import {ChangeDetectorRef, Directive, Input} from '@angular/core';
import {
  DoubleClickZoom,
  DragPan,
  DragRotate,
  DragZoom,
  KeyboardPan,
  KeyboardZoom,
  MouseWheelZoom,
  PinchZoom
} from 'ol/interaction';
import {MapComponent} from './map.component';

@Directive({
  selector: 'ol-map > [olInteractions]'
})
export class InteractionsDirective {

  private readonly interactionList = {
    dragpan: DragPan,
    dragrotate: DragRotate,
    dragzoom: DragZoom,
    doubleclickzoom: DoubleClickZoom,
    keyboardpan: KeyboardPan,
    keyboardzoom: KeyboardZoom,
    mousewheelzoom: MouseWheelZoom,
    pinchzoom: PinchZoom
  };

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected mapComponent: MapComponent) {
    this.changeDetectorRef.detach();
  }

  @Input()
  set olInteractions(value: any[]) {
    const map = this.mapComponent.getMap();
    if (undefined !== map) {
      map.getInteractions().clear();
      if (!value || value.length < 0) return;
      for (const config of value) {
        this.addInteraction(map, config);
      }
    }
  }

  private addInteraction(map, controlConfig) {
    if (!this.interactionList[controlConfig.name]) {
      console.error(`Unknown interaction ${controlConfig.name}`);
      return;
    }
    const newInteraction = new this.interactionList[controlConfig.name](controlConfig.options);
    map.addInteraction(newInteraction);
  }

}
