'use strict';

angular.module('liteWaveApp')
.controller('EventsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Events',
  function ($rootScope, $scope, $routeParams, $location, Clients, Events)
  {
    $rootScope.currentArea = "events";

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);
    });

    $scope.saveEvent = function ()
    {
      // This eventually should be set in the UI by the user highlighting sections in the stadium map.
      // Should validate against the Stadium's data
      var index = 0;
      var logicalLayout = { "id": 1, "columns": [{ "id": index++, "sectionList": ["101", "201", "301"] }] };
      logicalLayout.columns.push({ "id": index++, "sectionList": ["102", "202", "302"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["103", "203", "204", "303", "304"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["104", "205", "305"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["1", "105", "206", "207", "306", "307", "308"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["2", "106", "208", "309"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["3", "107", "209", "310"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["4", "108", "210", "211", "311", "312", "313"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["109", "212", "314"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["110", "213", "214", "315", "316"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["111", "215", "317"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["112", "216", "318"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["113", "217", "319"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["114", "218", "219", "320", "321"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["115", "220", "322"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["5", "116", "221", "222", "323", "324", "325"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["6", "117", "223", "326"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["7", "118", "224", "327"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["8", "119", "225", "226", "328", "329", "330"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["120", "227", "331"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["122", "228", "229", "332", "333"] });
      logicalLayout.columns.push({ "id": index++, "sectionList": ["123", "230", "334"] });

      var event = new Events({
        name: $scope.name,
        date: $scope.date,
        _clientId: $rootScope.currentClient._id,
        logicalLayout: logicalLayout,
      });
      event.$save(function (response)
      {
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