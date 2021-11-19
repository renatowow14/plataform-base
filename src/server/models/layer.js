const lang = require('../utils/language');
const LayerType = require('./layertype');

const Auxiliar = require('../utils/auxiliar')

module.exports = class Layer {

    languageOb;
    idLayer;
    idGroup;
    labelLayer;
    visible;
    selectedType;
    layerTypes;

    constructor(language, params, idGroup) {
        this.languageOb = lang().getLang(language);

        this.idGroup = idGroup ? idGroup : null;
        this.idLayer = params.idLayer;

        if (this.idLayer == 'limits' || this.idLayer == 'basemaps') {
            this.labelLayer = this.languageOb.descriptor_labels[this.idLayer].labelLayer;
        }
        else {
            if (params.labelLayer.toLowerCase() == "translate".toLowerCase()) {

                this.labelLayer = this.languageOb.descriptor_labels.groups[this.idGroup].layers[this.idLayer].labelLayer;
            }
            else {
                this.labelLayer = params.labelLayer
            }
        }

        this.visible = params.hasOwnProperty('visible') ? params.visible : false;
        this.selectedType = params.hasOwnProperty('selectedType') ? params.selectedType : null;

        if (params.hasOwnProperty('types')) {
            this.layerTypes = this.getLayerTypesArray(language, params.types);
        }
    }

    getLayerTypesArray(language, types) {
        var arr = [];

        var temp_idGroup = this.idGroup;
        var temp_idLayer = this.idLayer

        types.forEach(function (item, index) {
            var type = new LayerType(language, item, { idGroup: temp_idGroup, idLayer: temp_idLayer });
            var typeObj = new Object(type.getLayerTypeInstance());
            arr.push(typeObj);
        });

        return arr;
    }

    getLayerInstance() {
        var ob = {
            "idLayer": this.idLayer,
            "labelLayer": this.labelLayer,
            "visible": this.visible,
            "selectedType": this.selectedType,
            "types": this.layerTypes
        }

        return ob;
    }

}