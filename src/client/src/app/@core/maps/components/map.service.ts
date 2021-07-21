import {Injectable} from '@angular/core';
import { Map } from 'ol';
import {addProjection, get as getProjection, Projection} from 'ol/proj';
import {register} from 'ol/proj/proj4.js';

import * as proj4x from 'proj4';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    maps: Map[];

    constructor() {
        this.maps = [];
    }

    /**
     * Retrieves all the maps
     */
    getMaps(): Map[] {
        return this.maps;
    }

    /**
     * Returns a map object from the maps array
     */
    getMapById(id: string): Map {
        let map: Map = null;
        for (let i = 0; i < this.maps.length; i++) {
            if (this.maps[i].getTarget() === id) {
                map = this.maps[i];
                break;
            }
        }
        return map;
    }

    addMap(map: Map): void {
        this.maps.push(map);
    }

    updateSize() {
        this.maps.forEach(map => {
            map.updateSize();
        });
    }

    addProj4(epsg: string, proj4Def: string, extent?: any) {
        let projection = getProjection(epsg);
        if (!projection) {
            proj4.defs(epsg, proj4Def);
            register(proj4);
            projection = getProjection(epsg);
            if (extent) {
                projection.setExtent(extent);
            }
        }
        if (!projection) {
            console.error(`Failed to register ${epsg} projection in OpenLayers`);
        }
        addProjection(new Projection(projection));
    }

}
