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

    Internal.replacementStrings = function (template, replacements) {
        return template.replace(/#([^#]+)#/g, (match, key) => {
            // If there's a replacement for the key, return that replacement with a `<br />`. Otherwise, return a empty string.
            return replacements[key] !== undefined
                ? replacements[key]
                : "";
        });
    }

    Controller.deforestation = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "prodes",
                "title": "PRODES-Cerrado",
                "getText": function (chart) {
                    replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["deforestation_timeseries_card"]["prodes"].text, replacements)
                    return text
                },
                "type": 'line',
                "options": {
                    legend: {
                        display: false
                    }
                }
            }]

        let chartFinal = []
        for (let chart of chartResult) {
            try {
                let queryInd = request.queryResult[chart.id]

                chart['indicators'] = queryInd.filter(val => {
                    return parseFloat(val.value) > 10
                })
                chart['show'] = false

                if (chart['indicators'].length > 0) {

                    // chart['indicators'] = chart['indicators'].map(o => ({ ...o, label: Internal.languageOb["deforestation_timeseries_card"][chart.id][o.label] }));
                    chart['show'] = true
                    chart['text'] = chart.getText(chart)
                    chartFinal.push(chart);
                }
            }
            catch (e) {
                chart['indicators'] = [];
                chart['show'] = false;
                chart['text'] = "erro."

                chartFinal.push(chart);

            }

        }

        response.send(chartFinal)
        response.end();


    };

    Controller.chartslulc = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [{
            "id": "uso_solo_terraclass",
            "title": "Terraclass 2013",
            "getText": function (chart) {
                replacements['areaMun'] = chart['indicators'][0]["area_mun"]
                const text = Internal.replacementStrings(Internal.languageOb["lulc_pie_card"]["uso_solo_terraclass"].text, replacements)
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
                replacements['areaMun'] = chart['indicators'][0]["area_mun"]
                const text = Internal.replacementStrings(Internal.languageOb["lulc_pie_card"]["uso_solo_probio"].text, replacements)
                return text
            },
            "type": 'pie',
            "options": {
                legend: {
                    display: false
                }
            }
        }]

        let chartFinal = []
        for (let chart of chartResult) {
            try {
                let queryInd = request.queryResult[chart.id]

                chart['indicators'] = queryInd.filter(val => {
                    return parseFloat(val.value) > 10
                })
                chart['show'] = false

                if (chart['indicators'].length > 0) {

                    chart['indicators'] = chart['indicators'].map(o => ({ ...o, label: Internal.languageOb["lulc_pie_card"][chart.id][o.label] }));

                    chart['show'] = true
                    chart['text'] = chart.getText(chart)
                    chartFinal.push(chart);
                }
            } catch (e) {
                chart['indicators'] = [];
                chart['show'] = false;
                chart['text'] = "erro."

                chartFinal.push(chart);

            }

        }

        response.send(chartFinal)
        response.end();

    }

    return Controller;
}