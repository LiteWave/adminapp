'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$timeout','$interval','Clients','Events', 'Shows', 'UserLocations', 'ShowCommands',
function ($rootScope, $scope, $timeout, $interval, Clients, Events, Shows, UserLocations, ShowCommands) {

    $rootScope.currentArea = "main";
    // DEMO ONLY, hardcode winner.
    $scope.showLength = 15;
    $scope.showStartTime = null;
    $scope.stopTime = null;
    $scope.winnerSeat = "";
    $scope.winnerSection = [];
    $scope.winner = null;
    $scope.contesturl = "";
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

    $scope.getRandomNumber = function (userCount)
    {
      return Math.floor(Math.random() * userCount);
    }

    $scope.createShow = function () {
      if (!$scope.currentEvent || !$scope.currentEvent.logicalLayout || !$scope.currentEvent.logicalLayout.columns || !$scope.currentEvent.logicalLayout.columns.length) {
        alert("Please select an Event");
        return;
      }

      if (!$scope.currentEvent.logicalLayout || !$scope.currentEvent.logicalLayout.columns || !$scope.currentEvent.logicalLayout.columns.length) {
        alert("Current Event has no logical columns. Please create an Event with logical columns.");
        return;
      }

      if (!$scope.userLocations || $scope.userLocations.length < 1)
      {
        alert("Sorry, not enough users have joined this event. Cancelling show.");
        return;
      }

      var userCount = $scope.userLocations.length;
      var randomNum;
      var retries = 0;
      do
      {
        randomNum = $scope.getRandomNumber(userCount);
        $scope.winner = $scope.userLocations[randomNum];
        retries++;
      } while (!$scope.winner && retries < 10)
      
      if (!$scope.winner)
      {
        $scope.winner = $scope.userLocations[5];
      }

      $scope.winnerSection = [];
      $scope.winnerSection.push($scope.winner.user_seat.section);

      var first_length = 500;  // 500 ms
      var second_length = 250;  // 250 ms
      var third_length = 250;  // 250 ms
      var fourth_length = 250;  // 250 ms
      var black = "0,0,0";
      var red = "216,19,37";
      var white = "162,157,176";

      // for each logical column, create commands
      // NOTE:this is simple logic. Need to account for logical rows and seats.  22
      var logicalCol = 1;
      var columnLength = $scope.currentEvent.logicalLayout.columns.length;
      var currentSection;
      var colLengthMS = columnLength * 1000;  // 22000
      var cmdList = [];
      var cmds = [];
      var onWinnerSection = false;
      var randomDelay;
      while (logicalCol <= columnLength)
      {
        currentSection = $scope.currentEvent.logicalLayout.columns[logicalCol - 1].sectionList;
        // $$$ Need to handle multiple winning sections with a loop.
        onWinnerSection = (currentSection.indexOf($scope.winnerSection.toString()) > -1);

        // Wave 1.
        if (logicalCol > 1)
        {
          // first section doesn't need to wait.
          cmdList.push({ "pt": "w", "pl1": first_length * (logicalCol - 1) });
        }
        cmdList.push({ "c": red, "pl1": first_length, "v": true });             // display 500 ms and vibrate
        cmdList.push({ "pt": "w", "pl1": colLengthMS - (first_length * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec

        // Wave 2.
        if (logicalCol > 1)
        {
          // first section doesn't need to wait.
          cmdList.push({ "pt": "w", "pl1": second_length * (logicalCol - 1) });
        }
        cmdList.push({ "c": red, "pl1": second_length, "v": true }); // display and vibrate.
        cmdList.push({ "pt": "w", "pl1": colLengthMS - (second_length * logicalCol) }); // pause 21.750 seconds, 21.5. 21.25, 21

        // Common Contest Commands
        // Generate random delay time between 0 and 100 ms for each logical column.
        // NOTE: must be small to prevent winning phone to go off too soon.
        randomDelay = $scope.getRandomNumber(100);
        cmdList.push({ "pt": "w", "pl1": randomDelay} );  // wait X ms, max delay 250ms        
        cmdList.push({ "c": black, "pl1": first_length });
        cmdList.push({ "c": white, "pl1": first_length });
        cmdList.push({ "c": red, "pl1": first_length });
        cmdList.push({ "c": black, "pl1": first_length });
        cmdList.push({ "c": white, "pl1": first_length });
        cmdList.push({ "c": red, "pl1": first_length, "v": true });

        cmdList.push({ "c": black, "pl1": second_length });
        cmdList.push({ "c": white, "pl1": second_length });

        // Take out a few commands from non-winner sections
        if (onWinnerSection)
        {
          cmdList.push({ "c": red, "pl1": second_length });
        }
        cmdList.push({ "c": black, "pl1": second_length });

        if (onWinnerSection)
        {
          cmdList.push({ "c": white, "pl1": second_length });
        }
        cmdList.push({ "c": red, "pl1": second_length, "v": true });

        cmdList.push({ "c": black, "pl1": third_length });
        cmdList.push({ "c": white, "pl1": third_length });

        if (onWinnerSection)
        {
          cmdList.push({ "c": red, "pl1": third_length });
        }
        cmdList.push({ "c": black, "pl1": third_length });

        if (onWinnerSection)
        {
          cmdList.push({ "c": white, "pl1": third_length });
        }
        cmdList.push({ "c": red, "pl1": third_length });

        // Commands for winning section
        // $$$ test this with index.
        if (onWinnerSection)
        {
          cmdList.push({ "pif": "w", "c": black, "pl1": fourth_length });
          cmdList.push({ "c": white, "pl1": fourth_length });
          cmdList.push({ "pif": "w", "c": red, "pl1": fourth_length });
          cmdList.push({ "c": black, "pl1": fourth_length });
          cmdList.push({ "c": white, "pl1": fourth_length });
          cmdList.push({ "pif": "w", "c": red, "pl1": fourth_length, "v": true });

          // push winning command to winner inside of winning section.
          cmdList.push({ "pif": "w", "pt": "win", "c": "216,19,37", "pl1": 60000 });
        }       

        // Add this set of commands to the overall list
        cmds.push({ "id": logicalCol - 1, "commandList": cmdList.slice(0) });

        // clear out commands.
        cmdList = [];

        logicalCol++;
      }

      // $$$ move some or all of this to the server

      var show = new Shows({
        _eventId: $scope.currentEvent._id,
        type: $scope.currentShowType,
        _winnerId: $scope.winner._id,
        winnerSections: $scope.winnerSection,
        winner_url: $scope.contesturl ? $scope.contesturl : null
      });

      $scope.currentShow = show;

      // First, save the Show.
      show.$save(function (response)
      {
        console.log(response);

        if (response._id)
        {
          var showCommands = new ShowCommands({
            _showId: response._id,
            commands: cmds,
            type: $scope.currentShowType
          });

          // Second, save the ShowCommands.
          showCommands.$save(function (response)
          {
            console.log(response);

            if (response._id)
            {
              // Lastly, save the ShowCommandId on the Show.
              show._showCommandId = response._id;
              show.$update();
            }
          });
        }
      });

      // $$$ what do we do once the Show and Event are over?  Need to store winners\events\etc?
// $$$ display winning section\seat to Admin.
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
// $$$ Update with new names, show, not liteshow.
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

    $scope.startShow = function (seconds)
    {
      if ($scope.userLocations.length < 1)
      {
        alert("Sorry, not enough users have joined this event. Cancelling show.");
        return;
      }

      // stop checking for any new users:
      if ($scope.userCheckPromise != null)
      {
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

      // Set the start time. Already have a winner.
      $scope.currentShow.$update();

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
        $scope.winnerSection = [];
    }
    
    $scope.$on('$locationChangeStart', function() {
      $timeout.cancel($scope.promise_clock);
    });
    
    
  }]);

