'use strict';

var UsuarioFacade = require("./Usuario.model.js");
var Usuario = UsuarioFacade.Usuario;
var Role = UsuarioFacade.Role;
var Promise = require("bluebird");

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var assert = require('chai').assert;
var expect = require('chai').expect;

var sequelize_error = require('sequelize/lib/errors.js');

/*** AUXILIARES **/

function login_as_admin(request){
  return new Promise(function(resolve, reject){
    var auth_data = {
      login: "admin", 
      password: "admin"
    };

    var credentials = {token: null}

    request(app)
      .post("/auth/local")
      .send(auth_data)
      .expect(200)
      .end(function(err, res){
        if(err){
          console.log("authentication error");
          reject(err);
        }
        credentials.token = res.body.token;
        resolve(credentials);
      });
  })
}


/*** FIN: AUXILIARES **/

describe('GET /api/auth', function() {

  before(function(){
    Usuario.findAll({where: {id: {gt: 1}}}).map(function(usuario){
      usuario.destroy();
    });
  });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/auth')
      .expect(401)
      .expect('Content-Type', "text/html; charset=utf-8")
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should make crud', function(done){
    var body = {
      login: "test1",
      password: "the-password",
      ultimo_acceso: 1,
      puede_entrar: true
    }
    Usuario.create(body)
      .then(function(usuario){
        usuario.puede_entrar = false;
        return usuario.save();
      })
      .then(function(){
        return Usuario.findOne({
          where: {
            login: body.login
          }
        });
      })
      .then(function(usuario){
        usuario.puede_entrar.should.be.equal(false);
        return usuario;
      })
      .then(function(usuario){
        return usuario.destroy();
      })
      .then(function(){
        done();
      })
      .catch(function(error){
        done(error);
      });
  });

  it('should authenticate', function(done){
    var credentials = {
      token: null
    };

    login_as_admin(request)
      .then(function(credentials){
        expect(credentials.token).to.not.equal(null);
        done();
      })
      .catch(function(error){
        assert(false, "Authentication failed");
        console.error("Authentication failed");
        done(error);
      });

  });

  it("should autenticate (direct)", function(done){
    var admin = Usuario.build({
      login: "admin-2", 
      password: "admin"
    });
    admin.save()
      .then(function(admin){
        should(admin.autenticar("admin")).equal(true);
        should(admin.autenticar("xxxx")).equal(false);
        done();
      }).catch(function(error){
        console.log("Error al crear usuario admin2");
        done(error);
      });
  });

  it('should save password encrypted in database', function(done){

    login_as_admin(request).then(function(credentials){

      var data = {
        login: "test2",
        password: "the-password",
        ultimo_acceso: 1,
        puede_entrar: true
      };

      request(app)
        .post("/api/auth/usuarios")
        .set("Authorization", "Bearer " + credentials.token)
        .send(data)
        .expect(201)
        .end(function(err, res){
          if (err) {
            console.log(err);
            return done(err);
          } else {
            data.should.be.instanceof(Object);
            res.body.should.be.instanceof(Object);
            done();
          }
        });

    }).catch(function(error){
      done(error);
    });
  });

  it("can eager load roles", function(done){
    Usuario.findOne({
      where: {login: 'admin'},
      include: {model: Role, as: "roles_full"}
    })
      .then(function(admin){
        admin["roles_full"].should.be.instanceof(Array);
        admin["roles_full"].length.should.be.equal(4);
        return done();
      })
      .catch(function(err){
        return done(err);
      });
  });

  it("can find with roles", function(done){
      Usuario.find({
        where: {
          login: "admin"
        }
      }).then(function(admin){
        admin.roles.should.be.instanceof(Array);
        var roles = admin.roles;
        expect(roles.sort()).to.eql(["admin", "usuario", "profesor", "alumno"].sort());
        done();
      });
  });

  it("can assign roles", function(done){

    Role.find({
      where: {
        slug: "test-role"
      }
    }).then(function(role){
      if(role)
        return role.destroy();
      else
        return;
    }).then(function(){
      return Role.create({
        nombre: "test-role"
      });
    }).then(function(rol){
      return Usuario.find({
        where: {
          login: "admin"
        }
      }).then(function(admin){
        return admin.anyadirRole("test-role");
      });

    }).then(function(){
      return Usuario.find({
        where: {
          login: "admin"
        }
      }).then(function(admin){
        expect(admin.roles).to.include("test-role");

        // borrar el rol de prueba para que no afecte 
        // a la cuenta de roles por defecto.
        return Role.find({
          where: {
            slug: "test-role"
          }
        }).then(function(role){
          return role.destroy();
        }).then(function(){
          done();
        });

      });

    });
  });

});

describe('GET /api/usuarios/roles', function() {

  xit('should respond with JSON array', function(done) {
    request(app)
      .get('/api/roles')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it("assign roles to user", function(done){

    Usuario.create({
        login: "have-roles",
        password: "the-password",
        ultimo_acceso: 1,
        puede_entrar: true
      }).then(function(usuario){
        return usuario.anyadirRole("profesor")
          .then(function(){
            return usuario;
          });
      }).then(function(usuario){
        return usuario.reload();
      }).then(function(usuario){
        usuario.roles.length.should.be.equal(1);
        done();
      }).catch(function(error){
        done(error);
      });
  });
});