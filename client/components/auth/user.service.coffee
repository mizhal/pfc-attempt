'use strict'

angular.module 'pfcLaminasNodeApp'
.factory 'User', ($resource) ->
  $resource '/api/auth/usuarios/:id/:controller',
    id: '@_id'
  ,
    changePassword:
      method: 'PUT'
      params:
        controller: 'password'

    get:
      method: 'GET'
      params:
        id: 'me'

