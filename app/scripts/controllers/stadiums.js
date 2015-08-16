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

    /*
    _clientId: { type: Schema.ObjectId, ref: 'Client' },  // The client associated with this Stadium.
  name: { type: String,
    required: true,
    unique: true,
    trim: true
  },
  sections: [
    {
      name: { type: String, required: true, trim: true },  // e.g. 301
      sort_index: Number,  // used for the drop downs when user selects a section
      rows: [{
        name: { type: String, required: true, trim: true },
        sort_index: Number,  // used for the drop downs when user selects a row after selecting a section
        seats: [{
          name: { type: String, required: true, trim: true },
          sort_index: Number,    // used for ordering the seat selection drop down
        }]
      }]
    }]

    */
    $scope.saveStadium = function ()
    {
      var index = 0;
      //var levels = $scope.levels; // how best to create\upload this?
      // $$$ How to upload this?
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