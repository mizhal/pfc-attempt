'use strict'

angular.module 'pfcLaminasNodeApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'admin',
    url: '/admin'
    templateUrl: 'app/admin/admin.html'
    controller: 'AdminCtrl'
