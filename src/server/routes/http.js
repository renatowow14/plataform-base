module.exports = function(app) {
    const http = app.controllers.http;

    app.get('/service/http/get', http.get);
}