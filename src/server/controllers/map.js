var fs = require('fs'),
    archiver = require('archiver'),
    json2csv = require('json2csv').parse,
    languageJson = require('../assets/lang/language.json'),
    request = require('request'),
    Ows = require('../utils/ows');
const Metadado = require('../utils/metadados');

module.exports = function (app) {
    var Controller = {}
    var config = app.config;


    Controller.extent = function (request, response) {
        var queryResult = request.queryResult['extent']
        var result = {
            type: 'Feature',
            geometry: JSON.parse(queryResult[0].geojson)
        }

        response.send(result)
        response.end();

    }

    Controller.search = function (request, response) {
        var regiao;
        var result = [];
        var queryResult = request.queryResult

        queryResult.forEach(function (row) {

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

    Controller.descriptor = function (request, response) {
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
                    visible: true,
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
                    metadata: new Metadado("agricultura_agrosatelite", language).getObjectInstance(),
                    // metadata: {
                    //     title: languageJson["metadata"]["agricultura_agrosatelite"]["title"][language],
                    //     description: languageJson["metadata"]["agricultura_agrosatelite"]["description"][language],
                    //     format: languageJson["metadata"]["agricultura_agrosatelite"]["format"][language],
                    //     region: languageJson["metadata"]["agricultura_agrosatelite"]["region"][language],
                    //     period: languageJson["metadata"]["agricultura_agrosatelite"]["period"][language],
                    //     scale: languageJson["metadata"]["agricultura_agrosatelite"]["scale"][language],
                    //     system_coordinator: languageJson["metadata"]["agricultura_agrosatelite"]["system_coordinator"][language],
                    //     cartographic_projection: languageJson["metadata"]["agricultura_agrosatelite"]["cartographic_projection"][language],
                    //     cod_caracter: languageJson["metadata"]["agricultura_agrosatelite"]["cod_caracter"][language],
                    //     fonte: languageJson["metadata"]["agricultura_agrosatelite"]["fonte"][language],
                    //     contato: "lapig.cepf@gmail.com"
                    // },
                    columnsCSV: "area_ha, classe, year",
                    downloadSHP: true,
                    downloadCSV: true
                }]
            },
            {
                "id": "mapeamento_uso_solo",
                "label": languageJson["title_group_label"]["usodosolo"][language],
                "group_expanded": false,
                "layers": [{
                    "id": "mapa_uso_solo",
                    "label": languageJson["title_layer_label"]["usodosolo"][language],
                    "visible": false,
                    label: "Terraclass 2013",
                    "selectedType": 'uso_solo_terraclass',
                    "downloadSHP": true,
                    "downloadCSV": true,
                    "types": [
                        {
                            "value": "uso_solo_terraclass",
                            "Viewvalue": languageJson["type_layer_viewvalue"]["usodosolo_terraclass"][language],
                            "typeLabel": languageJson["typelabel_layer"]["type"][language],
                            "visible": false,
                            label: "Terraclass 2013",
                            "opacity": 1,
                            "regionFilter": true,
                            "order": 1,
                            "metadados": {
                                "title": languageJson["metadata"]["usodosolo_terraclass"]["title"][language],
                                "description": languageJson["metadata"]["usodosolo_terraclass"]["description"][language],
                                "format": languageJson["metadata"]["usodosolo_terraclass"]["format"][language],
                                "region": languageJson["metadata"]["usodosolo_terraclass"]["region"][language],
                                "period": languageJson["metadata"]["usodosolo_terraclass"]["period"][language],
                                "scale": languageJson["metadata"]["usodosolo_terraclass"]["scale"][language],
                                "system_coordinator": languageJson["metadata"]["usodosolo_terraclass"]["system_coordinator"][language],
                                "cartographic_projection": languageJson["metadata"]["usodosolo_terraclass"]["cartographic_projection"][language],
                                "cod_caracter": languageJson["metadata"]["usodosolo_terraclass"]["cod_caracter"][language],
                                "fonte": languageJson["metadata"]["usodosolo_terraclass"]["fonte"][language],
                                "link_fonte": "https://www.mma.gov.br/images/arquivo/80049/Cerrado/publicacoes/Livro%20EMBRAPA-WEB-1-TerraClass%20Cerrado.pdf",
                                "contato": "lapig.cepf@gmail.com"
                            },
                            "columnsCSV": "area_ha, classe"
                        },
                        // {
                        //     "value": "uso_solo_probio",
                        //     "Viewvalue": languageJson["type_layer_viewvalue"]["usodosolo_probio"][language],
                        //     "typeLabel": languageJson["typelabel_layer"]["type"][language],
                        //     "visible": false,
                        //     "opacity": 1,
                        //     "regionFilter": true,
                        //     "order": 1,
                        //     "metadados": {
                        //         "title": languageJson["metadata"]["usodosolo_probio"]["title"][language],
                        //         "description": languageJson["metadata"]["usodosolo_probio"]["description"][language],
                        //         "format": languageJson["metadata"]["usodosolo_probio"]["format"][language],
                        //         "region": languageJson["metadata"]["usodosolo_probio"]["region"][language],
                        //         "period": languageJson["metadata"]["usodosolo_probio"]["period"][language],
                        //         "scale": languageJson["metadata"]["usodosolo_probio"]["scale"][language],
                        //         "system_coordinator": languageJson["metadata"]["usodosolo_probio"]["system_coordinator"][language],
                        //         "cartographic_projection": languageJson["metadata"]["usodosolo_probio"]["cartographic_projection"][language],
                        //         "cod_caracter": languageJson["metadata"]["usodosolo_probio"]["cod_caracter"][language],
                        //         "fonte": languageJson["metadata"]["usodosolo_probio"]["fonte"][language],
                        //         "contato": "lapig.cepf@gmail.com"
                        //     },
                        //     "columnsCSV": "area_ha, classe"
                        // }

                    ]
                },
                ],
            },
            {
                "id": "areas_especiais",
                "label": languageJson["title_group_label"]["areas_especiais"][language],
                "group_expanded": false,
                "layers": [{
                    "id": "assentamentos",
                    "label": languageJson["title_layer_label"]["assentamentos"][language],
                    "visible": false,
                    "selectedType": 'assentamentos',
                    "value": "assentamentos",
                    "opacity": 1,
                    "regionFilter": true,
                    "order": 2,
                    "timeHandler": "msfilter",
                    "metadados": {
                        "title": languageJson["metadata"]["assentamentos"]["title"][language],
                        "description": languageJson["metadata"]["assentamentos"]["description"][language],
                        "format": languageJson["metadata"]["assentamentos"]["format"][language],
                        "region": languageJson["metadata"]["assentamentos"]["region"][language],
                        "period": languageJson["metadata"]["assentamentos"]["period"][language],
                        "scale": languageJson["metadata"]["assentamentos"]["scale"][language],
                        "system_coordinator": languageJson["metadata"]["assentamentos"]["system_coordinator"][language],
                        "cartographic_projection": languageJson["metadata"]["assentamentos"]["cartographic_projection"][language],
                        "cod_caracter": languageJson["metadata"]["assentamentos"]["cod_caracter"][language],
                        "fonte": languageJson["metadata"]["assentamentos"]["fonte"][language],
                        "contato": "lapig.cepf@gmail.com"
                    },
                    "columnsCSV": "",
                    "downloadSHP": true,
                    "downloadCSV": true
                },
                {
                    "id": "limites_terras_indigenas",
                    "label": languageJson["title_layer_label"]["terras_indigenas"][language],
                    "visible": false,
                    "selectedType": 'limites_terras_indigenas',
                    "value": "limites_terras_indigenas",
                    "opacity": 1,
                    "regionFilter": true,
                    "order": 2,
                    "timeHandler": "msfilter",
                    "metadados": {
                        "title": languageJson["metadata"]["terras_indigenas"]["title"][language],
                        "description": languageJson["metadata"]["terras_indigenas"]["description"][language],
                        "format": languageJson["metadata"]["terras_indigenas"]["format"][language],
                        "region": languageJson["metadata"]["terras_indigenas"]["region"][language],
                        "period": languageJson["metadata"]["terras_indigenas"]["period"][language],
                        "scale": languageJson["metadata"]["terras_indigenas"]["scale"][language],
                        "system_coordinator": languageJson["metadata"]["terras_indigenas"]["system_coordinator"][language],
                        "cartographic_projection": languageJson["metadata"]["terras_indigenas"]["cartographic_projection"][language],
                        "cod_caracter": languageJson["metadata"]["terras_indigenas"]["cod_caracter"][language],
                        "fonte": languageJson["metadata"]["terras_indigenas"]["fonte"][language],
                        "contato": "lapig.cepf@gmail.com"
                    },
                    "columnsCSV": "",
                    "downloadSHP": true,
                    "downloadCSV": true
                },
                {
                    "id": "geo_car_imovel",
                    "label": languageJson["title_layer_label"]["terras_privadas"][language],
                    "visible": false,
                    "selectedType": 'geo_car_imovel',
                    "value": "geo_car_imovel",
                    "opacity": 1,
                    "regionFilter": true,
                    "order": 2,
                    "timeHandler": "msfilter",
                    "metadados": {
                        "title": languageJson["metadata"]["terras_privadas"]["title"][language],
                        "description": languageJson["metadata"]["terras_privadas"]["description"][language],
                        "format": languageJson["metadata"]["terras_privadas"]["format"][language],
                        "region": languageJson["metadata"]["terras_privadas"]["region"][language],
                        "period": languageJson["metadata"]["terras_privadas"]["period"][language],
                        "scale": languageJson["metadata"]["terras_privadas"]["scale"][language],
                        "system_coordinator": languageJson["metadata"]["terras_privadas"]["system_coordinator"][language],
                        "cartographic_projection": languageJson["metadata"]["terras_privadas"]["cartographic_projection"][language],
                        "cod_caracter": languageJson["metadata"]["terras_privadas"]["cod_caracter"][language],
                        "fonte": languageJson["metadata"]["terras_privadas"]["fonte"][language],
                        "contato": "lapig.cepf@gmail.com"
                    },
                    "columnsCSV": "",
                    "downloadSHP": false,
                    "downloadCSV": false
                },
                {
                    "id": "unidades_planejamento_hidrico",
                    "label": languageJson["title_layer_label"]["unidades_planejamento_hidrico"][language],
                    "visible": false,
                    "selectedType": 'unidades_planejamento_hidrico',
                    "value": "unidades_planejamento_hidrico",
                    "opacity": 1,
                    "regionFilter": true,
                    "order": 2,
                    "timeHandler": "msfilter",
                    "metadados": {
                        "title": languageJson["metadata"]["unidades_planejamento_hidrico"]["title"][language],
                        "description": languageJson["metadata"]["unidades_planejamento_hidrico"]["description"][language],
                        "format": languageJson["metadata"]["unidades_planejamento_hidrico"]["format"][language],
                        "region": languageJson["metadata"]["unidades_planejamento_hidrico"]["region"][language],
                        "period": languageJson["metadata"]["unidades_planejamento_hidrico"]["period"][language],
                        "scale": languageJson["metadata"]["unidades_planejamento_hidrico"]["scale"][language],
                        "system_coordinator": languageJson["metadata"]["unidades_planejamento_hidrico"]["system_coordinator"][language],
                        "cartographic_projection": languageJson["metadata"]["unidades_planejamento_hidrico"]["cartographic_projection"][language],
                        "cod_caracter": languageJson["metadata"]["unidades_planejamento_hidrico"]["cod_caracter"][language],
                        "fonte": languageJson["metadata"]["unidades_planejamento_hidrico"]["fonte"][language],
                        "contato": "lapig.cepf@gmail.com"
                    },
                    "columnsCSV": "",
                    "downloadSHP": true,
                    "downloadCSV": true
                }
                ]
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
                        label: "Planet",
                        order: 10,
                        opacity: 1,
                        visible: false,
                        timeLabel: languageJson["typelabel_layer"]["year"][language],
                        typeLabel: languageJson["typelabel_layer"]["type"][language],
                        timeSelected: "global_quarterly_2021q3_mosaic",
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
                        },
                        {
                            value: "global_quarterly_2021q2_mosaic",
                            Viewvalue: "2021/2ºTri"
                        }, {
                            value: "global_quarterly_2021q3_mosaic",
                            Viewvalue: "2021/3ºTri"
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
                    },
                        // {
                        //     value: "landsat",
                        //     Viewvalue: "Landsat",
                        //     order: 10,
                        //     download: [],
                        //     opacity: 1,
                        //     timeLabel: languageJson["typelabel_layer"]["year"][language],
                        //     typeLabel: languageJson["typelabel_layer"]["type"][language],
                        //     metadata: languageJson["descriptor"]["imagens"]["layers"]['satelite']['landsat']['metadata'],
                        //     timeLabel: languageJson["descriptor"]["imagens"]["layers"]["satelite"]["timelabel"][language],
                        //     timeSelected: "bi_ce_mosaico_landsat_completo_30_2020_fip",
                        //     timeHandler: "layername",
                        //     times: [{
                        //         value: "bi_ce_mosaico_landsat_completo_30_2000_fip",
                        //         Viewvalue: "2000"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2002_fip",
                        //         Viewvalue: "2002"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2004_fip",
                        //         Viewvalue: "2004"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2006_fip",
                        //         Viewvalue: "2006"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2008_fip",
                        //         Viewvalue: "2008"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2010_fip",
                        //         Viewvalue: "2010"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2012_fip",
                        //         Viewvalue: "2012"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2013_fip",
                        //         Viewvalue: "2013"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2014_fip",
                        //         Viewvalue: "2014"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2015_fip",
                        //         Viewvalue: "2015"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2016_fip",
                        //         Viewvalue: "2016"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2017_fip",
                        //         Viewvalue: "2017"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2018_fip",
                        //         Viewvalue: "2018"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2019_fip",
                        //         Viewvalue: "2019"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_landsat_completo_30_2020_fip",
                        //         Viewvalue: "2020"
                        //     }
                        //     ],
                        //     metadata: {
                        //         title: languageJson["metadata"]["agricultura_agrosatelite"]["title"][language],
                        //         description: languageJson["metadata"]["agricultura_agrosatelite"]["description"][language],
                        //         format: languageJson["metadata"]["agricultura_agrosatelite"]["format"][language],
                        //         region: languageJson["metadata"]["agricultura_agrosatelite"]["region"][language],
                        //         period: languageJson["metadata"]["agricultura_agrosatelite"]["period"][language],
                        //         scale: languageJson["metadata"]["agricultura_agrosatelite"]["scale"][language],
                        //         system_coordinator: languageJson["metadata"]["agricultura_agrosatelite"]["system_coordinator"][language],
                        //         cartographic_projection: languageJson["metadata"]["agricultura_agrosatelite"]["cartographic_projection"][language],
                        //         cod_caracter: languageJson["metadata"]["agricultura_agrosatelite"]["cod_caracter"][language],
                        //         fonte: languageJson["metadata"]["agricultura_agrosatelite"]["fonte"][language],
                        //         contato: "lapig.cepf@gmail.com"
                        //     }
                        // },
                        // {
                        //     value: "sentinel",
                        //     Viewvalue: "Sentinel",
                        //     order: 10,
                        //     download: [],
                        //     opacity: 1,
                        //     timeLabel: languageJson["typelabel_layer"]["year"][language],
                        //     typeLabel: languageJson["typelabel_layer"]["type"][language],
                        //     timeLabel: languageJson["descriptor"]["imagens"]["layers"]["satelite"]["timelabel"][language],
                        //     timeSelected: "bi_ce_mosaico_sentinel_10_2020_lapig",
                        //     timeHandler: "layername",
                        //     times: [{
                        //         value: "bi_ce_mosaico_sentinel_10_2016_lapig",
                        //         Viewvalue: "2016"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_sentinel_10_2017_lapig",
                        //         Viewvalue: "2017"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_sentinel_10_2018_lapig",
                        //         Viewvalue: "2018"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_sentinel_10_2019_lapig",
                        //         Viewvalue: "2019"
                        //     },
                        //     {
                        //         value: "bi_ce_mosaico_sentinel_10_2020_lapig",
                        //         Viewvalue: "2020"
                        //     }
                        //     ],
                        //     metadata: {
                        //         title: languageJson["metadata"]["agricultura_agrosatelite"]["title"][language],
                        //         description: languageJson["metadata"]["agricultura_agrosatelite"]["description"][language],
                        //         format: languageJson["metadata"]["agricultura_agrosatelite"]["format"][language],
                        //         region: languageJson["metadata"]["agricultura_agrosatelite"]["region"][language],
                        //         period: languageJson["metadata"]["agricultura_agrosatelite"]["period"][language],
                        //         scale: languageJson["metadata"]["agricultura_agrosatelite"]["scale"][language],
                        //         system_coordinator: languageJson["metadata"]["agricultura_agrosatelite"]["system_coordinator"][language],
                        //         cartographic_projection: languageJson["metadata"]["agricultura_agrosatelite"]["cartographic_projection"][language],
                        //         cod_caracter: languageJson["metadata"]["agricultura_agrosatelite"]["cod_caracter"][language],
                        //         fonte: languageJson["metadata"]["agricultura_agrosatelite"]["fonte"][language],
                        //         contato: "lapig.cepf@gmail.com"
                        //     }
                        // }
                    ]
                }]
            }
            ],
            "basemaps": [{
                "id": "basemaps",
                "defaultBaseMap": 'mapbox',
                "types": [{
                    "value": "mapbox",
                    "viewValue": languageJson["basemap"]["mapbox"][language],
                    "visible": true
                },
                {
                    "value": "mapbox-dark",
                    "viewValue": languageJson["basemap"]["mapbox-dark"][language],
                    "visible": false
                },
                {
                    "value": "roads",
                    "viewValue": languageJson["basemap"]["roads"][language],
                    "visible": false
                },
                {
                    "value": "bing",
                    "viewValue": languageJson["basemap"]["bing"][language],
                    "visible": false
                },
                {
                    "value": "planet",
                    "viewValue": languageJson["basemap"]["planet"][language],
                    "visible": false
                },
                {
                    "value": "google",
                    "viewValue": languageJson["basemap"]["google"][language],
                    "visible": false
                },
                {
                    "value": "bing",
                    "viewValue": languageJson["basemap"]["bing"][language],
                    "visible": false
                }
                ]
            }],
            "limits": [{
                "id": "limits_bioma",
                "types": [{
                    "value": "biomas",
                    "label": languageJson["limits"]["bioma"][language],
                    "visible": true,
                    "layer_limits": true,
                    "opacity": 1
                },
                {
                    "value": "estados",
                    "label": languageJson["limits"]["estados"][language],
                    "visible": false,
                    "layer_limits": true,
                    "opacity": 1
                },
                {
                    "value": "municipios",
                    "label": languageJson["limits"]["municipios"][language],
                    "visible": false,
                    "layer_limits": true,
                    "opacity": 1
                },
                {
                    "value": "limites_cartas_ibge",
                    "label": languageJson["limits"]["cartas_ibge"][language],
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

    Controller.host = function (request, response) {

        var baseUrls = config.ows_domains.split(",");

        for (let i = 0; i < baseUrls.length; i++) {
            baseUrls[i] += "/ows"
        }

        response.send(baseUrls);
        response.end();
    }


    return Controller;

}