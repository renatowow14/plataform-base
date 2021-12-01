const express = require('express'),
    load = require('express-load'),
    util = require('util'),
    compression = require('compression'),
    requestTimeout = require('express-timeout'),
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    parseCookie = require('cookie-parser');

const app = express();
const http = require('http').Server(app);
const cookie = parseCookie('LAPIG')

load('config.js', { 'verbose': false })
    .then('database')
    .then('middleware')
    .into(app);

app.database.client.init(function () {
    app.use(cookie);

    app.use(compression());
    app.use(express.static(app.config.clientDir));
    app.set('views', __dirname + '/templates');
    app.set('view engine', 'ejs');

    app.use(requestTimeout({
        'timeout': 2000 * 60 * 30,
        'callback': function (err, options) {
            let response = options.res;
            if (err) {
                util.log('Timeout: ' + err);
            }
            response.end();
        }
    }));

    app.use(responseTime());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '1gb' }));

    app.use(function (error, request, response, next) {
        console.log('ServerError: ', error.stack);
        next();
    });

    load('controllers')
        .then('routes')
        .then('utils')
        .into(app);

    app.database.client.init_general(function () { });

    const httpServer = http.listen(app.config.port, function () {
        console.log('Plataform Base Server @ [port %s] [pid %s]', app.config.port, process.pid.toString());
    });

    [`exit`, `uncaughtException`,].forEach((event) => {
        if (event === 'uncaughtException') {
            process.on(event, (e) => { })
        } else {
            process.on(event, (e) => {
                httpServer.close(() => process.exit())
            })
        }

    })
})