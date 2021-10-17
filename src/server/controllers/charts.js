var languageJson = require('../assets/lang/language.json');
module.exports = function(app) {
    var Controller = {}
    var Internal = {}

    function numberFormat(numero) {
        numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    Internal.getDataSets = function(request, indicator) {
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

    Internal.getValues = function(request, classe, indicatorValue) {
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

    Controller.chartslulc = function(request, response) {
        var language = request.param('lang')
        var typeRegion = request.param('typeRegion');
        var textRegion = request.param('textRegion');
       // let {lang, typeRegion, textRegion} = request.body;
      //  let language = lang;
        var region = languageJson["charts_regions"]["biome"][language]

        if (typeRegion == 'municipio' || typeRegion == 'estado') {
            if (typeRegion == 'municipio')
                typeRegionTranslate = language == 'pt' ? 'municipio' : 'municipality';
            else if (typeRegion == 'estado')
                typeRegionTranslate = language == 'pt' ? 'estado' : 'state';

            region = languageJson["charts_regions"]["o_municipio_estado"][language] + typeRegionTranslate + languageJson["charts_regions"]["de_municipio_estado"][language] + textRegion
        } else if (typeRegion == 'região de fronteira') {
            region = languageJson["charts_regions"]["region_fronteira"][language] + textRegion
        }

        var chartResult = [{
                "id": "uso_solo_terraclass",
                "title": "Terraclass",
                "getText": function(chart) {

                    var label = chart['indicators'][0]["label"]
                    var value = chart['indicators'][0]["value"]
                    var areaMun = chart['indicators'][0]["area_mun"]

                    var percentual_area_ha = ((value * 100) / areaMun);
                    var parttext = languageJson["charts_text"]["uso_solo_terraclass"];
                    var text = parttext["part1"][language] + region +
                        parttext["part2"][language] + numberFormat(parseFloat(areaMun)) + parttext["part3"][language] +
                        parttext["part4"][language] + label + parttext["part5"][language] + numberFormat(parseFloat(value)) +
                        parttext["part6"][language] + Math.round(percentual_area_ha) + parttext["part7"][language]

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
                "getText": function(chart) {
                    var label = chart['indicators'][0]["label"]
                    var value = chart['indicators'][0]["value"]
                    var areaMun = chart['indicators'][0]["area_mun"]
                    var parttext = languageJson["charts_text"]["uso_solo_probio"];
                    var percentual_area_ha = ((value * 100) / areaMun);

                    var text = parttext["part1"][language] +
                        parttext["part2"][language] + label + parttext["part3"][language] +
                        numberFormat(parseFloat(value)) + parttext["part4"][language] +
                        Math.round(percentual_area_ha) + parttext["part5"][language]

                    return text
                },
                "type": 'pie',
                "options": {
                    legend: {
                        display: false
                    }
                }
            }
            // {
            //     "id": "uso_solo_mapbiomas",
            //     "title": "MapBiomas",
            //     "getText": function(chart) {
            //         var label = chart['indicators'][0]["label"]
            //         var value = chart['indicators'][0]["value"]
            //         var areaMun = chart['indicators'][0]["area_mun"]
            //         var year = chart['indicators'][0]["year"]
            //         var parttext = languageJson["charts_text"]["uso_solo_mapbiomas"];
            //         var percentual_area_ha = ((value * 100) / areaMun);

            //         var text = parttext["part1"][language] + year +
            //             parttext["part2"][language] + parttext["part3"][language] +
            //             label + parttext["part4"][language] + numberFormat(parseFloat(value)) +
            //             parttext["part5"][language] + Math.round(percentual_area_ha) + parttext["part6"][language]

            //         return text
            //     },
            //     "type": 'pie',
            //     "options": {
            //         legend: {
            //             display: false
            //         }
            //     }
            // },
        ]

        for (let chart of chartResult) {

            chart['indicators'] = request.queryResult[chart.id]
            chart['text'] = chart.getText(chart)

        }

        response.send(chartResult)
        response.end();

    }

    Controller.deforestation = function(request, response) {
        var language = request.param('lang')
        var typeRegion = request.param('typeRegion');
        var textRegion = request.param('textRegion');

        var region = languageJson["charts_regions"]["biome"][language]

        if (typeRegion == 'municipio' || typeRegion == 'estado') {
            if (typeRegion == 'municipio')
                typeRegionTranslate = language == 'pt' ? 'municipio' : 'municipality';
            else if (typeRegion == 'estado')
                typeRegionTranslate = language == 'pt' ? 'estado' : 'state';

            region = languageJson["charts_regions"]["o_municipio_estado"][language] + typeRegionTranslate + languageJson["charts_regions"]["de_municipio_estado"][language] + textRegion
        } else if (typeRegion == 'região de fronteira') {
            region = languageJson["charts_regions"]["region_fronteira"][language] + textRegion
        }

        var chartResult = [{
                "id": "prodes",
                "title": "PRODES",
                "getText": function(chart) {


                    return "Qualquer texto"
                },
                "type": 'line',
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


    };




    return Controller;
}