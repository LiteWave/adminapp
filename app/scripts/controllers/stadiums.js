'use strict';

var app = angular.module('liteWaveApp');
app.controller('StadiumListCtrl', ['$rootScope', '$scope', 'stadiums', 'Clients',
  function ($rootScope, $scope, stadiums, Clients)
  {
    $rootScope.currentArea = "stadiums";
    $scope.stadiums = stadiums;
    var editStadiumTemplate = '<div style="text-align:center"><a ng-href="#/stadiums/{{row.entity._id}}/edit">Edit</a></div>';

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      if (!$rootScope.currentClient)
      {
        $rootScope.setClient(clients[0]);
      }
    });

    $scope.gridOptions = {
      data: 'stadiums',
      multiSelect: false,
      columnDefs: [
      { field: 'edit', displayName: '', width: 25, cellTemplate: editStadiumTemplate },
      { field: 'name', displayName: 'Name' },
      ]
    };
  }]);

app.controller('StadiumEditCtrl', ['$scope', '$location', 'stadium',
  function ($scope, $location, stadium)
  {
    $scope.stadium = stadium;

    $scope.save = function ()
    {
      $scope.stadium.$update(function (stadium)
      {
        $location.path('/stadiums/');
      });
    };

    $scope.deleteStadium = function ()
    {
      if ($scope.stadium)
      {
        $scope.stadium.$delete();
        $location.path('/stadiums/');
      }
    };
}]);

app.controller('StadiumNewCtrl', ['$scope', '$location', 'Stadiums',
  function ($scope, $location, Stadiums)
  {
    $scope.stadium = new Stadiums();

    $scope.save = function ()
    {
      $scope.stadium.$save(function (stadium)
      {
        $location.path('/stadiums/');
      });
    };
}]);