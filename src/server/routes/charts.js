module.exports = function(app) {

    var dataInjector = app.middleware.dataInjector;
    var charts = app.controllers.charts;

    app.get('/service/charts/lulc', dataInjector, charts.chartslulc);
    app.get('/service/charts/deforestation', dataInjector, charts.deforestation);

}