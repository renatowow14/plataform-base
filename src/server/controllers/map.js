const languageJson = require('../assets/lang/language.json');
const Metadado = require('../models/metadados');
const DescriptorBuilder = require('../utils/descriptorBuilder');

module.exports = function (app) {
    const Controller = {}
    const config = app.config;

    Controller.extent = function (request, response) {
        const queryResult = request.queryResult['extent']
        const result = {
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
        const { lang } = request.query;
        const result = {
            // regionFilterDefault: "bioma='CERRADO'", // Non-obrigatory property to define a filter to Region applied to EVERY layer.
            groups: DescriptorBuilder().getGroupLayers(lang),
            basemaps: DescriptorBuilder().getBasemapsOrLimitsLayers(lang, 'basemaps'),
            limits: DescriptorBuilder().getBasemapsOrLimitsLayers(lang, 'limits'),
        }

        response.send(result);
        response.end();
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