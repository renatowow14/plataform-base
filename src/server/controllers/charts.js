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

    Internal.buildGraphResult = function (allQueriesResult, chartDescription) {
        try {

            let arrayLabels = []
            let arrayData = []
            for (let query of chartDescription.idsOfQueriesExecuted) {

                let queryInd = allQueriesResult[query.idOfQuery]

                arrayLabels.push(...queryInd.map(a => a.label))

                if (chartDescription.type == 'line') {

                    arrayData.push({
                        label: query.labelOfQuery,
                        data: [...queryInd.map(a => a.value)],
                        fill: false,
                        borderColor: [new Set(...queryInd.map(a => a.color))],
                        tension: .4
                    })
                }

                else if (chartDescription.type == 'pie') {

                }

            }

            let dataInfo = {
                labels: [...new Set(arrayLabels)],
                datasets: arrayData
            }

            chart['indicators'] = queryInd.filter(val => {
                return parseFloat(val.value) > 10
            })
            chart['show'] = false

            if (chart['indicators'].length > 0) {

                // chart['indicators'] = chart['indicators'].map(o => ({ ...o, lab el: Internal.languageOb["deforestation_timeseries_card"][chart.id][o.label] }));
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

    Controller.timeseries = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        // console.log(request.queryResult)

        const chartResult = [
            {
                "id": "pastureAndLotacaoBovina",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'pasture', labelOfQuery: Internal.languageOb["timeseries_card"]["pastureAndLotacaoBovina"]['pasture'] },
                    { idOfQuery: 'lotacao_bovina_regions', labelOfQuery: Internal.languageOb["timeseries_card"]["prodes"]['lotacao_bovina_regions'] },
                ],
                "title": "PRODES-Cerrado",
                "getText": function (chart) {
                    replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["timeseries_card"]["prodes"].text, replacements)
                    return text
                },
                "type": 'line',
                "options": {
                    legend: {
                        display: false
                    }
                }
            }
            // {
            //     "id": "pasture",
            //     "title": Internal.languageOb["timeseries_card"]["pasture"].title,
            //     "getText": function (chart) {
            //         replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
            //         replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
            //         replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

            //         const text = Internal.replacementStrings(Internal.languageOb["timeseries_card"]["pasture"].text, replacements)
            //         return text
            //     },
            //     "type": 'line',
            //     "options": {
            //         legend: {
            //             display: false
            //         }
            //     }
            // }
            // {
            //     "id": "pastureAndLotacaoBovina",
            //     "idsOfQueriesExecuted": ['pasture', 'lotacao_bovina_regions'],
            //     "title": Internal.languageOb["timeseries_card"]["pasture_quality"].title,
            //     "getText": function (chart) {
            //         replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
            //         replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
            //         replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

            //         const text = Internal.replacementStrings(Internal.languageOb["timeseries_card"]["pasture"].text, replacements)
            //         return text
            //     },
            //     "type": 'line',
            //     "options": {
            //         legend: {
            //             display: false
            //         }
            //     }
            // }
        ]

        // let chartFinal = Internal.buildGraphResult(request.queryResult, chartResult)

        for (let chart of chartResult) {
            chart['data'] = Internal.buildGraphResult(request.queryResult, chart)
        }

        for (let chart of chartResult) {
            try {


                // for (let query of chart.queries) {
                //     let queryInd = request.queryResult[chart.query]
                // }

                let queryInd = request.queryResult[chart.id]

                chart['indicators'] = queryInd.filter(val => {
                    return parseFloat(val.value) > 10
                })
                chart['show'] = false

                if (chart['indicators'].length > 0) {

                    // chart['indicators'] = chart['indicators'].map(o => ({ ...o, lab el: Internal.languageOb["deforestation_timeseries_card"][chart.id][o.label] }));
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

    Controller.pastureTimeseries = function (request, response) {
    }


    Controller.lulc = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
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
            // {
            //     "id": "uso_solo_probio",
            //     "title": "PROBIO",
            //     "getText": function (chart) {
            //         replacements['areaMun'] = chart['indicators'][0]["area_mun"]
            //         const text = Internal.replacementStrings(Internal.languageOb["lulc_pie_card"]["uso_solo_probio"].text, replacements)
            //         return text
            //     },
            //     "type": 'pie',
            //     "options": {
            //         legend: {
            //             display: false
            //         }
            //     }
            // }
            // {
            //     "id": "pasture_quality",
            //     "title": Internal.languageOb["lulc_pie_card"]["pasture_quality"].title,
            //     "getText": function (chart) {
            //         replacements['areaMun'] = chart['indicators'][0]["area_mun"]
            //         const text = Internal.replacementStrings(Internal.languageOb["lulc_pie_card"]["pasture_quality"].text, replacements)
            //         return text
            //     },
            //     "type": 'pie',
            //     "options": {
            //         legend: {
            //             display: false
            //         }
            //     }
            // }
        ]

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