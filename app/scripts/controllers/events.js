'use strict';

angular.module('liteWaveApp')
.controller('EventsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Events', 'LogicalLayout2', 'Stadiums',
function ($rootScope, $scope, $routeParams, $location, Clients, Events, LogicalLayout2, Stadiums)
  {
    $rootScope.currentArea = "events";

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      if (!$rootScope.currentClient)
      {
        $rootScope.setClient(clients[0]);
      }
    });

    Stadiums.query({}, function (stadiums)
    {
      if (stadiums && stadiums.length)
      {
        var stadiumLength = stadiums.length;
        for (var i = 0; i < stadiumLength; i++)
        {
          if (stadiums[i]._clientId === $rootScope.currentClient._id)
          {
            $rootScope.currentStadium = stadiums[i];
            break;
          }
        }

        LogicalLayout2.query({}, function (layouts)
        {
          if (layouts && layouts.length)
          {
            var layoutsLength = layouts.length;
            for (var i = 0; i < layoutsLength; i++)
            {
              if (layouts[i]._stadiumId === $rootScope.currentStadium._id)
              {
                $rootScope.stadiumLayouts.push(layouts[i]);
              }
            }
          }
        });
      }
    });

    $scope.changeLayout = function (stadiumLayout)
    {
      $rootScope.currentStadiumLayout = stadiumLayout;
      $scope.myData = stadiumLayout.columns;
      $scope.layoutname = stadiumLayout.name;      
      $scope.currentGroupNumber = stadiumLayout.columns.length;
      $scope.existingLayout = true;
    };

    $scope.saveEvent = function ()
    {
      console.log("current Client Id" + $rootScope.currentClient._id + ": Current Stadium Id" + $rootScope.currentStadium._id);

      // $$$ Present the list of logical layouts for the stadium. Present in a dropdown for the user to select the one they want to use. 
      // To create a new one, they need to use the create Layout page.

      // Should read this from another location in the UI I guess.
      var settings = { "backgroundColor": "255,255,255", "borderColor": "0,0,0", "highlightColor": "222,32,50", "textColor": "0,0,0", "textSelectedColor": "255,255,255", "retryCount": "3","logoUrl":"https://s-media-cache-ak0.pinimg.com/originals/a7/e0/5d/a7e05d588e5bdf5f4f7a4d3ea03486a2.gif"};

      // $$$ Set  _logicalLayoutId from the layout selected from the drop down.
      var event = new Events({
        name: $scope.name,
        date: $scope.date,
        _logicalLayoutId: $rootScope.currentStadiumLayout._id,
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
          alert("Event successfully created. Click the Game Day tab to see new event.");
        }
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
