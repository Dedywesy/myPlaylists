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
