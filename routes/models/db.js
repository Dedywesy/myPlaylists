var pg = require('pg');
var query = require('pg-query');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost/myplaylists';

if (process.env.DATABASE_URL) { //connection from heroku
    pg.defaults.ssl = true;
    console.log("SSL Connection with DB");
}

var config = configFromString(connectionString)


var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
});

var exports = module.exports = {};

exports.insertQuery = function (tableName, toInsert, callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var queryString = 'insert into ' + tableName + toInsert;
        client.query(queryString, function (err, res) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            callback(err, res);
        });
    });
};

exports.getQuery = function (tableName, where, callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + where;
        client.query(queryString, function (err, res) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            callback(err, res);
        });
    });
};

function configFromString(connectString) {
    var res = connectString.split("://");
    var temp = res[1];
    var db_type = res[0];
    res = temp.split(":");
    temp = res[1];
    var user = res[0];
    res = temp.split("@");
    temp = res[1];
    var password = res[0];
    res = temp.split("/");
    var host = res[0];
    var dbname = res[1];

    var config = {
        user: user.toString(), //env var: PGUSER
        database: dbname.toString(), //env var: PGDATABASE
        password: password.toString(), //env var: PGPASSWORD
        host: host.toString(), // Server hosting the postgres database
        port: 5432, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
    return config
}