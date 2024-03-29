/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/auth', require('./api/Usuario'));
  app.use('/api/translations', require('./api/Translation'));
  app.use('/api/cursos', require('./api/cursos'));

  app.use('/auth', require('./auth'));
  app.use('/debug', function(req, res){
    res.json(app._router.stack);
  });
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
