var pg = require('pg');
var query = require('pg-query');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/myplaylists';

if (process.env.DATABASE_URL) { //connection from heroku
    pg.defaults.ssl = true;
    console.log(process.env.DATABASE_URL);
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
        var queryString = 'insert into ' + tableName + toInsert + 'RETURNING *';
        client.query(queryString, function (err, res) {
            done();
            console.log("insert", err, res.rows[0].ID);
            if (err) {
                return console.error('error running INSERT query', err);
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
                return console.error('error running GET query', err);
            }
            callback(err, res);
        });
    });
};

exports.updateQuery = function (tableName, setArg, where, callback) {
    pool.connect(function(err, client, done) {
        if(err){
            return console.error('error fetching client from pool', err);
        }
        var queryString = 'UPDATE ' + tableName + ' SET ' + setArg + ' WHERE ' + where;
        client.query(queryString, function (err, res) {
            if(err) {
            return console.error('error running UPDATE query', err);
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
    var passAndhost = res[1];
    var portAndDbName = res[2];
    var user = res[0];
    res = passAndhost.split("@");
    var password = res[0];
    var host = res[1];
    res = portAndDbName.split("/");
    var port = res[0];
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
