'use strict';

angular.module('liteWaveApp')
.controller('StadiumsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Stadiums',
  function ($rootScope, $scope, $routeParams, $location, Clients, Stadiums)
  {
    $rootScope.currentArea = "stadiums";

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);
    });

    $scope.saveStadium = function ()
    {
      var index = 0;
      // Look at commands creation, create smaller arrays, then build them up.
      //var levels = $scope.levels; // how best to create\upload this?
      //var levelsInfo = [{ "level": "floor", "sections": [{ "section": "1", "rows": [{ "row": "A", "seats": [{ "seat": "1", "seat": "2" }] }] }] }];
      //var levelsInfo = [{ "levels": [{ "name": "floor", sort_index: 0, "sections": [{ "name": "1", sort_index: 0, "rows": [{ "name": "A", sort_index: 0, "seats": [{ "name": "1", sort_index: 0, "name": "2" }] }] }] }] }];

      var levelInfo = [{ "name": "floor", sort_index: 0, "sections": [{ "name": "1", sort_index: 0, "rows": [{ "name": "A", sort_index: 0, "seats": [{ "name": "1", sort_index: 0 }, { "name": "2", sort_index: 1 }] }] }] }];

      var stadium = new Stadiums({
        name: $scope.name,
        _clientId: $rootScope.currentClient._id,
        levels: levelInfo,
      });
      stadium.$save(function (response)
      {
        console.log(response);
      });
    };

    /*$scope.remove = function (event) {
      event.$remove();

        for (var i in $scope.shows) {
          if ($scope.shows[i] == show) {
                $scope.shows.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var show = $scope.show;
        if (!show.updated) {
            show.updated = [];
        }

        show.$update(function() {
            $location.path('/events/' + show._eventId + '/shows/' + show._id);
        });
    };
   */

  }]);