'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$timeout', '$interval', 'Clients', 'Events', 'Shows', 'UserLocations', 'ShowCommands', 'LogicalLayout',
function ($rootScope, $scope, $timeout, $interval, Clients, Events, Shows, UserLocations, ShowCommands, LogicalLayout)
{
  $rootScope.currentArea = "main";
  $scope.showStartTime = null;
  $scope.stopTime = null;
  $scope.winnerSeat = "";
  $scope.winnerSection = [];
  $scope.winner = null;
  $scope.winningSectionCounter = 0;
  $scope.activeUsers = 0;
  $scope.iPhoneUsers = 0;
  $scope.androidUsers = 0;
  $scope.stadiumCoverage = 0;
  $scope.stadiumSize = 10000;
  $scope.userCheckPromise = null;
  $scope.userPollTime = 5000;
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

  $scope.getRandomNumber = function (userCount)
  {
    return Math.floor(Math.random() * userCount);
  }

  $scope.loadLayouts = function ()
  {
    if (!$scope.currentEvent || !$scope.currentEvent._logicalLayoutId)
    {
      alert("Please select an Event");
      return;
    }

    LogicalLayout.query({ eventId: $scope.currentEvent._id, logicallayoutId: $scope.currentEvent._logicalLayoutId }, function (layout)
    {
        $scope.currentLayout = layout;
        $scope.createShow();
    });
  }

  $scope.findWinner = function ()
  {
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
      $scope.winner = $scope.userLocations[0];
    }

    $scope.winningSectionCounter = 0;
    var counter = 0;
    do
    {
      if ($scope.userLocations[counter].userSeat.section == $scope.winner.userSeat.section)
      {
        $scope.winningSectionCounter++;
      }
      counter++;
    } while (counter < userCount)

    $scope.winnerSection.push($scope.winner.userSeat.section);
  }

  $scope.createShow = function ()
  {
    /*if ($scope.lengthOfShow < 15)
    {
      alert("Sorry, the Show must run for at least 15 seconds.");
      return;
    }*/

    if (!$scope.currentEvent)
    {
      alert("Please select an Event");
      return;
    }

    if (!$scope.currentLayout.columns || !$scope.currentLayout.columns.length)
    {
      console.log("CurrentLayout.columns is null. $scope.currentLayout:" + $scope.currentLayout);
      if ($scope.currentLayout.logicalLayout.columns)
      {
        console.log("Should be updating CurrentLayout.columns.");
        $scope.currentLayout.columns = $scope.currentLayout.logicalLayout.columns;
        $scope.currentLayout.logicalLayout.columns = null;
        $scope.currentLayout.$update();
      }
      else
      {
        alert("Current Event has no logical columns. Please create an Event with logical columns.");
        return;
      }
    }

    if (!$scope.userLocations || $scope.userLocations.length < 1)
    {
      alert("Sorry, not enough users have joined this event. Cancelling show.");
      return;
    }

    $scope.resetWinners();

    $scope.findWinner();

    var black = "0,0,0";
    var red = "216,19,37";
    var white = "162,157,176";

    // for each logical column, create commands
    // NOTE:this is simple logic. Need to account for logical rows and seats.  22
    var logicalCol = 1;
    var columnLength = $scope.currentLayout.columns.length;
    var currentSection;
    var cmdList = [];
    var cmds = [];
    var onWinnerSection = false;
    var randomDelay;

    // TODO: remove the hardcoding of subtracting 6 seconds for the contest. If this was a litewave only, don't subtract.
    // See later TODO about putting command creation in a loop for more easily setting the # of commands.
    var first_length = Math.ceil((($scope.lengthOfShow - 6) * 1000) / columnLength);  //  first was 350 ms
    if (first_length < 350)
    {
      first_length = 350;
    }

    var second_length = 250;  // 250 ms
    var third_length = 250;  // 250 ms
    var fourth_length = 250;  // 250 ms
    var firstColLengthMS = columnLength * first_length;  // 11sec
    var secondColLengthMS = columnLength * second_length;  // 5.5sec

    while (logicalCol <= columnLength)
    {
      currentSection = $scope.currentLayout.columns[logicalCol - 1].sectionList;

      // TODO Need to handle multiple winning sections with a loop.
      onWinnerSection = (currentSection.indexOf($scope.winnerSection.toString()) > -1);

      // Wave 1.
      if (logicalCol > 1)
      {
        // first section doesn't need to wait.
        cmdList.push({ "ct": "w", "cl": first_length * (logicalCol - 1) });
      }
      cmdList.push({ "bg": red, "cl": first_length, "sv": true });             // display 500 ms and vibrate
      cmdList.push({ "ct": "w", "cl": firstColLengthMS - (first_length * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec

      // Wave 2.
      if (logicalCol > 1)
      {
        // first section doesn't need to wait.
        cmdList.push({ "ct": "w", "cl": second_length * (logicalCol - 1) });
      }
      cmdList.push({ "bg": red, "cl": second_length, "sv": true }); // display and vibrate.
      cmdList.push({ "ct": "w", "cl": secondColLengthMS - (second_length * logicalCol) }); // pause 21.750 seconds, 21.5. 21.25, 21

      // Common Contest Commands
      // Generate random delay time between 0 and 100 ms for each logical column.
      // NOTE: must be small to prevent winning phone to go off too soon.
      // TODO: put in a loop of X number so we easily know how many commands we are adding.
      randomDelay = $scope.getRandomNumber(100);
      cmdList.push({ "ct": "w", "cl": randomDelay });  // wait X ms, max delay 250ms        
      cmdList.push({ "bg": black, "cl": first_length });
      cmdList.push({ "bg": white, "cl": first_length });
      cmdList.push({ "bg": red, "cl": first_length });
      cmdList.push({ "bg": black, "cl": first_length });
      cmdList.push({ "bg": white, "cl": first_length });
      cmdList.push({ "bg": red, "cl": first_length, "sv": true });

      cmdList.push({ "bg": black, "cl": second_length });
      cmdList.push({ "bg": white, "cl": second_length });

      // Take out a few commands from non-winner sections
      if (onWinnerSection)
      {
        cmdList.push({ "bg": red, "cl": second_length });
      }
      cmdList.push({ "bg": black, "cl": second_length });

      if (onWinnerSection)
      {
        cmdList.push({ "bg": white, "cl": second_length });
      }
      cmdList.push({ "bg": red, "cl": second_length, "sv": true });

      cmdList.push({ "bg": black, "cl": second_length });
      cmdList.push({ "bg": white, "cl": second_length });

      if (onWinnerSection)
      {
        cmdList.push({ "bg": red, "cl": second_length });
      }
      cmdList.push({ "bg": black, "cl": second_length });

      if (onWinnerSection)
      {
        cmdList.push({ "bg": white, "cl": second_length });
      }
      cmdList.push({ "bg": red, "cl": second_length });

      // Commands for winning section
      if (onWinnerSection)
      {
        cmdList.push({ "pif": "w", "bg": black, "cl": second_length });
        cmdList.push({ "bg": white, "cl": second_length });
        cmdList.push({ "pif": "w", "bg": red, "cl": second_length });
        cmdList.push({ "bg": black, "cl": second_length });
        cmdList.push({ "bg": white, "cl": second_length });
        cmdList.push({ "pif": "w", "bg": red, "cl": second_length, "sv": true });

        // push winning command to winner inside of winning section.
        cmdList.push({ "pif": "w", "ct": "win", "bg": red, "cl": second_length });
        cmdList.push({ "pif": "w", "bg": black, "cl": second_length, "sv": true });
        cmdList.push({ "pif": "w", "bg": white, "cl": second_length });
        cmdList.push({ "pif": "w", "bg": red, "cl": second_length, "sv": true });
        cmdList.push({ "pif": "w", "bg": black, "cl": second_length });
        cmdList.push({ "pif": "w", "bg": white, "cl": second_length });
      }

      // Add this set of commands to the overall list
      cmds.push({ "id": logicalCol - 1, "commandList": cmdList.slice(0) });

      // clear out commands.
      cmdList = [];

      logicalCol++;
    }

    $scope.cmds = cmds;

    // TODO move some or all of this to the server

    var show = new Shows({
      _eventId: $scope.currentEvent._id,
      _winnerId: null,
      type: $scope.currentShowType,      
      startAt: null,
      winnerSections: $scope.winnerSection,
      winnerImageUrl: !!($scope.currentShow.winnerImageUrl) ? $scope.currentShow.winnerImageUrl.trim() : null,
      winnerUrl: !!($scope.currentShow.winnerUrl) ? $scope.currentShow.winnerUrl.trim() : null
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
        showCommands.$save(function (response2)
        {
          console.log(response2);

          if (response2._id)
          {
            // Lastly, save the ShowCommandId on the Show.
            show._showCommandId = response2._id;
            show.$update();

            //alert("Show successfully created.");
          }
        });
      }
    });

    // Display winner to Admin so they can prepare cameras.
    $scope.winnerSeat = $scope.formatWinnerString();
  };

  $scope.executeCmdA = function(logicalCol, cmd)
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
      UserLocations.query({ eventId: $scope.currentEvent._id }, function (userLocations)
      {
        $scope.userLocations = userLocations;
        $scope.activeUsers = userLocations.length;
        $scope.stadiumCoverage = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
        $scope.iPhoneUsers = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
      });
    }
  }

  if ($scope.userCheckPromise == null)
  {
    $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
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
      $scope.cleanUpAfterShow();
      Shows.query({ eventId: newVal._id }, function (show)
      {
        if (show && show.length)
        {
          $scope.liteshows = show;
          $scope.currentShow = show[show.length - 1];

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
    if ($scope.userLocations == null || $scope.userLocations.length < 1)
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

    if (!$scope.winner)
    {
      $scope.findWinner();
    }

    $timeout($scope.showIsOver, 100);

    var now = new Date();
    var startTime = Math.floor(now.getTime() + (1000 * seconds));
    var stopTime = Math.floor(startTime + (1000 * $scope.lengthOfShow));

    // Set showStartTime for UI. Different format than just getting Date.now()
    var startTimeDate = new Date(startTime);
    var stopTimeDate = new Date(stopTime);
    $scope.currentShow.startAt = $scope.showStartTime = startTimeDate.toUTCString();
    $scope.showStartTimeDisplay = startTimeDate.toLocaleTimeString();
    $scope.stopTime = stopTimeDate.toUTCString();
    $scope.showStopTimeDisplay = stopTimeDate.toLocaleTimeString();

    console.log($scope.currentShow.startAt);
    console.log($scope.stopTime);

    // Set the start time. Already have a winner.
    $scope.currentShow.$update();

    $scope.percentTimeToStart = 0;
    $scope.updateTime = seconds * 10;
    $scope.updateClock();
  };

  $scope.updateClock = function ()
  {
    var currDate = new Date(Date.now());
    $scope.current_time = currDate.toUTCString();
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
    // stupid. Need to add string.format
    //return "Section " + $scope.winner.userSeat.section + ", Row " + $scope.winner.userSeat.row + ", Seat " + $scope.winner.userSeat.seat;
    return $scope.winner.userSeat.section;
  }

  $scope.showIsOver = function ()
  {
    if ($scope.winner == null)
    {
      alert("Sorry!  Couldn't pick a winning seat. Please pick a random seat.");
      return;
    }

    if (!$scope.winnerSeat)
    {
      $scope.winnerSeat = $scope.formatWinnerString();
    }
  };

  $scope.cleanUpAfterShow = function ()
  {
    $scope.percentTimeToStart = 0;
    $scope.winnerSeat = "";
    $scope.winner = null;
    $scope.winnerSection = [];
  }

  $scope.$on('$locationChangeStart', function ()
  {
    $timeout.cancel($scope.promise_clock);
  });

}]);