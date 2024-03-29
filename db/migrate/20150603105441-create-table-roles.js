'use strict';

var Promise = require("bluebird");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("Roles", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        slug: {
          type: Sequelize.STRING(32),
          allowNull: false
        },
        nombre: {
          type: Sequelize.STRING(32),
          allowNull: false
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      })
      .then(function(){
        return queryInterface.addIndex("Roles", ["nombre"], 
          { indicesType: "UNIQUE"}
        );  
      })
      .then(function(){
        return queryInterface.addIndex("Roles", ["slug"], 
          { indicesType: "UNIQUE"}
        );          
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("Roles");
  }
};
