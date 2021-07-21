import {Directive, Input, IterableDiffer, IterableDiffers} from '@angular/core';
import {Map, MapBrowserEvent} from 'ol';
import {Layer} from 'ol/layer';
import {MapComponent} from './map.component';

@Directive({
    selector: 'ol-map > [olLayers]'
})
export class LayersDirective {

    private differ: IterableDiffer<any>;

    constructor(protected mapComponent: MapComponent,
                protected differs: IterableDiffers) {
        this.differ = differs.find([]).create(null);
    }

    @Input()
    set olLayers(value: Layer[]) {
        if (value) {
            const changes = this.differ.diff(value);
            if (changes) {
                this.updateLayers(changes, value);
            }
        }
    }

    private updateLayers(changes: any, layers: Layer[]) {

        if (changes) {
            const map = this.mapComponent.getMap();
            changes.forEachAddedItem((change) => {
                this.addLayer(map, change.item);
            });
            changes.forEachRemovedItem((change) => {
                this.removeLayer(map, change.item);
            });

            layers.forEach((item, index) => {
                const length = map.getLayers().getLength() - 1;
                item.setZIndex(length - index);
            });
        }
    }

    private addLayer(map: Map, olLayer: Layer) {
        map.addLayer(olLayer);
    }

    private removeLayer(map: Map, olLayer: Layer) {
        map.removeLayer(olLayer);
    }

}
