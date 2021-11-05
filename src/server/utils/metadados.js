lang = require('../utils/language');

module.exports = class Metadado {

    languageOb = "";
    name_layer = "";

    constructor(layer, language) {

        this.name_layer = layer;
        this.languageOb = lang().getLang(language);
    }

    getObjectInstance() {

        let data = this.languageOb.metadata[this.name_layer]
        let arrayOfMetadata = [];

        let titles = this.languageOb.metadata.titles

        for (var key in data) {
            arrayOfMetadata.push({
                "title": titles[key],
                "description": data[key]
            })
        }

        console.log(arrayOfMetadata)

        return arrayOfMetadata;
    }

}