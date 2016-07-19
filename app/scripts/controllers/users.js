'use strict';
var app = angular.module('liteWaveApp');

app.controller('UserListCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'users',
  function ($rootScope, $scope, $location, $routeParams, users)
  {
    $rootScope.currentArea = "users";
    var editUserTemplate = '<div style="text-align:center"><a ng-href="/#/users/{{row.entity._id}}/edit">Edit</a></div>';
    $scope.users = users;
    $scope.gridOptions = {
      data: 'users',
      multiSelect: false,
      columnDefs: [
      { field: 'edit', displayName: '', width: 25, cellTemplate: editUserTemplate },
      { field: 'name', displayName: 'Name' },
      { field: 'username', displayName: 'Email/Username' },
      { field: 'userType', displayName: 'Type' }
      ]
    };
  }]);

app.controller('UserEditCtrl', ['$scope', '$location', 'user',
  function ($scope, $location, user)
  {
    $scope.user = user;
    $scope.userTypes = getUserTypes();

    $scope.save = function ()
    {
      $scope.user.$update(function (user)
      {
        $location.path('/users/');
      });
    };

    $scope.remove = function ()
    {
      delete $scope.user;
      $location.path('/users/');
    };

  }]);


app.controller('UserNewCtrl', ['$scope', '$location', 'Users',
  function ($scope, $location, Users)
  {
    $scope.user = new Users();
    $scope.userTypes = getUserTypes();

    $scope.save = function ()
    {
      $scope.user.$save(function (user)
      {
        $location.path('/users/');
      });
    };


  }]);

function getUserTypes()
{
  return ['Admin', 'Regular'];
};