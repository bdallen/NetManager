var express = require('express');
var ECT = require('ect');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var route_admin = require('./routes/admin');
var route_monitoring = require('./routes/monitoring');
var route_modules_mikrotik = require('./routes/modules/mikrotik');


// Routes for /data
var route_data_vrf = require('./routes/data/vrf');
var route_data_endpoints = require('./routes/data/endpoints');


const app = express();

var ectRenderer = ECT({
  watch: true,
  root: __dirname + '/views',
  ext : '.ect'
});

// view engine setup
app.engine('ect',ectRenderer.render)
app.set('view engine', 'ect');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/monitoring', route_monitoring);
app.use('/admin', route_admin);
app.use('/modules/mikrotik', route_modules_mikrotik);

// Application Definitions for /data
app.use('/data/vrf', route_data_vrf);
app.use('/data/endpoints', route_data_endpoints);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      status: err.status,
      stack: err.stack,
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
    status: err.status,
    stack: err.stack,
    error: {}
  });
});


module.exports = app;
