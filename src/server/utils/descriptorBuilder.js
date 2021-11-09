const fs = require('fs');
const path = require('path')
const lang = require('./language');
const Group = require('../models/group')
const Layer = require('../models/layer')

module.exports = function (app) {
    var Controller = {}
    var Internal = {}

    Controller.getGroupLayers = function (language) {
        var folder_path = './descriptor/groups'
        const jsonsInDir = fs.readdirSync(folder_path).filter(file => path.extname(file) === '.json');

        var groups = [];
        var order = Internal.getGroupsOrder();

        order.forEach(element => {
            jsonsInDir.forEach(file => {

                if (new String(file).toLowerCase().includes(new String(element).toLowerCase())) {

                    try {
                        const fileData = fs.readFileSync(path.join(folder_path, file), 'utf8');
                        const json = JSON.parse(fileData.toString());

                        // console.log(json)
                        json.forEach(function (item, index) {

                            // console.log(element, item)
                            var group = new Group(language, item).getGroupInstance();
                            groups.push(group)

                        });

                    } catch (e) {
                        console.error(e)
                    }
                }
            });
        });

        return groups;
    };

    Controller.getBasemapsOrLimitsLayers = function (language, type = 'basemaps') {
        var folder_path = './descriptor/' + type
        const jsonsInDir = fs.readdirSync(folder_path).filter(file => path.extname(file) === '.json');

        var layers = [];
        var order = []

        if (type.toLowerCase() == 'basemaps'.toLocaleLowerCase()) {
            order = Internal.getBasemapsOrder();
        }
        else if (type.toLowerCase() == 'limits'.toLocaleLowerCase()) {
            order = Internal.getLimitsOrder();
        }
        order.forEach(element => {
            jsonsInDir.forEach(file => {

                if (new String(file).toLowerCase().includes(new String(element).toLowerCase())) {

                    try {
                        const fileData = fs.readFileSync(path.join(folder_path, file), 'utf8');
                        const json = JSON.parse(fileData.toString());

                        // console.log(json)
                        json.forEach(function (item, index) {

                            var layer = new Layer(language, item).getLayerInstance();

                            layers.push(layer)
                        });

                    } catch (e) {
                        console.error(e)
                    }
                }
            });
        });

        return layers;
    };

    Internal.getGroupsOrder = function () {

        return ['areas_especiais',
            'agropecuaria',
            'areas_declaradas',
            'imagens'
        ]

    }

    Internal.getLimitsOrder = function () {
        return ['limits']
    }

    Internal.getBasemapsOrder = function () {
        return ['basemaps']
    }

    return Controller;

}