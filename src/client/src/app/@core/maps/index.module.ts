import {NgModule} from '@angular/core';
import {InteractionsDirective} from './components/interactions.directive';
import {LayerType} from './components/models';
import {MapComponent} from './components/map.component';
import {OverlayComponent} from './components/overlay.component';
import {ControlsDirective} from './components/controls.directive';
import {LayersDirective} from './components/layers.directive';
import {ViewDirective} from './components/view.directive';
import {MapService} from './components/map.service';
import {ContentComponent} from './components/content.component';
import {LayerComponent} from './components/layer.component';

export * from './components/util';
export {MapService} from './components/map.service';

export {ContentComponent} from './components/content.component';
export {ControlsDirective} from './components/controls.directive';
export {LayersDirective} from './components/layers.directive';
export {LayerComponent} from './components/layer.component';
export {LayerType, SourceType} from './components/models';
export {MapComponent} from './components/map.component';
export {OverlayComponent} from './components/overlay.component';
export {ViewDirective} from './components/view.directive';

const declarations = [
  ContentComponent,
  ControlsDirective,
  LayersDirective,
  LayerComponent,
  InteractionsDirective,
  MapComponent,
  OverlayComponent,
  ViewDirective
];

@NgModule({
  imports: [],
  declarations: [...declarations],
  exports: [...declarations]
})
export class MapsModule {
}
