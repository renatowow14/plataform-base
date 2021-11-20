const UtilsLang = require('../utils/language');


module.exports = function (app) {
    var Controller = {}
    var Internal = {}


    Internal.numberFormat = function (numero) {
        numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    Internal.getDataSets = function (request, indicator) {
        var arrayLabels = []
        var arrayClass = []
        var color;
        var arrayValues = []

        for (let result of request.queryResult[indicator]) {
            arrayLabels.push(result.label)

            if (result.classe) {
                arrayClass.push(result.classe)
            }

        }

        var labels = new Set(arrayLabels)
        var classes = new Set(arrayClass)

        var dataInfo = {
            labels: [...labels],
            datasets: []
        }

        return dataInfo;
    }

    Internal.getValues = function (request, classe, indicatorValue) {
        arrayValues = []
        for (let result of request.queryResult[indicatorValue]) {

            if (result.classe == classe) {

                if (result.label != null) {
                    arrayValues.push(result.value)
                }
                color = result.color
            }
        }
        return arrayValues
    }

    Controller.deforestation = function (request, response) {
        const { lang, typeRegion, valueRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        var region = Internal.languageOb.deforestation_timeseries_card.biome;

        if (typeRegion == 'city' || typeRegion == 'state') {
            if (typeRegion == 'city')
                typeRegionTranslate = Internal.languageOb["deforestation_timeseries_card"]["municipio_label"];
            else if (typeRegion == 'state')
                typeRegionTranslate = Internal.languageOb["deforestation_timeseries_card"]["estado_label"];

            region = Internal.languageOb["deforestation_timeseries_card"]["o_municipio_estado"] + typeRegionTranslate + Internal.languageOb["deforestation_timeseries_card"]["de_municipio_estado"] + valueRegion
        } else if (typeRegion == 'região de fronteira') {
            region = Internal.languageOb["deforestation_timeseries_card"]["region_fronteira"] + valueRegion
        }

        const chartResult = [{
            "id": "prodes",
            "title": "PRODES - Cerrado",
            "getText": function (chart) {

                return "Qualquer texto"
            },
            "type": 'line',
            "options": {
                legend: {
                    display: false
                }
            }
        }]

        for (let chart of chartResult) {
            chart['indicators'] = request.queryResult[chart.id]
            chart['text'] = chart.getText(chart)
        }

        response.send(chartResult)
        response.end();


    };

    Controller.chartslulc = function (request, response) {
        const { lang, typeRegion, valueRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        // this.languageOb.descriptor_labels.groups[this.idGroup].labelGroup

        var region = Internal.languageOb.deforestation_timeseries_card.biome;

        // let region = languageJson["charts_regions"]["biome"][language]

        if (typeRegion == 'municipio' || typeRegion == 'estado') {
            if (typeRegion == 'municipio')
                typeRegionTranslate = Internal.languageOb["deforestation_timeseries_card"]["municipio_label"];
            else if (typeRegion == 'estado')
                typeRegionTranslate = Internal.languageOb["deforestation_timeseries_card"]["estado_label"];

            region = Internal.languageOb["deforestation_timeseries_card"]["o_municipio_estado"] + typeRegionTranslate + Internal.languageOb["deforestation_timeseries_card"]["de_municipio_estado"] + valueRegion
        } else if (typeRegion == 'região de fronteira') {
            region = Internal.languageOb["deforestation_timeseries_card"]["region_fronteira"] + valueRegion
        }

        const chartResult = [{
            "id": "uso_solo_terraclass",
            "title": "Terraclass 2013",
            "getText": function (chart) {

                const label = chart['indicators'][0]["label"]
                const value = chart['indicators'][0]["value"]
                const areaMun = chart['indicators'][0]["area_mun"]

                const percentual_area_ha = ((value * 100) / areaMun);
                const parttext = Internal.languageOb["lulc_pie_card"]["uso_solo_terraclass"];
                const text = parttext["part1"] + region +
                    parttext["part2"] + Internal.numberFormat(parseFloat(areaMun)) + parttext["part3"] +
                    parttext["part4"] + label + parttext["part5"] + Internal.numberFormat(parseFloat(value)) +
                    parttext["part6"] + Math.round(percentual_area_ha) + parttext["part7"]

                return text
            },
            "type": 'pie',
            "options": {
                legend: {
                    display: false
                }
            }
        },
        {
            "id": "uso_solo_probio",
            "title": "PROBIO",
            "getText": function (chart) {
                const label = chart['indicators'][0]["label"]
                const value = chart['indicators'][0]["value"]
                const areaMun = chart['indicators'][0]["area_mun"]
                const parttext = Internal.languageOb["lulc_pie_card"]["uso_solo_probio"];
                const percentual_area_ha = ((value * 100) / areaMun);

                const text = parttext["part1"] +
                    parttext["part2"] + label + parttext["part3"] +
                    Internal.numberFormat(parseFloat(value)) + parttext["part4"] +
                    Math.round(percentual_area_ha) + parttext["part5"]

                return text
            },
            "type": 'pie',
            "options": {
                legend: {
                    display: false
                }
            }
        }

        ]

        for (let chart of chartResult) {

            chart['indicators'] = request.queryResult[chart.id]
            chart['text'] = chart.getText(chart)

        }

        response.send(chartResult)
        response.end();

    }

    return Controller;
}