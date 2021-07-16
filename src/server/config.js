const appRoot = require('app-root-path');
const env = process.env;

module.exports = function(app) {

    const appProducao = env.APP_PRODUCAO;
    const appProducaocepf = env.APP_PRODUCAO;

    let config = {
        "appRoot": appRoot,
        "clientDir": appRoot + env.CLIENT_DIR,
        "downloadDir": "/data/dados-lapig/download_atlas/",
        "langDir": appRoot + env.LANG_DIR,
        "logDir": appRoot + env.LOG_DIR,
        "fieldDataDir": appRoot + env.FIELD_DATA_DIR,
        "uploadDataDir": appRoot + env.UPLOAD_DATA_DIR,
        "downloadDataDir": appRoot + env.DOWNLOAD_DATA_DIR,
        "pg_lapig": {
            "user": env.PG_USER,
            "host": env.PG_HOST,
            "database": env.PG_DATABASE_LAPIG,
            "password": env.PG_PASSWORD,
            "port": env.PG_PORT,
            "debug": env.PG_DEBUG,
            "max": 20,
            "idleTimeoutMillis": 0,
            "connectionTimeoutMillis": 0,
        },
        "pg_general": {
            "user": env.PG_USER,
            "host": env.PG_HOST,
            "database": env.PG_DATABASE_GENERAL,
            "password": env.PG_PASSWORD,
            "port": env.PG_PORT,
            "debug": env.PG_DEBUG,
            "max": 20,
            "idleTimeoutMillis": 0,
            "connectionTimeoutMillis": 0,
        },
        "port": env.PORT,
        "ows_host": env.OWS_HOST,
        "ows": env.OWS,
        "lapig-maps": env.LAPIG_MAPS
    };

    if (env.NODE_ENV === 'prod') {
        config['dbpath'] = env.DB_PATH
        config["pg_lapig"] = {
            "user": env.PG_USER,
            "host": env.PG_HOST,
            "database": env.PG_DATABASE_LAPIG,
            "password": env.PG_PASSWORD,
            "port": env.PG_PORT,
            "debug": env.PG_DEBUG,
            "max": 20,
            "idleTimeoutMillis": 0,
            "connectionTimeoutMillis": 0,
        };
        config["pg_general"] = {
            "user": env.PG_USER,
            "host": env.PG_HOST,
            "database": env.PG_DATABASE_GENERAL,
            "password": env.PG_PASSWORD,
            "port": env.PG_PORT,
            "debug": env.PG_DEBUG,
            "max": 20,
            "idleTimeoutMillis": 0,
            "connectionTimeoutMillis": 0,
        };
        config["clientDir"] = appRoot + env.CLIENT_DIR;
        config["ows_host"] = env.OWS_HOST;
        config["fieldDataDir"] = appProducao + env.FIELD_DATA_DIR;
        config["uploadDataDir"] = appProducao + env.UPLOAD_DATA_DIR;
        config["downloadDir"] = env.DOWNLOAD_DIR;
        config["downloadDataDir"] = appProducaocepf + env.DOWNLOAD_DATA_DIR;
    }

    return config;

}