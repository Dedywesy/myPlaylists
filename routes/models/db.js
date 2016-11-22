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

/*function foo(address, fn){
 geocoder.geocode( { 'address': address}, function(results, status) {
 fn(results[0].geometry.location);
 });
 }

 foo("address", function(location){
 alert(location); // this is where you get the return value
 });*/


/*function onConnect(err, client, done){
	if(err){
		console.error(err);
		process.exit(1);
	}
  console.log('Database connected');
}

gracefulShutdown = function(msg, callback) {
  client.end();
  console.log('Database disconnected');
}

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});

process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function(){
    process.exit(0);
  });
});

//Bring schemas and models
require('./users');

var _ = require('underscore');
var connectWithConnectionString =  _.bind(_.partial(pg.connect, connectionString), pg);

var exports = module.exports = {};

function buildSelectQuery(tableName) {
  return ['select * from', tableName].join(' ');
}

function buildQuery(toSelect, tablename, where){
  return ['select', toSelect, "from", tablename, "where", where].join(' ')
}

function buildQueryUser(query) {
  return function(onQueryReturn) {
    connectWithConnectionString(function(err, client, done) {
      if(err){
        return onQueryReturn(new Error(['Database connection failed with error', err.toString()].join(' ')));
      } else {
          client.query(query, function(err, results) {
          done(err);
          onQueryReturn(err, results);
        });
      }
    });
  }
}

exports.saveUser = function(user){
  console.log("SaveUser");
  console.log(user);
  console.log(client);
  var query = ('insert into users items (email, name, hash, salt) values($1, $2, $3, $4)',[user.email, user.name, user.hash, user.salt] );
  client.query(query, function(err, results) {
    console.log(err);
    done(err);
    onQueryReturn(err, results);
  });
}

//Utility function to handle errors in callback functions.
var errorCheck = function(cb) {
  return function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      cb(result);
    }
  }
}
*/
/*function buildQueryClient(query) {
  return function(onQueryReturn) {
    connectWithConnectionString(function(err, client, done) {
      if (err) {
        return onQueryReturn(new Error(['Database connection failed with error', err.toString()].join(' ')));
      } else {
        client.query(query, function(err, results) {
          done(err);
          onQueryReturn(err, results);
        });
      }
    });
  }
}

//Selects all of the supplied tableName
function selectAll(tableName) {
  return function(onSelectReturn) {
    var sql = buildSelectQuery(tableName);
    var queryClient = buildQueryClient(sql);
    queryClient(function(err, tableValues) {
      if (err) {
        return onSelectReturn(new Error(['Select all failed on', tableName, 'with error', err.toString()].join(' ')));
      } else {
        return onSelectReturn(null, tableValues);
      }
    });
  }
}


*/