module.exports = function (app) {

    var dataInjector = app.middleware.dataInjector;
    var charts = app.controllers.charts;

    app.get('/service/charts/lulc', dataInjector, charts.lulc);
    app.get('/service/charts/timeseries', dataInjector, charts.timeseries);

}