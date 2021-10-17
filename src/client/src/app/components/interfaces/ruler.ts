import {Map, Overlay} from 'ol';
import {Interaction} from 'ol/interaction';
import {Vector as VectorSource} from 'ol/source';

export interface Ruler {
  removeInteraction(): void;

  addInteraction(interaction: Interaction): void;

  addDrawInteraction(name: string): void;

  addOverlay(overlay: Overlay): void;

  // @ts-ignore
  getSource(): VectorSource;

  getMap(): Map;

  unselect(): void;
}
