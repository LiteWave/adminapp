'use strict';

var app = angular.module('liteWaveApp');
app.controller('ClientListCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Clients',
  function ($rootScope, $scope, $location, $routeParams, Clients)
  {
    $rootScope.currentArea = "admin";
    var editClientTemplate = '<div style="text-align:center"><a ng-href="/#/clients/{{row.entity._id}}/edit"><i class="icon-edit"></i></a></div>';

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);
    });

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
      $scope.user.$update(function (client)
      {
        $location.path('/clients/');
      });
    };

    $scope.remove = function ()
    {
      delete $scope.client;
      $location.path('/clients/');
    };
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