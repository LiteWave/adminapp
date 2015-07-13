'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$timeout','$interval','Clients','Events', 'Shows', 'UserLocations',
function ($rootScope, $scope, $timeout, $interval, Clients, Events, Shows, UserLocations) {

    $rootScope.currentArea = "main";
    // DEMO ONLY, hardcode winner.
    $scope.demowinner = 0;
    $scope.showLength = 15;
    $scope.showStartTime = null;
    $scope.stopTime = null;
    $scope.winnerSeat = "";
    $scope.winner = null;
    $scope.activeUsers = 0;
    $scope.iPhoneUsers = 0;
    $scope.androidUsers = 0;
    $scope.stadiumCoverage = 0;
    $scope.stadiumSize = 20;
    $scope.userCheckPromise = null;
    $scope.userPollTime = 3000;
    $scope.currentShowType = 0;
    
    Clients.query({}, function(clients) {
        $rootScope.clients = clients;
        $rootScope.currentClient = clients[0];
        $rootScope.setClient($rootScope.currentClient);
    });

    $scope.setShowType = function (type) {
      $scope.currentShowType = type;
    };

    $scope.createShow = function () {
      if (!$scope.currentEvent || !$scope.currentEvent.logicalLayout || !$scope.currentEvent.logicalLayout.columns || !$scope.currentEvent.logicalLayout.columns.length) {
        alert("Please select an Event");
        return;
      }

      if (!$scope.currentEvent.logicalLayout || !$scope.currentEvent.logicalLayout.columns || !$scope.currentEvent.logicalLayout.columns.length) {
        alert("Current Event has no logical columns. Please create an Event with logical columns.");
        return;
      }

      // $scope.currentShowType;
      // for show Create commands 
      /* commands: [{
        logicalCol: Number,
        commands: [LiteShowCommandSchema]
      }],*/

      var first_length = 1000;  // 1 second
      var second_length = 750;  // 750 ms
      var third_length = 500;  // 500 ms
      var fourth_length = 250;  // 250 ms
      var black = "0,0,0";
      var red = "216,19,37";
      var white = "162,157,176";

      // for each logical column, create commands
      // $$$ this is simple logic. Need to account for logical rows and seats.
      // var seq = {"title": "Pilot Contest", "show_type":"contest", "commands": []};
      var logicalCol = 0;
      var columnLength = $scope.currentEvent.logicalLayout.columns.length;
      var cmds = [];
      // cmds.commands = [];
      while (logicalCol < columnLength) {
        //cmds = [{ "logicalCol": logicalCol, "commands": [{ "c": black, "pl1": first_length }] }];
        // cmds.commands[0] = {"pt":"w","pl1": (random time)};  // wait X ms, max delay 250ms
        //cmds.push({ "c": black, "pl1": first_length });
        cmds.push({ "c": white, "pl1": first_length });
        //cmds.commands.push({ "c": red, "pl1": first_length });
        //cmds.commands.push({ "c": black, "pl1": first_length });
        //cmds.commands.push({ "c": white, "pl1": first_length });
        //cmds.commands.push({ "c": red, "pl1": first_length, "v": true });
        logicalCol++;

        //cmds.push({ "logicalCol": logicalCol, "commands": [] });
      }
      
      var show = new Shows({
        _eventId: $scope.currentEvent._id,
        commands: cmds,
        type: $scope.currentShowType
      });
      show.$save(function (response) {
        console.log(response);
        //$location.path("event/" + response._id);
      });
    };
       
    $scope.changeEvent = function(event) {
      $scope.currentEvent = event;
    };

    $scope.deleteEvent = function () {
      if ($scope.currentEvent) {
        $scope.currentEvent.$delete();
      }      
    };

    // check for new users every second.
    $scope.checkUsers = function () {
      if ($scope.currentShow) {
        UserLocations.query({ eventId: $scope.currentShow._eventId }, function (userLocations) {
          $scope.userLocations = userLocations;
          $scope.activeUsers = userLocations.length;
          $scope.stadiumCoverage = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
          $scope.iPhoneUsers = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
        });
      }
    }

    if ($scope.userCheckPromise == null) {
        $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
    }
    
    // update list of events when the client changes
    $scope.$watch('currentClient', function(newVal, oldVal) {
        if (newVal) {
        Events.query({clientId: newVal._id}, function(events) {
          if (events && events.length) {
            $scope.events = events;
            $scope.liteshows = null;
            $scope.currentEvent = events[0];
          }
        });
      }
    });
    
    // update list of lite_shows when the event changes
    $scope.$watch('currentEvent', function(newVal, oldVal) {
        if (newVal) {
            $scope.cleanUpAfterShow();
        Shows.query({eventId: newVal._id}, function(liteshows) {
            if (liteshows && liteshows.length) {
              $scope.liteshows = liteshows;
              $scope.currentShow = liteshows[0];

              // Start checking for new users
              if ($scope.userCheckPromise == null) {
                $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
              }
            }
        });
      }
    });

    $scope.resetWinners = function () {
        $scope.winnerSeat = "";
        $scope.winner = null;
    }

    $scope.startShow = function (seconds) {

        if ($scope.userLocations.length < 1) {
            alert("Sorry, not enough users have joined this event. Cancelling show.");
            return;
        }

        // stop checking for any new users:
        if ($scope.userCheckPromise != null) {
            $interval.cancel($scope.userCheckPromise);
            $scope.userCheckPromise = null;
        }

        $timeout.cancel($scope.promise_clock);

        var now = Date.now();
        var startTime = now + (1000 * seconds);
        var stopTime = startTime + (1000 * $scope.showLength);

        // Set showStartTime for UI. Different format than just getting Date.now()
        $scope.currentShow.start_at = $scope.showStartTime = new Date(startTime).toISOString();
        $scope.stopTime = new Date(stopTime).toISOString();

        // only picking between 1 and 10. Need better algo. pick random winner from list of current users
        // For easier debugging, making first user the winner.
        $scope.winner = $scope.userLocations[$scope.demowinner];
        /*var ranNum = Math.floor((Math.random() * 10) + 1);
        if (ranNum <= $scope.userLocations.length) {
            $scope.winner = $scope.userLocations[ranNum];
        }
        else {
            ranNum = Math.floor((Math.random() * 10) + 1);
            if (ranNum <= $scope.userLocations.length) {
                $scope.winner = $scope.userLocations[$scope.demowinner];
            }
        }*/
        
        $scope.currentShow._winnerId = $scope.winner._id;
        $scope.currentShow.$update();

        // Not included yet. How to call\include separate Controller? or do we need to?
        // Shows.$setStartTime();

        $scope.percentTimeToStart = 0;
        $scope.updateTime = seconds * 10;
        $scope.updateClock();
    };

    $scope.updateClock = function() {
        $scope.current_time = new Date(Date.now()).toISOString();

        console.log('UpdateCLock: current time = ' + $scope.current_time.toString() + '. showStartTime' + $scope.showStartTime.toString());

        if ($scope.current_time < $scope.showStartTime) {
            //$scope.promise_clock = $timeout($scope.updateClock,$scope.updateTime);
            $scope.promise_clock = $timeout($scope.updateClock, 100);
        } else {
            $timeout($scope.updateShowClock, 100);
        }
    };

    $scope.updateShowClock = function () {
        $scope.current_time = new Date(Date.now()).toISOString();

        // TODO figure out what to add by deviding length of show by 100?
        $scope.percentTimeToStart += 6.66;

        console.log('UpdateShowCLock: current time = ' + $scope.current_time.toString() + ' . start_at time = ' + $scope.stopTime.toString());

        if ($scope.current_time < $scope.stopTime) {
            $scope.promise_clock = $timeout($scope.updateShowClock, 1000);
        } else {
            $timeout($scope.showIsOver, 100);
        }
    };
    
    /*$scope.showStarted = function () {
        if ($scope.current_time > $scope.currentShow.start_at) {
        return true;
      } else {
        return false;
      }
    }*/
    
    $scope.showIsOver = function () {
        if ($scope.winner == null) {
            alert("Sorry!  Couldn't pick a winning seat. Please pick a random seat.");
            return;
        }

        // stupid. Need to add string.format
        $scope.winnerSeat = "Section " + $scope.winner.user_seat.section + ", Row " + $scope.winner.user_seat.row + ", Seat " + $scope.winner.user_seat.seat_number;
    };

    $scope.cleanUpAfterShow = function () {
        $scope.percentTimeToStart = 0;
        $scope.winnerSeat = "";
        $scope.winner = null;
    }
    
    $scope.$on('$locationChangeStart', function() {
      $timeout.cancel($scope.promise_clock);
    });
    
    
  }]);

