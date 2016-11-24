var pg = require('pg');
var query = require('pg-query');

var config = {
    user: 'postgres', //env var: PGUSER
    database: 'myplaylists', //env var: PGDATABASE
    password: '1234', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})

var exports = module.exports = {};

exports.insertQuery = function(tableName, toInsert, callback){
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var queryString = 'insert into ' + tableName + toInsert;
        client.query(queryString, function(err, res) {
            done();
            if(err){
                return console.error('error running query', err);
            }
            callback(err, res);
        });
    });
};

exports.getQuery = function(tableName, where, callback) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + where;
        client.query(queryString, function(err, res) {
            done();
            if(err){
                return console.error('error running query', err);
            }
            callback(err, res);
        });
    });
};
