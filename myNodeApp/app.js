var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var config = require('config-json');
config.load('Config.json');

var app = express();

var bunyan = require('bunyan');
var bunyanStreamsConfig = require('bunyan-streams-config');
var loggerConfig = config.get('log');

logger = bunyan.createLogger({
  name: "base",
  streams: bunyanStreamsConfig(loggerConfig)
  // streams: [
  //   {
  //     level: 'info',
  //     stream: process.stdout            // log INFO and above to stdout
  //   },
  //   {
  //     level: 'error',
  //     path: 'ErrorFile.log'  // log ERROR and above to a file
  //   },
  //   {
  //     level: 'info',
  //     path: 'FullFile.log'  // log ERROR and above to a file
  //   }
  // ]
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

logger.info("Rendering");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
