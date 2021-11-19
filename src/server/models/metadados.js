const lang = require('../utils/language');

module.exports = class Metadado {

    languageOb = "";
    layertype = "";
    ids;

    constructor(language, layertype, ids) {

        this.layertype = layertype;
        this.languageOb = lang().getLang(language);
        this.ids = ids;
    }

    getMetadadoInstance() {

        var temp_ids = this.ids;

        let arrayOfMetadata = [];
        let data = {};

        if (new String(temp_ids.idLayer).toLowerCase() == "basemaps".toLowerCase() ||
            new String(temp_ids.idLayer).toLowerCase() == "limits".toLowerCase()) {
            data = this.languageOb.descriptor_labels[temp_ids.idLayer].types[temp_ids.idValueType].hasOwnProperty('metadata') ? this.languageOb.descriptor_labels[temp_ids.idLayer].types[temp_ids.idValueType] : null
        } else {
            data = this.languageOb.descriptor_labels.groups[temp_ids.idGroup].layers[temp_ids.idLayer].types[temp_ids.idValueType].metadata;
        }

        if (data) {
            let titles = this.languageOb.metadata.titles
            for (var key in data) {
                arrayOfMetadata.push({
                    "title": titles[key],
                    "description": data[key]
                })
            }
        }



        return arrayOfMetadata;
    }

}