'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$timeout', '$interval', 'Clients', 'Events', 'Shows', 'UserLocationsCount', 'UserLocationsWinner', 'ShowCommands', 'LogicalLayout',
function ($rootScope, $scope, $timeout, $interval, Clients, Events, Shows, UserLocationsCount, UserLocationsWinner, ShowCommands, LogicalLayout)
{
  $rootScope.currentArea = "main";
  $scope.currentEvent;
  $scope.showStartTime = null;
  $scope.stopTime = null;
  $scope.winnerSeat = "";
  $scope.winnerSection = [];
  $scope.winner = null;
  $scope.activeUsers = 0;
  $scope.iPhoneUsers = 0;
  $scope.androidUsers = 0;
  $scope.stadiumCoverage = 0;
  $scope.stadiumSize = 19145;
  $scope.userCheckPromise = null;
  $scope.userPollTime = 5000;
  $scope.checkForWinnerPromise = null;
  $scope.checkForWinnerPollTime = 3000;
  $scope.currentShow;
  $scope.currentShowType = 0;
  $scope.currentLayout;
  $scope.lengthOfShow = 15;

  Clients.query({}, function (clients)
  {
    $rootScope.clients = clients;
    $rootScope.currentClient = clients[0];
    $rootScope.setClient($rootScope.currentClient);
  });

  $scope.setShowType = function (type)
  {
    $scope.currentShowType = type;
  };

  // called by Create Show button to load a layout.
  $scope.createShow = function ()
  {
    if (!$scope.currentEvent || !$scope.currentEvent._logicalLayoutId)
    {
      alert("Please select an Event");
      return;
    }

    $scope.resetWinners();

    // Create the default show object with the data that we currently have. 
    var show = new Shows({
          _eventId: $scope.currentEvent._id,
          _winnerId: null,
          length: $scope.lengthOfShow,
          type: $scope.currentShowType,
          startShowOffset: 0,
          startAt: null,
          winnerSections: null,
          winnerImageUrl: !!($scope.currentShow.winnerImageUrl) ? $scope.currentShow.winnerImageUrl.trim() : null,
          winnerUrl: !!($scope.currentShow.winnerUrl) ? $scope.currentShow.winnerUrl.trim() : null
    });

    // Now save the Show. Everything else we need (except startAt) will get set server side.
    show.$save(function (response)
    {
      console.log(response);
      if (response._id)
      {
        // Update the current show with the updated show.
        $scope.currentShow = show;

        // Fetch the winning section.
        //$scope.winnerSection = show.winnerSections;

        // Display winner to Admin so they can prepare cameras.
        //$scope.winnerSeat = $scope.formatWinnerString() + "(Seat Info):" + show.winnerSeat;

        ShowCommands.query({ showId: show._id, showCommandId: show._showCommandId }, function (commands)
        {
          $scope.cmds = commands;
        });

        //alert("Show successfully created.");
      }
    });
  };

  $scope.executeCmdA = function(logicalCol, cmd)
  {
    if (!cmd.length)
    {
      return;
    }

    var black = "0,0,0";
    var red = "255,0,0";  // "216,19,37";
    var white = "162,157,176";
    var grey = "222,218,213";
    var col = "#lcol" + logicalCol.toString();
    var currentCmd = cmd[0];
    //console.log('{0}', currentCmd);
    if (currentCmd.bg)
    {
      if (currentCmd.bg == black)
      {
        $(col).css("background", "black");
      }
      else if (currentCmd.bg == red)
      {
        $(col).css("background", "red");
      }
      else if (currentCmd.bg == grey)
      {
        $(col).css("background", "grey");
      }
      else
      {
        $(col).css("background", "white");
      }      
    }
    else if (currentCmd.ct)
    {
      $(col).css("background", "transparent");
    }
    else
    {
      $(col).css("background", "transparent");
    }
    $timeout(function () { $scope.executeCmdB(logicalCol, cmd.slice(1)) }, currentCmd.cl);
  }

  $scope.executeCmdB = function (logicalCol, cmd)
  {
    if (!cmd.length)
    {
      return;
    }

    var black = "0,0,0";
    var red = "216,19,37";
    var white = "162,157,176";
    var col = "#lcol" + logicalCol.toString();
    var currentCmd = cmd[0];
    //console.log('{0}', currentCmd);
    if (currentCmd.bg)
    {
      if (currentCmd.bg == black)
      {
        $(col).css("background", "black");
      }
      else if (currentCmd.bg == red)
      {
        $(col).css("background", "red");
      }
      else
      {
        $(col).css("background", "white");
      }
    }
    else if (currentCmd.ct)
    {
      $(col).css("background", "transparent");
    }
    else
    {
      $(col).css("background", "transparent");
    }
    $timeout(function () { $scope.executeCmdB(logicalCol, cmd.slice(1)) }, currentCmd.cl);
  }

  $scope.testCommands = function ()
  {
    if ($scope.currentShow == null)
    {
      alert("No Shows detected. Please create a show.");
      return;
    }

    ShowCommands.query({ showId: $scope.currentShow._id, showCommandId: $scope.currentShow._showCommandId }, function (showCommands)
    {
      if (showCommands == null || showCommands.commands == null)
      {
        alert("No Show Commands detected. Please create a show.");
        return;
      }

      // Make a copy of the Show's commands because we remove them one by one.
      var testCmds = showCommands.commands;
      var cmdsLength = testCmds.length;
      var cmdsIndex = 0;
      var col;
      while (cmdsIndex < cmdsLength)
      {
        col = "#lcol" + cmdsIndex.toString();
        $(col).css("background", "transparent");
        $scope.executeCmdA(cmdsIndex, testCmds[cmdsIndex].commandList);
        cmdsIndex++;
      }
    });
  }

  $scope.changeEvent = function (event)
  {
    $scope.currentEvent = event;
  };

  $scope.deleteEvent = function ()
  {
    if ($scope.currentEvent)
    {
      $scope.currentEvent.$delete();

      alert("Event successfully deleted.");
    }
  };

  // check for new users every second.
  $scope.checkUsers = function ()
  {
    if ($scope.currentEvent)
    {
      UserLocationsCount.query({ eventId: $scope.currentEvent._id }, function (countData)
      {
        if (countData && countData.length)
        {
          $scope.activeUsers = countData[0].usercount;
          $scope.stadiumCoverage = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
          $scope.iPhoneUsers = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
        }
      });
    }
  }

  if ($scope.userCheckPromise == null)
  {
    $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
  }

  // check for new users every second.
  $scope.checkForWinner = function ()
  {
    if ($scope.currentShow)
    {
      //Shows.query({ eventId: $scope.currentEvent._id, showId: $scope.currentShow._id }, function (show)
      Shows.query({ eventId: $scope.currentEvent._id }, function (show)
      {
        if (show && show.length)
        {
          var showLength = show.length;
          var index = 0;
          var matchingShow;
          while (index < showLength)
          {
            if (show[index]._id == $scope.currentShow._id)
            {
              matchingShow = show[index];
              break;
            }
            index++;
          }

          if (matchingShow._winnerId)
          {
            // Display the winning section.
            $scope.winnerSection = matchingShow.winnerSections;
            $scope.winnerSeat = "(Seat Info):" + matchingShow.winnerSeat;

            // Stop polling for winner.
            if ($scope.checkForWinnerPromise != null)
            {
              $interval.cancel($scope.checkForWinnerPromise);
              $scope.checkForWinnerPromise = null;
            }
          }
        }
      });
    }
  }

  // update list of events when the client changes
  $scope.$watch('currentClient', function (newVal, oldVal)
  {
    if (newVal)
    {
      Events.query({ clientId: newVal._id }, function (events)
      {
        if (events && events.length)
        {
          $scope.events = events;
          $scope.liteshows = null;
          $scope.currentEvent = events[0];
        }
      });
    }
  });

  // update list of lite_shows when the event changes
  $scope.$watch('currentEvent', function (newVal, oldVal)
  {
    if (newVal)
    {
      if ($scope.userCheckPromise == null)
      {
        $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
      }

      $scope.cleanUpAfterShow();
      Shows.query({ eventId: newVal._id }, function (show)
      {
        if (show && show.length)
        {
          $scope.liteshows = show;
          //$scope.currentShow = show[show.length - 1];

          // Start checking for new users
          if ($scope.userCheckPromise == null)
          {
            $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
          }
        }
      });
    }
  });

  $scope.resetWinners = function ()
  {
    $scope.winnerSeat = "";
    $scope.winner = null;
    $scope.winnerSection = [];
  }

  $scope.startShow = function (seconds)
  {
    if ($scope.activeUsers == null || $scope.activeUsers < 1)
    {
      alert("Sorry, not enough users have joined this event. Cancelling show.");
      return;
    }

    // stop checking for any new users:
    /*if ($scope.userCheckPromise != null)
    {
      $interval.cancel($scope.userCheckPromise);
      $scope.userCheckPromise = null;
    }*/

    if ($scope.checkForWinnerPromise == null)
    {
      $scope.checkForWinnerPromise = $interval($scope.checkForWinner, $scope.checkForWinnerPollTime);
    }

    $timeout.cancel($scope.promise_clock);

    // $timeout($scope.showIsOver, 100);

    // Set the start offset. The API will figure out the start time based on server time.
    $scope.currentShow.startShowOffset = seconds;
    $scope.currentShow.$update();

    var now = new Date();
    var startTime = Math.floor(now.getTime() + (1000 * seconds));
    var stopTime = Math.floor(startTime + (1000 * $scope.lengthOfShow));

    // Set showStartTime for UI. Different format than just getting Date.now()
    var startTimeDate = new Date(startTime);
    var stopTimeDate = new Date(stopTime);
    
    $scope.showStartTime = startTimeDate.toISOString();
    $scope.showStartTimeDisplay = startTimeDate.toLocaleTimeString();
    $scope.stopTime = stopTimeDate.toUTCString();
    $scope.showStopTimeDisplay = stopTimeDate.toLocaleTimeString();

    console.log($scope.currentShow.startAt);
    console.log($scope.stopTime);

    $scope.percentTimeToStart = 0;
    $scope.updateTime = seconds * 10;
    $scope.updateClock();
  };

  $scope.updateClock = function ()
  {
    var currDate = new Date(Date.now());
    $scope.current_time = currDate.toISOString();
    $scope.currentTimeDisplay = currDate.toLocaleTimeString();

    console.log('UpdateCLock: current time = ' + $scope.current_time.toString() + '. showStartTime' + $scope.showStartTimeDisplay.toString());

    if ($scope.current_time < $scope.showStartTime)
    {
      $scope.promise_clock = $timeout($scope.updateClock,$scope.updateTime);
    }
    else
    {
      $timeout($scope.updateShowClock, 100);
      $timeout($scope.testCommands, 100);      
    }
  };

  $scope.updateShowClock = function ()
  {
    var currDate = new Date(Date.now());
    $scope.current_time = currDate.toUTCString();
    $scope.currentTimeDisplay = currDate.toLocaleTimeString();

    // TODO figure out what to add by deviding length of show by 100?
    //$scope.percentTimeToStart += 6.66;

    console.log('UpdateShowCLock: current time = ' + $scope.current_time.toString() + ' . startAt time = ' + $scope.stopTime.toString());

    if ($scope.current_time < $scope.stopTime)
    {
      $scope.promise_clock = $timeout($scope.updateShowClock, 1000);
    }
    else
    {
      //$timeout($scope.showIsOver, 100);
    }
  };

  $scope.formatWinnerString = function ()
  {
    return $scope.winnerSection[0];
  }

  $scope.showIsOver = function ()
  {
    // TODO Query new UJ method to find winner?
    /*if ($scope.winner == null)
    {
      alert("Sorry!  Couldn't pick a winning seat. Please pick a random seat.");
      return;
    }*/

    if (!$scope.winnerSeat)
    {
      $scope.winnerSeat = $scope.formatWinnerString();
    }
  };

  $scope.cleanUpAfterShow = function ()
  {
    $scope.percentTimeToStart = 0;
    $scope.resetWinners();
  }

  $scope.$on('$locationChangeStart', function ()
  {
    $timeout.cancel($scope.promise_clock);
  });

}]);