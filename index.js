var express = require ('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

//Bring in the data model
require('./routes/models/db');
//Bring the passport config
require('./routes/config/passport');

//Bring the routes for the API
var routesAPI = require('./routes/index');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//TODO uncomment when favicon in public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
//serve bin folder to serve static ressources
app.use(express.static(path.join(__dirname, 'bin')));

//initialize passport before using the route middleware
app.use(passport.initialize());

//Use the api routes when paths starts with /api
app.use('/api', routesAPI);

// Otherwise render the index.ejs page for the Angular SPA
//  This means we don't have to map all of the SPA routes in Express
app.use(function(req, res) {
  var p = path.join(__dirname, 'views', 'index.html');
  res.sendFile(p);
  //console.log(p); //TODO Delete
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;


/*var express = require('express');
var app = express();
var pg = require('pg');
var connectionString = 'postgres://postgres:1234@localhost/myplaylists'

pg.connect(connectionString, onConnect);

function onConnect(err, client, done){
	if(err){
		console.error(err);
		process.exit(1);
	}

	client.end();
}

var _ = require('underscore');
var connectWithConnectionString =  _.bind(_.partial(pg.connect, connectionString), pg);


function buildSelectQuery(tableName) {
  return ['select * from', tableName].join(' ');
}

function buildQueryClient(query) {
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

//Handles callback errors using `errorCheck` and printRows with
//optional text.
var printRows = function(text) {
  return errorCheck(function(results) {
    console.log(results.rows);
    if (text) console.log(text);
  });
}



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
*/