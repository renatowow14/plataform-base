lang = require('../utils/language');

module.exports = class Metadado {

    languageOb = "";
    name_layer = "";

    constructor(layer, language) {

        this.name_layer = layer;
        this.languageOb = lang.getLang(language);
    }

    getObjectInstance() {

        let data = this.languageOb.metadados[this.name_layer]
        let arrayOfMetadataObj = [];

        for (var key in data) {
            arrayOfMetadata.push({
                "title": key,
                "description": data[key]
            }
            )
        }

        return arrayOfMetadataObj;
    }

}