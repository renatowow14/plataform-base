import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Map, MapBrowserEvent} from 'ol';
import {MapService} from './map.service';
import {MapReadyEvent} from './models';
import {AsyncSubject} from 'rxjs';

@Component({
  selector: 'ol-map',
  styleUrls: ['./map.component.scss'],
  template: '<div style="width: 100%; height: 100%; margin: 0; padding: 0;"></div><ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, OnDestroy {

  private map: Map;
  private timeoutId: any;

  /**
   * This event is triggered after the map is initialized
   * Use this to have access to the maps and some helper functions
   */
  @Output()
  mapReady: AsyncSubject<MapReadyEvent> = new AsyncSubject(); // AsyncSubject will only store the last value, and only publish it when the sequence is completed

  /**
   * This event is triggered after the user clicks on the map.
   * A true single click with no dragging and no double click.
   * Note that this event is delayed by 250 ms to ensure that it is not a double click.
   */
  @Output()
  mapClick: EventEmitter<MapBrowserEvent> = new EventEmitter<MapBrowserEvent>();

  @Input() pixelRatio: number;
  @Input() keyboardEventTarget: Element | string;
  @Input() loadTilesWhileAnimating: true;
  @Input() loadTilesWhileInteracting: true;
  @Input() logo: string | boolean;
  @Input() properties: { [index: string]: any };

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected element: ElementRef,
              protected mapService: MapService) {
    this.changeDetectorRef.detach();
  }

  ngOnInit() {
    const target = this.element.nativeElement.firstElementChild;
    this.map = new Map(this);
    this.map.setTarget(target);
    this.map.setProperties(this.properties, true);
    // register the map in the injectable mapService
    this.mapService.addMap(this.map);

    this.map.once('postrender', event => {
      this.afterMapReady();
    });

  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateSizeThrottle);
    window.removeEventListener('orientationchange', this.updateSizeThrottle);

    this.map = null;
  }

  afterMapReady() {
    // register map events
    this.map.on('singleclick', (event: MapBrowserEvent) => this.mapClick.emit(event));

    // react on window events
    window.addEventListener('resize', this.updateSizeThrottle, false);
    window.addEventListener('orientationchange', this.updateSizeThrottle, false);

    this.updateSize();

    this.mapReady.next({map: this.map, mapService: this.mapService});
    this.mapReady.complete();

  }

  getMap() {
    return this.map;
  }

  updateSize() {
    this.updateSizeThrottle();
  }

  // Only arrow function works with addEventListener
  private updateSizeThrottle = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.map.updateSize();
    }, 100);
  }

}
