var pg = require('pg');
var query = require('pg-query');
var connectionString = 'postgres://postgres:1234@localhost/myplaylists';


query.connectionParameters = connectionString;

var exports = module.exports = {};

exports.insertQuery = function(tableName, toInsert, callback){
    var queryString = 'insert into ' + tableName + toInsert;
    query(queryString, function(err, res, result) {
        callback(err, res);
    });
};

exports.getQuery = function(tableName, where, callback) {
    var queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + where;
    console.log(queryString);
    query(queryString, function(err, rows, result) {
        console.log("Result in DB");
        console.log(rows);
        callback(err, rows);
    });
};
