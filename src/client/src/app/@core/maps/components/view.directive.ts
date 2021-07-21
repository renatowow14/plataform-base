import {
  AfterViewInit, ChangeDetectorRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Projection} from 'ol/proj';
import View from 'ol/View';
import {Coordinate, Extent} from './models';
import {MapComponent} from './map.component';

const animateDuration = 500;

@Directive({
  selector: 'ol-map > [olView]'
})
export class ViewDirective implements OnInit, AfterViewInit, OnChanges {

  private view: View;

  @Output() centerChange: EventEmitter<Coordinate> = new EventEmitter<Coordinate>();
  @Output() rotationChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() constrainRotation: boolean | number;
  @Input() enableRotation: boolean;
  @Input() extent: Extent;
  @Input() maxResolution: number;
  @Input() minResolution: number;
  @Input() maxZoom: number;
  @Input() minZoom: number;
  @Input() resolution: number;
  @Input() resolutions: number[];
  @Input() rotation: number;
  @Input() zoom: number;
  @Input() zoomFactor: number;
  @Input() center: Coordinate;
  @Input() projection: Projection;

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected mapComponent: MapComponent) {
    this.changeDetectorRef.detach();
  }

  ngOnInit() {
    this.view = new View(this);
    const map = this.mapComponent.getMap();
    if (map) {
      map.setView(this.view);
      map.updateSize();
    }
  }

  ngAfterViewInit() {
    const map = this.mapComponent.getMap();
    if (map) {
      // register view events
      let timerZoomId, timerCenterId, timerRotationId;

      this.view.on('change:center', (e: any) => {
        clearTimeout(timerCenterId);
        timerCenterId = setTimeout(() => this.centerChange.emit(e.target.get(e.key)), animateDuration + 10);
      });

      this.view.on('change:resolution', (e: any) => {
        clearTimeout(timerZoomId);
        timerZoomId = setTimeout(() => this.zoomChange.emit(this.view.getZoom()), animateDuration + 10);
      });

      this.view.on('change:rotation', (e: any) => {
        clearTimeout(timerRotationId);
        timerRotationId = setTimeout(() => this.rotationChange.emit(e.target.get(e.key)), animateDuration + 10);
      });

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};
    if (!this.view) {
      return;
    }

    for (const key in changes) {
      if (key === 'zoom') {
        this.view.animate({zoom: changes[key].currentValue, duration: animateDuration});
      } else if (key === 'center') {
        this.view.animate({center: changes[key].currentValue, duration: animateDuration});
      } else {
        properties[key] = changes[key].currentValue;
      }
    }
    this.view.setProperties(properties, false);
  }

  getView(): View {
    return this.view;
  }

}
