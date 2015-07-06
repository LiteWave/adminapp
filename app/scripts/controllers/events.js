'use strict';

angular.module('liteWaveApp')
.controller('EventsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Events',
  function ($rootScope, $scope, $routeParams, $location, Clients, Events) {
    $rootScope.currentArea = "events";

    Clients.query({}, function (clients) {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);
    });

    $scope.saveEvent = function () {
        var event = new Events({
          name: $scope.name,
          date: $scope.date,
          _clientId: $rootScope.currentClient._id
        });
        event.$save(function (response) {
          console.log(response);
          //$location.path("event/" + response._id);
        });

        //this.name = "";
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