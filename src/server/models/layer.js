const lang = require('../utils/language');
const Auxiliar = require('../utils/auxiliar')

module.exports = class Layer {

    languageOb;
    idLayer;
    idGroup;
    labelLayer;
    visible;
    selectedType;
    layerTypes;
    language;

    constructor(language, params, idGroup, allLayersT) {
        this.language = language
        this.languageOb = lang().getLang(language);

        this.idGroup = idGroup ? idGroup : null;
        this.idLayer = params.idLayer;


        if (params.hasOwnProperty('types')) {
            this.layerTypes = this.getLayerTypesArray(params.types, allLayersT)
        }

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

        this.selectedType = params.hasOwnProperty('selectedType') ? params.selectedType : this.layerTypes[0].valueType;
    }

    getLayerTypesArray(layertypes, alllayertypes) {

        let layertypesV = []
        layertypes.forEach(function (userSelectedLayerTypeValue, index) {
            for (var k in alllayertypes) {

                let ob = alllayertypes[k].find(obj => {
                    return obj.valueType.toUpperCase() === userSelectedLayerTypeValue.toUpperCase()
                })

                if (ob) {
                    layertypesV.push(Object.assign({}, ob))
                }

            }
        });

        return layertypesV;
    }

    getLayerInstance() {
        let ob = {
            "idLayer": this.idLayer,
            "labelLayer": this.labelLayer,
            "visible": this.visible,
            "selectedType": this.selectedType,
            "types": this.layerTypes
        }
        return ob;
    }

}