'use strict';

var app = angular.module('liteWaveApp');
app.controller('ClientListCtrl', ['$rootScope', '$scope', 'clients',
  function ($rootScope, $scope, clients)
  {
    $rootScope.currentArea = "clients";
    $scope.clients = clients;

    $rootScope.clients = clients;
    if (!$rootScope.currentClient)
    {
      $rootScope.setClient(clients[0]);
    }

    var editClientTemplate = '<div style="text-align:center"><a ng-href="#/clients/{{row.entity._id}}/edit">Edit</a></div>';

    $scope.gridOptions = {
      data: 'clients',
      multiSelect: false,
      columnDefs: [
      { field: 'edit', displayName: '', width: 25, cellTemplate: editClientTemplate },
      { field: 'name', displayName: 'Name' },
      ]
    };
  }]);

app.controller('ClientEditCtrl', ['$scope', '$location', 'client',
  function ($scope, $location, client)
  {
    $scope.client = client;

    $scope.save = function ()
    {
      $scope.client.$update(function (client)
      {
        $location.path('/clients/');
      });
    };

    $scope.deleteClient = function ()
    {
      if ($scope.client)
      {
        $scope.client.$delete();
        $location.path('/clients/');
      }
    };

    /*$scope.remove = function ()
    {
      delete $scope.client;
      $location.path('/clients/');
    };*/
}]);

app.controller('ClientNewCtrl', ['$scope', '$location', 'Clients',
  function ($scope, $location, Clients)
  {
    $scope.client = new Clients();

    $scope.save = function ()
    {
      $scope.client.$save(function (client)
      {
        $location.path('/clients/');
      });
    };
}]);