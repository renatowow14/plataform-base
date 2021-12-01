const fs = require("fs");
const { convertArrayToCSV } = require('convert-array-to-csv');
const moment = require('moment');
const DownloadBuilder = require('../models/downloadBuilder');
const request = require('request');

module.exports = function(app) {
    let Controller = {};
    let self = {};

    const config = app.config;

    if (!fs.existsSync(config.downloadDataDir)) {
        fs.mkdirSync(config.downloadDataDir);
    }

    self.requestFileFromMapServer = function(url, pathFile, response) {

        let file = fs.createWriteStream(pathFile + ".zip");

        const downloadPromise = new Promise((resolve, reject) => {
            request({
                    uri: url,
                    gzip: true
                }).pipe(file).on('finish', () => {
                    resolve();
                }).on('error', (error) => {
                    reject(error);
                })
            }
        );

        downloadPromise.then(result => {
            response.download(pathFile + '.zip');
        }).catch(error => {
            response.send(error)
            response.end();
        });
    };

    Controller.downloadGeoFile = function(request, response) {
        let directory, fileParam, pathFile = '';
        let { layer, region, filter, typeDownload} = request.body;

        let builder = new DownloadBuilder(typeDownload);

        builder.setTypeName(layer.download.layertypename);

        if (region.type === 'city') {
            builder.addFilter('cd_geocmu', "'" + region.value + "'");
        } else if (region.type === 'state') {
            builder.addFilter('uf', "'" + region.value + "'");
        } else if (region.type === 'biome') {
            builder.addFilter('biome', "'" + region.value + "'");
        }

        if (filter !== undefined) {
            builder.addFilterDirect(filter.valueFilter);
            fileParam = layer.valueType + "_" + filter.valueFilter;
        } else {
            fileParam = layer.valueType;
        }

        directory = config.downloadDataDir + region.type + '/' + region.value + '/' + typeDownload + '/' + layer.valueType + '/';
        pathFile = directory + fileParam;

        console.log('URL_DOWNLOAD', builder.getMapserverURL())


        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        if (fs.existsSync(pathFile + '.zip')) {
            response.download(pathFile + '.zip');
        } else {
            self.requestFileFromMapServer(builder.getMapserverURL(), pathFile, response);
        }
    };

    return Controller;
};