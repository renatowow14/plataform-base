const lang = require('../utils/language');
const Layer = require('./layer')

const Auxiliar = require('../utils/auxiliar')

module.exports = class Group {

    languageOb;
    idGroup;
    labelGroup;
    groupExpanded;
    layers;

    constructor(language, params) {
        this.languageOb = lang().getLang(language);
        this.idGroup = params.idGroup

        this.labelGroup = params.labelGroup == "translate" ? this.languageOb.descriptor_labels.groups[this.idGroup].labelGroup : params.labelGroup;

        this.groupExpanded = params.hasOwnProperty('groupExpanded') ? params.groupExpanded : false;

        if (params.hasOwnProperty('layers')) {
            this.layers = this.getLayersArray(language, params.layers);
        }

    }

    getLayersArray(language, layers) {
        var arr = [];
        var temp_id = this.idGroup
        layers.forEach(function (item, index) {
            let layer = new Layer(language, item, temp_id).getLayerInstance();
            arr.push(layer);
        });

        return arr;
    }


    getGroupInstance() {
        var ob = {
            "idGroup": this.idGroup,
            "labelGroup": this.labelGroup,
            "groupExpanded": this.groupExpanded,
            "layers": this.layers
        }

        ob = Auxiliar.removeNullProperties(ob)

        return ob;
    }

}