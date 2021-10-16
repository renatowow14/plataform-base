var fs = require('fs'),
    archiver = require('archiver'),
    json2csv = require('json2csv').parse,
    languageJson = require('../assets/lang/language.json'),
    request = require('request'),
    Ows = require('../utils/ows');

module.exports = function(app) {
    var Controller = {}
    var config = app.config;


    Controller.extent = function(request, response) {
        var queryResult = request.queryResult['extent']
        var result = {
            type: 'Feature',
            geometry: JSON.parse(queryResult[0].geojson)
        }

        response.send(result)
        response.end();

    }

    Controller.search = function(request, response) {
        var regiao;
        var result = [];
        var queryResult = request.queryResult

        queryResult.forEach(function(row) {

            if (row.uf === null) {
                regiao = row.text
            } else {
                regiao = row.text + " (" + row.uf + ")"
            }

            result.push({
                text: regiao,
                value: row.value,
                type: row.type
            })
        })

        response.send(result)
        response.end()
    }

    Controller.descriptor = function(request, response) {
        var language = request.param('lang')

        var result = {
            regionFilterDefault: "bioma='CERRADO'",
            groups: [{
                    id: "agropecuaria",
                    label: languageJson["title_group_label"]["agropecuaria"][language],
                    group_expanded: false,
                    layers: [{
                        id: "mapa_agricultura_agrosatelite",
                        label: languageJson["title_layer_label"]["agrosatelite"][language],
                        visible: false,
                        selectedType: 'agricultura_agrosatelite',
                        value: "agricultura_agrosatelite",
                        opacity: 1,
                        regionFilter: true,
                        order: 2,
                        typeLayer: "vectorial",
                        typeLabel: languageJson["typelabel_layer"]["type"][language],
                        timeLabel: languageJson["typelabel_layer"]["year"][language],
                        timeSelected: "year=2014",
                        timeHandler: "msfilter",
                        times: [
                            { value: "year=2001", Viewvalue: 2001 },
                            { value: "year=2007", Viewvalue: 2007 },
                            { value: "year=2014", Viewvalue: 2014 }
                        ],
                        metadata: {
                            title: languageJson["metadata"]["agricultura_agrosatelite"]["title"][language],
                            description: languageJson["metadata"]["agricultura_agrosatelite"]["description"][language],
                            format: languageJson["metadata"]["agricultura_agrosatelite"]["format"][language],
                            region: languageJson["metadata"]["agricultura_agrosatelite"]["region"][language],
                            period: languageJson["metadata"]["agricultura_agrosatelite"]["period"][language],
                            scale: languageJson["metadata"]["agricultura_agrosatelite"]["scale"][language],
                            system_coordinator: languageJson["metadata"]["agricultura_agrosatelite"]["system_coordinator"][language],
                            cartographic_projection: languageJson["metadata"]["agricultura_agrosatelite"]["cartographic_projection"][language],
                            cod_caracter: languageJson["metadata"]["agricultura_agrosatelite"]["cod_caracter"][language],
                            fonte: languageJson["metadata"]["agricultura_agrosatelite"]["fonte"][language],
                            contato: "lapig.cepf@gmail.com"
                        },
                        columnsCSV: "area_ha, classe, year",
                        downloadSHP: true,
                        downloadCSV: true
                    }]
                },
                {
                    id: "imagens",
                    label: languageJson["descriptor"]["imagens"]["label"][language],
                    group_expanded: false,
                    layers: [{
                        id: "satelite",
                        label: languageJson["descriptor"]["imagens"]["layers"]["satelite"]["label"][language],
                        visible: false,
                        typeLayer: "raster",
                        selectedType: "planet",
                        types: [{
                            value: "planet",
                            Viewvalue: "Planet",
                            order: 10,
                            opacity: 1,
                            timeLabel: languageJson["typelabel_layer"]["year"][language],
                            typeLabel: languageJson["typelabel_layer"]["type"][language],
                            timeSelected: "global_quarterly_2021q1_mosaic",
                            timeHandler: "layername",
                            times: [{
                                    value: "global_quarterly_2016q1_mosaic",
                                    Viewvalue: "2016/1ºTri"
                                },
                                {
                                    value: "global_quarterly_2016q2_mosaic",
                                    Viewvalue: "2016/2ºTri"
                                },
                                {
                                    value: "global_quarterly_2016q3_mosaic",
                                    Viewvalue: "2016/3ºTri"
                                },
                                {
                                    value: "global_quarterly_2016q4_mosaic",
                                    Viewvalue: "2016/4ºTri"
                                },
                                {
                                    value: "global_quarterly_2017q1_mosaic",
                                    Viewvalue: "2017/1ºTri"
                                },
                                {
                                    value: "global_quarterly_2017q2_mosaic",
                                    Viewvalue: "2017/2ºTri"
                                },
                                {
                                    value: "global_quarterly_2017q3_mosaic",
                                    Viewvalue: "2017/3ºTri"
                                },
                                {
                                    value: "global_quarterly_2017q4_mosaic",
                                    Viewvalue: "2017/4ºTri"
                                },
                                {
                                    value: "global_quarterly_2018q1_mosaic",
                                    Viewvalue: "2018/1ºTri"
                                },
                                {
                                    value: "global_quarterly_2018q2_mosaic",
                                    Viewvalue: "2018/2ºTri"
                                },
                                {
                                    value: "global_quarterly_2018q3_mosaic",
                                    Viewvalue: "2018/3ºTri"
                                },
                                {
                                    value: "global_quarterly_2018q4_mosaic",
                                    Viewvalue: "2018/4ºTri"
                                },
                                {
                                    value: "global_quarterly_2019q1_mosaic",
                                    Viewvalue: "2019/1ºTri"
                                },
                                {
                                    value: "global_quarterly_2019q2_mosaic",
                                    Viewvalue: "2019/2ºTri"
                                },
                                {
                                    value: "global_quarterly_2019q3_mosaic",
                                    Viewvalue: "2019/3ºTri"
                                },
                                {
                                    value: "global_quarterly_2019q4_mosaic",
                                    Viewvalue: "2019/4ºTri"
                                },
                                {
                                    value: "global_quarterly_2020q1_mosaic",
                                    Viewvalue: "2020/1ºTri"
                                },
                                {
                                    value: "global_quarterly_2020q2_mosaic",
                                    Viewvalue: "2020/2ºTri"
                                },
                                {
                                    value: "global_quarterly_2020q3_mosaic",
                                    Viewvalue: "2020/3ºTri"
                                },
                                {
                                    value: "global_quarterly_2020q4_mosaic",
                                    Viewvalue: "2020/4ºTri"
                                },
                                {
                                    value: "global_quarterly_2021q1_mosaic",
                                    Viewvalue: "2021/1ºTri"
                                }
                            ],
                            metadata: {
                                title: languageJson["metadata"]["agricultura_agrosatelite"]["title"][language],
                                description: languageJson["metadata"]["agricultura_agrosatelite"]["description"][language],
                                format: languageJson["metadata"]["agricultura_agrosatelite"]["format"][language],
                                region: languageJson["metadata"]["agricultura_agrosatelite"]["region"][language],
                                period: languageJson["metadata"]["agricultura_agrosatelite"]["period"][language],
                                scale: languageJson["metadata"]["agricultura_agrosatelite"]["scale"][language],
                                system_coordinator: languageJson["metadata"]["agricultura_agrosatelite"]["system_coordinator"][language],
                                cartographic_projection: languageJson["metadata"]["agricultura_agrosatelite"]["cartographic_projection"][language],
                                cod_caracter: languageJson["metadata"]["agricultura_agrosatelite"]["cod_caracter"][language],
                                fonte: languageJson["metadata"]["agricultura_agrosatelite"]["fonte"][language],
                                contato: "lapig.cepf@gmail.com"
                            },
                            downloadSHP: false,
                            downloadCSV: false
                        }]
                    }]
                }
            ],
            "basemaps": [{
                "id": "basemaps",
                "defaultBaseMap": 'mapbox',
                "types": [{
                        "value": "mapbox",
                        "viewValue": languageJson["basemap"]["geopolitico"][language],
                        "visible": true
                    },
                    {
                        "value": "satelite",
                        "viewValue": languageJson["basemap"]["satelite"][language],
                        "visible": false
                    },
                    {
                        "value": "estradas",
                        "viewValue": languageJson["basemap"]["estradas"][language],
                        "visible": false
                    },
                    {
                        "value": "relevo",
                        "viewValue": languageJson["basemap"]["relevo"][language],
                        "visible": false
                    },
                    {
                        "value": "landsat",
                        "viewValue": languageJson["basemap"]["landsat"][language],
                        "visible": false
                    }
                ]
            }],
            "limits": [{
                "id": "limits_bioma",
                "types": [{
                        "value": "biomas",
                        "Viewvalue": languageJson["limits"]["bioma"][language],
                        "visible": true,
                        "layer_limits": true,
                        "opacity": 1
                    },
                    {
                        "value": "bi_ce_estados_250_2013_ibge",
                        "Viewvalue": languageJson["limits"]["estados"][language],
                        "visible": false,
                        "layer_limits": true,
                        "opacity": 1
                    },
                    {
                        "value": "bi_ce_municipios_250_2019_ibge",
                        "Viewvalue": languageJson["limits"]["municipios"][language],
                        "visible": false,
                        "layer_limits": true,
                        "opacity": 1
                    },
                    {
                        "value": "limites_cartas_ibge",
                        "Viewvalue": languageJson["limits"]["cartas_ibge"][language],
                        "visible": false,
                        "layer_limits": true,
                        "opacity": 1
                    }
                ],
                "selectedType": 'biomas',
            }]
        }

        response.send(result)
        response.end()

    };

    Controller.host = function(request, response) {

        var baseUrls = config.ows_domains.split(",");

        for (let i = 0; i < baseUrls.length; i++) {
            baseUrls[i] += "/ows"
        }

        response.send(baseUrls);
        response.end();
    }


    return Controller;

}