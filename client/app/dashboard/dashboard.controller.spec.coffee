'use strict'

describe 'Controller: DashboardCtrl', ->

  # load the controller's module
  beforeEach module 'pfcLaminasNodeApp'
  DashboardCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    DashboardCtrl = $controller 'DashboardCtrl',
      $scope: scope,
      socket: {
        syncUpdates: ->
        unsyncUpdates: ->
      }

  it 'should ...', ->
    expect(1).toEqual 1
