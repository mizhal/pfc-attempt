'use strict';

// cargar el modelo
var UsuariosFacade = require("../../server/api/Usuario/Usuario.model.js")
var Usuario = UsuariosFacade.Usuario;
var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var admin = Usuario.build({
      login: "admin",
      password: "admin"
    });
    return admin.habilitar()
      .then(function(admin){
        return admin.save();
      });
  },

  down: function (queryInterface, Sequelize) {
    return Usuario.findOne({login: "admin"})
      .then(function(admin){
        return admin.destroy();
      });
  }
};
