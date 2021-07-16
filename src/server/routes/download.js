module.exports = function(app) {
    var dataInjector = app.middleware.dataInjector
    var downloader = app.controllers.download;

    app.post('/service/download/csv', dataInjector, downloader.downloadCSV);
    app.post('/service/download/shp', downloader.downloadSHP);
}