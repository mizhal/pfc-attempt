'use strict';

var Promise = require('bluebird');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('DatosAlumnos', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_completo: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      codigo_uo: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      foto: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      cursoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Cursos",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }).then(function(){
      // indices
      return Promise.all([
        queryInterface.addIndex("DatosAlumnos", ["usuarioId"]),
        queryInterface.addIndex("DatosAlumnos", ["slug"]),
        queryInterface.addIndex("DatosAlumnos", ["codigo_uo"]),
        queryInterface.addIndex("DatosAlumnos", ["cursoId"])
      ]);

    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('DatosAlumnos');
  }
};
