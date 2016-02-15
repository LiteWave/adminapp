'use strict';

angular.module('liteWaveApp')
.controller('EventsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Events', 'LogicalLayout', 'Stadiums',
function ($rootScope, $scope, $routeParams, $location, Clients, Events, LogicalLayout, Stadiums)
  {
    $rootScope.currentArea = "events";
  
    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);

      Stadiums.query({ clientId: $rootScope.currentClient._id }, function (stadium)
      {
        if (stadium && stadium.length)
        {
          $rootScope.currentStadium = stadium[0];
        }
      });
    });

    $scope.saveEvent = function ()
    {
        console.log("current Client Id" + $rootScope.currentClient._id + ": Current Stadium Id" + $rootScope.currentStadium._id);

      // This eventually should be set in the UI by the user highlighting sections in the stadium map.
      // Should validate against the Stadium's data
      var index = 0;
      var columns = [{ "id": index++, "sectionList": ["101", "201", "301"] }];
      columns.push({ "id": index++, "sectionList": ["102", "202", "302"] });
      columns.push({ "id": index++, "sectionList": ["103", "203", "204", "303", "304"] });
      columns.push({ "id": index++, "sectionList": ["104", "205", "305"] });
      columns.push({ "id": index++, "sectionList": ["1", "105", "206", "207", "306", "307", "308"] });
      columns.push({ "id": index++, "sectionList": ["2", "106", "208", "309"] });
      columns.push({ "id": index++, "sectionList": ["3", "107", "209", "310"] });
      columns.push({ "id": index++, "sectionList": ["4", "108", "210", "211", "311", "312", "313"] });
      columns.push({ "id": index++, "sectionList": ["109", "212", "314"] });
      columns.push({ "id": index++, "sectionList": ["110", "213", "214", "315", "316"] });
      columns.push({ "id": index++, "sectionList": ["111", "215", "317"] });
      columns.push({ "id": index++, "sectionList": ["112", "216", "318"] });
      columns.push({ "id": index++, "sectionList": ["113", "217", "319"] });
      columns.push({ "id": index++, "sectionList": ["114", "218", "219", "320", "321"] });
      columns.push({ "id": index++, "sectionList": ["115", "220", "322"] });
      columns.push({ "id": index++, "sectionList": ["5", "116", "221", "222", "323", "324", "325"] });
      columns.push({ "id": index++, "sectionList": ["6", "117", "223", "326"] });
      columns.push({ "id": index++, "sectionList": ["7", "118", "224", "327"] });
      columns.push({ "id": index++, "sectionList": ["8", "119", "225", "226", "328", "329", "330"] });
      columns.push({ "id": index++, "sectionList": ["120", "227", "331"] });
      columns.push({ "id": index++, "sectionList": ["122", "228", "229", "332", "333"] });
      columns.push({ "id": index++, "sectionList": ["123", "230", "334"] });

      // Should read this from another location in the UI I guess.
      var settings = { "backgroundColor": "255,255,255", "borderColor": "0,0,0", "highlightColor": "222,32,50", "textColor": "0,0,0", "textSelectedColor": "255,255,255", "retryCount": "3","logoUrl":"https://s-media-cache-ak0.pinimg.com/originals/a7/e0/5d/a7e05d588e5bdf5f4f7a4d3ea03486a2.gif"};

      var event = new Events({
        name: $scope.name,
        date: $scope.date,
        _clientId: $rootScope.currentClient._id,
        _stadiumId: $rootScope.currentStadium._id,
        settings: settings
      });      

      console.log("event name" + event.name + ": date:" + event.date + ":clientid:" + event._clientId + ": Stadium Id:" + event._stadiumId);

      // Save the event.
      event.$save(function (response)
      {
        console.log(response);

        if (response._id)
        {
          var layout = new LogicalLayout({
            _eventId: response._id,
            name: $scope.name,
            columns: columns
          });

          // Save the layout.
          layout.$save(function (response2)
          {
            console.log(response2);

            if (response2._id)
            {
              // Update the Event with the id of this layout
              event._logicalLayoutId = response2._id;
              event.$update();

              alert("Event successfully created. Click the Game Day tab to see new event.");
            }            
          });
        }
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
