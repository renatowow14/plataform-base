import {Feature, Overlay} from 'ol';
import {Draw} from 'ol/interaction';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {getArea, getLength} from 'ol/sphere';
import {Geometry, LineString, Polygon} from 'ol/geom';
import {unByKey} from 'ol/Observable';
import { Ruler } from "../interfaces";

abstract class RulerControl {

    private measureTooltipElement: Element;

    private measureTooltip: Overlay;

    // @ts-ignore
    private sketch: Feature;

    protected constructor(protected component: Ruler, private type: string) {
    }

    getDraw(): Draw {
        const draw = new Draw({
            source: this.component.getSource(),
            type: this.type,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
            }),
        });

        this.createMeasureTooltip();

        let listener;
        draw.on('drawstart', drawEvent => {
            // set sketch
            this.sketch = drawEvent.feature;

            listener = this.sketch.getGeometry().on('change', evt => {
                const geom: Geometry = evt.target;
                const output: string = this.format(geom);

                let tooltipCoordinate;
                if (geom instanceof Polygon) {
                    tooltipCoordinate = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    tooltipCoordinate = geom.getLastCoordinate();
                }

                this.measureTooltipElement.innerHTML = output;
                this.measureTooltip.setPosition(tooltipCoordinate);
            });
        });

        draw.on('drawend', () => {
            this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            this.measureTooltip.setOffset([0, -7]);

            this.sketch.setStyle(new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33',
                    }),
                })
            }));

            // unset tooltip so that a new one can be created
            // @ts-ignore
          this.measureTooltipElement = null;
            this.sketch.overlay = this.measureTooltip;
            this.sketch.regua = true;

            // unset sketch
            this.sketch = null;

            unByKey(listener);
            this.component.unselect();
        });

        return draw;
    }

    protected abstract format(geometry: Geometry): string;

    /**
     * Creates a new measure tooltip
     */
    private createMeasureTooltip(): void {
        if (this.measureTooltipElement) {
            // @ts-ignore
          this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }

        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip';

      // @ts-ignore
      this.measureTooltip = new Overlay({element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
      });

        this.component.addOverlay(this.measureTooltip);
    }
}

export class RulerCtrl extends RulerControl {
    constructor(component: Ruler) {
        super(component, 'LineString');
    }

    protected format(geometry: Geometry): string {
        const length = getLength(geometry, {
            projection: this.component.getMap().getView().getProjection()
        });
        let output: string;

        if (length > 1000) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else if (length >= 1) {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        } else {
            output = Math.round(length * 10000) / 100 + ' ' + 'cm';
        }

        return output;
    }
}

export function calculaArea(area: number): string {
    let output: string;

    if (area > 100000) {
        output = Math.round((area / 100000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else if (area >= 10) {
        output = Math.round((area / 10) * 100) / 100 + ' ' + 'm<sup>2</sup>';
    } else {
        output = Math.round(area * 100000) / 100 + ' ' + 'cm<sup>2</sup>';
    }

    output += ' ou ' + Math.round((area / 100000) * 10000) / 100 + ' ' + 'ha';

    return output;
}

export class RulerAreaCtrl extends RulerControl {
    constructor(component: Ruler) {
        super(component, 'Polygon');
    }

    protected format(geometry: Geometry): string {
        const area = getArea(geometry, {
            projection: this.component.getMap().getView().getProjection()
        });

        return calculaArea(area);
    }
}
