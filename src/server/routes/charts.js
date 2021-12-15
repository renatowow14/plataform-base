module.exports = function (app) {

    var dataInjector = app.middleware.dataInjector;
    var charts = app.controllers.charts;

    app.get('/service/charts/area1', dataInjector, charts.handleArea1Data);
    app.get('/service/charts/area2', dataInjector, charts.handleArea2Data);

}