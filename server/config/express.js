/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var multer  = require('multer');
var fs = require('fs');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use('/uploads', express.static(__dirname + "/uploads"));

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongoose_connection: mongoose.connection })
  }));
  app.use(passport.session());
  
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'assets', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    var logFile = fs.createWriteStream(
      path.join(config.root, config.log.path),
      {flags: 'a'}
    );
    app.use(morgan({
      format: config.log.format, 
      stream: logFile
    }));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    var logFile = fs.createWriteStream(
      path.join(config.root, config.log.path),
      {flags: 'a'}
    );
    app.use(morgan({
      format: config.log.format, 
      stream: logFile
    }));
    app.use(errorHandler()); // Error handler - has to be last
  }
};