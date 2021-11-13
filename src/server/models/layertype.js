const lang = require('../utils/language');
const Metadado = require('./metadados');

const Auxiliar = require('../utils/auxiliar')


module.exports = class LayerType {

    languageOb;
    valueType;
    type;
    visible;
    obj;

    constructor(language, params, ids) {
        this.languageOb = lang().getLang(language);

        this.valueType = params.hasOwnProperty('valueType') ? params.valueType : null;
        this.type = params.hasOwnProperty('type') ? params.type : 'layer';
        var temp = {}
        if (this.valueType) {
            temp = {
                valueType: this.valueType,
                type: this.type,

                viewValueType: this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? this.languageOb.descriptor_labels[ids.idLayer].types[this.valueType] : params.viewValueType.toLowerCase() == "translate".toLowerCase() ? this.languageOb.descriptor_labels.groups[ids.idGroup].layers[ids.idLayer].types[this.valueType].viewValueType : params.viewValueType,

                typeLabel: params.hasOwnProperty('typeLabel') ? this.languageOb.labels.layertype.typeLabel[params.typeLabel] : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : this.languageOb.labels.layertype.typeLabel["type"],
                filterLabel: params.hasOwnProperty('filterLabel') ? this.languageOb.labels.layertype.filterLabel[params.filterLabel] : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : this.languageOb.labels.layertype.filterLabel["year"],
                regionFilter: this.type.toUpperCase() === 'layer'.toUpperCase() ? true : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : false,

                columnsCSV: params.hasOwnProperty('columnsCSV') ? params.columnsCSV : null,
                downloadSHP: params.hasOwnProperty('downloadSHP') ? params.downloadSHP : this.type.toUpperCase() === 'layer'.toUpperCase() ? true : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : false,
                downloadCSV: params.hasOwnProperty('downloadCSV') ? params.downloadCSV : params.hasOwnProperty('columnsCSV') ? true : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : false,
                downloadRaster:  params.hasOwnProperty('downloadRaster') ? params.downloadRaster : this.type.toUpperCase() === 'raster'.toUpperCase() ? true : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : false,

                layerLimits: this.type.toUpperCase() === 'limit'.toUpperCase() ? true : null,

                filterSelected: params.hasOwnProperty('filterSelected') ? params.filterSelected : null,
                filterHandler: params.hasOwnProperty('filterHandler') ? params.filterHandler : this.type.toUpperCase() === 'limit'.toUpperCase() || this.type.toUpperCase() === 'basemap'.toUpperCase() ? null : "msfilter",

                filters: params.hasOwnProperty('filters') ? this.getFiltersArray(params.filters, ids) : null,

                visible: params.hasOwnProperty('visible') ? params.visible : false,
                opacity: params.hasOwnProperty('opacity') ? params.opacity : 1.0,

                metadata: new Metadado(language, this.type, { idGroup: ids.idGroup, idLayer: ids.idLayer, idValueType: this.valueType }).getMetadadoInstance().length > 0 ? new Metadado(language, this.type, { idGroup: ids.idGroup, idLayer: ids.idLayer, idValueType: this.valueType }).getMetadadoInstance() : null
            };
            this.obj = Auxiliar.removeNullProperties(temp);
        }
        else {
            this.obj = null;
        }
    }


    getLayerTypeInstance = function () {
        return this.obj;
    }

    getFiltersArray(filters, ids) {
        var arr = [];

        var temp_value = this.valueType
        var temp_language_filters = this.languageOb.descriptor_labels.groups[ids.idGroup].layers[ids.idLayer].types[temp_value].filters

        filters.forEach(function (item, index) {
            var type = {};
            if (String(item.viewValueFilter).toLowerCase() === "translate".toLowerCase()) {
                type = {
                    valueFilter: item.valueFilter,
                    viewValueFilter: temp_language_filters[item.valueFilter],
                }
            }
            else {
                type = {
                    valueFilter: item.valueFilter,
                    viewValueFilter: item.viewValueFilter
                }
            }

            arr.push(type);
        });

        return arr;
    }

    getLayerTypesArray(language, types) {
        var arr = [];
        types.forEach(function (item, index) {
            var type = new LayerType(language, item, { idGroup: this.idGroup, idLayer: this.idLayer });
            var typeObj = new Object(type.getLayerTypeInstance());
            arr.push(typeObj);
        });

        return arr;
    }

}
