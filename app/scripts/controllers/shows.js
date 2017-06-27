'use strict';
var app = angular.module('liteWaveApp');
angular.module('liteWaveApp').controller('ShowsController',
        ['$rootScope', '$scope', '$timeout', '$routeParams', 'Clients', 'Stadiums', 'LogicalLayout2', 'Shows2',
  function ($rootScope, $scope, $timeout, $routeParams, Clients, Stadiums, LogicalLayout2, Shows2)
  {
    $rootScope.currentArea = "shows";
    $scope.currentLayout;
    $scope.cmds = [];
    $scope.existingLayout = false;
    $scope.currentShowType = 0;
    $scope.currentSections;
    $scope.currentGroupNumber = 0;
    $scope.myData = [];
    $scope.lengthOfShow = 15;
    $scope.currentShowType = 1;
    $scope.defaultStyle = "stroke: black; stroke-width: 1px; fill-opacity: 0;";
    $scope.selectedStyle = "stroke: red; stroke-width: 5px; fill-opacity: 0;";
    $scope.showStyle = "stroke: yellow; stroke-width: 15px; fill-opacity: 0;";
    $scope.gridGroupOptions = {
                              data: 'myData',
                              multiSelect: false,
                              enableCellSelection: true,
                              enableRowSelection: true,
                              enableCellEditOnFocus: true,
                              columnDefs: [
                              { field: 'id', displayName: 'Group' },
                              { field: 'sectionList', displayName: 'Sections' },
                              { field: 'bg', displayName: 'Active Color' },
                              { field: 'cl', displayName: 'Active Color Length' },
                              { field: 'sv', displayName: 'Vibrate Phone', cellTemplate: '<input type="checkbox" ng-model="row.entity.sv" ng-click="toggle(row.entity.name,row.entity.sv)">', enableCellEdit: false }
                              ]
    };

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      if (!$rootScope.currentClient)
      {
        $rootScope.setClient(clients[0]);
      }
    });

    $scope.setShowType = function (type)
    {
      $scope.currentShowType = type;
    };

    /*$scope.setWaveCommands = function (logicalCol, cmdList, individualWaveLength, totalWaveLength)
    {
      if (logicalCol > 1)
      {
        // first section doesn't need to wait.
        cmdList.push({ "ct": "w", "cl": msLength2 * (logicalCol - 1) });
      }
      cmdList.push({ "bg": red, "cl": msLength2, "sv": true });             // display 500 ms and vibrate
      cmdList.push({ "ct": "w", "cl": msWave2 - (msLength2 * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec
    }*/

    $scope.addColorCommand = function (cmdList, commandValue, commandLength, shouldVibrate, playIfWinner)
    {
      // cmdList.push({ "bg": red, "cl": msMinimumLength, "sv": true });
      // cmdList.push({ "ct": "w", "cl": msWaveLength }); // pause 21.5 seconds, 21 sec, 20.5 sec
      // cmdList.push({ "pif": "w", "bg": red, "cl": msMinimumLength, "sv": true });

      var cmd = { "bg": commandValue, "cl": commandLength };
      if (shouldVibrate)
      {
        cmd.sv = true;
      }

      if (playIfWinner)
      {
        cmd.pif = "w";
      }

      cmdList.push(cmd);

      return cmdList;     
    }

    $scope.addWaitCommand = function (cmdList, commandValue, commandLength, playIfWinner)
    {
      // cmdList.push({ "bg": red, "cl": msMinimumLength, "sv": true });
      // cmdList.push({ "ct": "w", "cl": msWaveLength }); // pause 21.5 seconds, 21 sec, 20.5 sec
      // cmdList.push({ "pif": "w", "bg": red, "cl": msMinimumLength, "sv": true });

      var cmd = { "w": commandValue, "cl": commandLength };

      if (playIfWinner)
      {
        cmd.pif = "w";
      }

      cmdList.push(cmd);

      return cmdList;     
    }

    $scope.testLayout = function ()
    {
      // UI testing only.
      var columnLength = $scope.myData.length;
      var msShowLength = $scope.lengthOfShow * 1000;
      $scope.cmds = [];
      var winningSection = "222";

      // for each logical column, create commands
      var logicalCol = 1;
      var currentSection;
      var cmdList = [];      
      var onWinnerSection = false;
      var randomDelay;

      // See later TODO about putting command creation in a loop for more easily setting the # of commands.
      var minimumNumberOfWave = 2;
      var minimumNumberContestLegs = 3;
      var minimumNumberOfCommandsPerContestLeg = 4;
      var minimumNumberOfCommands = minimumNumberContestLegs * minimumNumberOfCommandsPerContestLeg;
      var maximumNumberOfCommandsToAddByTime = 12;
      var msMinimumLength = 250;
      var msBetweenWaves = 50;
      var msDelayTime = 100;

      var msLength1 = msMinimumLength;
      var msLength2 = msMinimumLength + msBetweenWaves;
      var msLength3 = msMinimumLength + (msBetweenWaves * 2);
      var msLength4 = msMinimumLength + (msBetweenWaves * 3);
      var msLength5 = msMinimumLength + (msBetweenWaves * 4);

      var msWave1 = msLength1 * columnLength;
      var msWave2 = msLength2 * columnLength;
      var msWave3 = msLength3 * columnLength;
      var msWave4 = msLength4 * columnLength;
      var msWave5 = msLength5 * columnLength;

      // Minimum number of waves is 2.
      var ms2WaveLength = msWave1 + msWave2;
      var ms3WaveLength = ms2WaveLength + msWave3;
      var ms4WaveLength = ms3WaveLength + msWave4;
      var ms5WaveLength = ms4WaveLength + msWave5;
      var numberOfWaves = minimumNumberOfWave;  // Minimum 2
      var numberOfCommands = minimumNumberOfCommands; // Minimum 12, 4 per leg.
      var numberOfCommandsPerLeg = numberOfCommands / minimumNumberContestLegs;
      var msLeftOverTime = 0;
      // How can we make this more dynamic without updating code?  Add our defaults to settings and rename things +1cmd, +2cmd, etc.
      var msMinimumContestLength = minimumNumberOfCommands * msMinimumLength + msDelayTime;
      var showType = $scope.currentShowType;
      var msRemainderForEachWaveAndColumn = 0;
      var extraCommands = 0;

      /* testing cmdList.push({ "bg": red, "cl": msMinimumLength, "sv": true });
      cmdList.push({ "ct": "w", "cl": msMinimumLength });
      cmdList.push({ "pif": "w", "bg": black, "cl": msMinimumLength });

      cmdList = $scope.addCommand(cmdList, "bg", black, msMinimumLength, true, true)
      cmdList = $scope.addCommand(cmdList, "ct", "w", msMinimumLength, false, true)
      cmdList = $scope.addCommand(cmdList, "bg", black, msMinimumLength, true, true)
      return;*/

      if (showType === 0)
      {
        // Show
        // Calculate everyting here.

        // Default wave
        msLeftOverTime = msShowLength - ms2WaveLength;

        if (msShowLength >= ms5WaveLength)
        {
          numberOfWaves = 5;
          msLeftOverTime = msShowLength - ms5WaveLength;
        }
        else if (msShowLength >= ms4WaveLength)
        {
          numberOfWaves = 4;
          msLeftOverTime = msShowLength - ms4WaveLength;
        }
        else if (msShowLength >= ms3WaveLength)
        {
          numberOfWaves = 3;
          msLeftOverTime = msShowLength - ms3WaveLength;
        }
      }
      else if (showType === 1)
      {
        // Show + contest
        // Need to have a balance between waves and commands.  Need at least 2 waves and 4 commands, but shoot for more commands.

        // First calculate how many waves we can safely have.        
        var msLeftOverTime = 0;
        var msTempWaveLength = 0;
        if (msShowLength >= ms5WaveLength + msMinimumContestLength)
        {
          numberOfWaves = 5;
          msTempWaveLength = ms5WaveLength;
          msLeftOverTime = msShowLength - ms5WaveLength;
        }
        else if (msShowLength >= ms4WaveLength + msMinimumContestLength)
        {
          numberOfWaves = 4;
          msTempWaveLength = ms4WaveLength;
          msLeftOverTime = msShowLength - ms4WaveLength;
        }
        else if (msShowLength >= ms3WaveLength + msMinimumContestLength)
        {
          numberOfWaves = 3;
          msTempWaveLength = ms3WaveLength;
          msLeftOverTime = msShowLength - ms3WaveLength;
        }
        else if (msShowLength >= ms2WaveLength + msMinimumContestLength)
        {
          numberOfWaves = 2;
          msTempWaveLength = ms2WaveLength;
          msLeftOverTime = msShowLength - ms2WaveLength;
        }

        msLeftOverTime = msLeftOverTime - msMinimumContestLength;

        // Need fudge factor for shows that just don't work...within reason.  5 second show, no.
        if (msLeftOverTime < 0 && msLeftOverTime < -1000)
        {
          alert("Sorry, that show length is too short for a LiteWave + Contest.");
          return;
        }
        else if (msLeftOverTime < 0 && msLeftOverTime >= -1000)
        {
          // Don't do anything but set our left over time to 0 so we run the show a little long.
          // Number of commands will be 4.
          msLeftOverTime = 0;
        }
        else
        {
          var msNewContestLength = 0;
          var msTempLeftOverTime = msLeftOverTime;
          // Have to add 1 command per leg or 3 total.
          var i = 3;
          var commandsToAdd = 0;
          while (msTempLeftOverTime > 0 && i <= maximumNumberOfCommandsToAddByTime)
          {
            msNewContestLength = (minimumNumberOfCommands + i) * msMinimumLength + msDelayTime;
            msTempLeftOverTime = msShowLength - msTempWaveLength - msNewContestLength;

            if (msTempLeftOverTime > 0)
            {
              // Save the time that worked.
              msLeftOverTime = msTempLeftOverTime;
              commandsToAdd = i;
            }

            i = i + 3;
          }

          numberOfCommands += commandsToAdd;
          numberOfCommandsPerLeg = numberOfCommands / minimumNumberContestLegs;
        }
      }
      else if (showType === 2)
      {
        // Pick a winning section. No LW. Just a contest?
      }
      else if (showType === 3)
      {
        // Pick a winning section. No LW, Just a contest?
      }
      else if (showType === 4)
      {
        // Contest
        msLeftOverTime = msShowLength - msMinimumContestLength;

        var msNewContestLength = 0;
        var msTempLeftOverTime = msLeftOverTime;
        // Have to add 1 command per leg or 3 total.
        var i = 3;
        var commandsToAdd = 0;
        while (msTempLeftOverTime > 0 && i <= maximumNumberOfCommandsToAddByTime)
        {
          msNewContestLength = (minimumNumberOfCommands + i) * msMinimumLength + msDelayTime;
          msTempLeftOverTime = msShowLength - msNewContestLength;

          if (msTempLeftOverTime > 0)
          {
            // Save the time that worked.
            msLeftOverTime = msTempLeftOverTime;
            commandsToAdd = i;
          }

          i = i + 3;
        }

        numberOfCommands += commandsToAdd;
        numberOfCommandsPerLeg = numberOfCommands / minimumNumberContestLegs;
      }
      else if (showType === 5)
      {
        // Custom
        // Hmm.
        // msLeftOverTime = msShowLength - msMinimumContestLength;
      }

      if (msLeftOverTime < 0)
      {
        alert("error condition");
        return;
      }

      // If a LiteShow.
      if (showType === 0)
      {
        // If we have left over time, divide it amounst all the columns and waves and add it to each wave.
        if (msLeftOverTime > 0)
        {
          msRemainderForEachWaveAndColumn = Math.floor(msLeftOverTime / (columnLength * numberOfWaves));

          // Set this to 0 as we don't want to add any extra commands.
          msLeftOverTime = 0;
        }
      }

      // If a LW + contest or contest, see if we can add more commands.
      if (showType === 1 || showType === 4)
      {
        // If we have left over time, divide it amounst all the columns to see how many more commands we can add.
        if (msLeftOverTime > 0)
        {
          extraCommands = Math.floor(msLeftOverTime / columnLength / msMinimumLength);

          // Set this to 0 as we don't want to add any extra commands.
          msLeftOverTime = 0;
        }
      }

      // var red = "216,19,37"; for Portland
      var primaryColor;
      var firstColor = "0,0,0";  // black
      var secondColor = "162,157,176";  // white

      while (logicalCol <= columnLength)
      {
        // UI testing. Need to read layout value.
        currentSection = $scope.myData[logicalCol - 1].sectionList;
        primaryColor = $scope.myData[logicalCol - 1].bg;

        // If a contest is involved set winner.
        if (showType >= 1)
        {
          // $$$ TODO Need to handle multiple winning sections with a loop.
          // if length > 0
          onWinnerSection = (currentSection.indexOf(winningSection.toString()) > -1);
        }

        // If a LiteShow or LW + Contest
        if (showType === 0 || showType === 1)
        {
          if (numberOfWaves >= 5)
          {
            // Actually starting with wave5 length which is longer.
            var msIndividualLength = msLength5 + msRemainderForEachWaveAndColumn;
            var msWaveLength = msIndividualLength * columnLength;
            if (logicalCol > 1)
            {
              // first section doesn't need to wait.
              cmdList.push({ "ct": "w", "cl": msIndividualLength * (logicalCol - 1) });
            }
            cmdList.push({ "bg": primaryColor, "cl": msIndividualLength, "sv": true });             // display 500 ms and vibrate
            cmdList.push({ "ct": "w", "cl": msWaveLength - (msIndividualLength * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec
          }

          if (numberOfWaves >= 4)
          {
            // Actually starting with wave4 length which is longer.
            var msIndividualLength = msLength4 + msRemainderForEachWaveAndColumn;
            var msWaveLength = msIndividualLength * columnLength;
            if (logicalCol > 1)
            {
              // first section doesn't need to wait.
              cmdList.push({ "ct": "w", "cl": msIndividualLength * (logicalCol - 1) });
            }
            cmdList.push({ "bg": primaryColor, "cl": msIndividualLength, "sv": true });             // display 500 ms and vibrate
            cmdList.push({ "ct": "w", "cl": msWaveLength - (msIndividualLength * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec
          }

          if (numberOfWaves >= 3)
          {
            // Actually starting with wave3 length which is longer.
            var msIndividualLength = msLength3 + msRemainderForEachWaveAndColumn;
            var msWaveLength = msIndividualLength * columnLength;
            if (logicalCol > 1)
            {
              // first section doesn't need to wait.
              cmdList.push({ "ct": "w", "cl": msIndividualLength * (logicalCol - 1) });
            }
            cmdList.push({ "bg": primaryColor, "cl": msIndividualLength, "sv": true });             // display 500 ms and vibrate
            cmdList.push({ "ct": "w", "cl": msWaveLength - (msIndividualLength * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec
          }
          
          // Actually starting with wave2 length which is longer.
          var msIndividualLength = msLength2 + msRemainderForEachWaveAndColumn;
          var msWaveLength = msIndividualLength * columnLength;
          if (logicalCol > 1)
          {
            // first section doesn't need to wait.
            cmdList.push({ "ct": "w", "cl": msIndividualLength * (logicalCol - 1) });
          }
          cmdList.push({ "bg": primaryColor, "cl": msIndividualLength, "sv": true });             // display 500 ms and vibrate
          cmdList.push({ "ct": "w", "cl": msWaveLength - (msIndividualLength * logicalCol) }); // pause 21.5 seconds, 21 sec, 20.5 sec

          // Wave 1.
          msIndividualLength = msLength1 + msRemainderForEachWaveAndColumn;
          msWaveLength = msIndividualLength * columnLength;
          if (logicalCol > 1)
          {
            // first section doesn't need to wait.
            cmdList.push({ "ct": "w", "cl": msIndividualLength * (logicalCol - 1) });
          }
          cmdList.push({ "bg": primaryColor, "cl": msIndividualLength, "sv": true }); // display and vibrate.
          cmdList.push({ "ct": "w", "cl": msWaveLength - (msIndividualLength * logicalCol) }); // pause 21.750 seconds, 21.5. 21.25, 21
        }

        // If a contest.
        if (showType >= 1)
        {
          // =============  Leg 1  =======================
          // Common Contest Commands. 

          // Generate random delay time between 0 and 100 ms for each logical column.
          // NOTE: must be small to prevent winning phone to go off too soon.
          randomDelay = Math.floor(Math.random() * msDelayTime);
          cmdList.push({ "ct": "w", "cl": randomDelay });  // wait X ms, max delay 100ms

          // Add at least 4 commands for minimum time.
          cmdList.push({ "bg": firstColor, "cl": msMinimumLength });
          cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
          cmdList.push({ "bg": primaryColor, "cl": msMinimumLength });
          cmdList.push({ "bg": firstColor, "cl": msMinimumLength });

          if (numberOfCommandsPerLeg >= 5)
          {
            cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
          }

          if (numberOfCommandsPerLeg >= 6)
          {
            cmdList.push({ "bg": primaryColor, "cl": msMinimumLength, "sv": true });
          }

          if (numberOfCommandsPerLeg >= 7)
          {
            cmdList.push({ "bg": firstColor, "cl": msMinimumLength });
          }

          if (numberOfCommandsPerLeg >= 8)
          {
            cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
          }

          // If we are only doing a contest we likely have time left over. Let's add more commands to fill up time.
          if (extraCommands >= 1)
          {
            // Take out a few commands from non-winner sections
            if (onWinnerSection)
            {
              cmdList.push({ "bg": primaryColor, "cl": msMinimumLength });
            }

            // Have winner still display
            cmdList.push({ "bg": firstColor, "cl": msMinimumLength });
          }

          if (extraCommands >= 2)
          {
            if (onWinnerSection)
            {
              cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
            }

            cmdList.push({ "bg": primaryColor, "cl": msMinimumLength, "sv": true });
          }

          if (extraCommands >= 3)
          {
            cmdList.push({ "bg": firstColor, "cl": msMinimumLength });

            msLeftOverTime = msLeftOverTime - msMinimumLength;
          }

          if (extraCommands >= 4)
          {
            cmdList.push({ "bg": secondColor, "cl": msMinimumLength });

            msLeftOverTime = msLeftOverTime - msMinimumLength;
          }

          if (extraCommands >= 5)
          {
            if (onWinnerSection)
            {
              cmdList.push({ "bg": primaryColor, "cl": msMinimumLength });
            }

            cmdList.push({ "bg": firstColor, "cl": msMinimumLength });

            msLeftOverTime = msLeftOverTime - msMinimumLength;
          }

          if (extraCommands >= 6)
          {
            if (onWinnerSection)
            {
              cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
            }

            cmdList.push({ "bg": primaryColor, "cl": msMinimumLength });

            msLeftOverTime = msLeftOverTime - msMinimumLength;
          }

          // =============  Leg 2  =======================
          // Commands for winning section.
          if (onWinnerSection)
          {
            cmdList.push({ "pif": "w", "bg": firstColor, "cl": msMinimumLength });
            cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
            cmdList.push({ "pif": "w", "bg": primaryColor, "cl": msMinimumLength });
            cmdList.push({ "bg": firstColor, "cl": msMinimumLength });

            if (numberOfCommandsPerLeg >= 5)
            {
              cmdList.push({ "bg": secondColor, "cl": msMinimumLength });
            }

            if (numberOfCommandsPerLeg >= 6)
            {
              cmdList.push({ "pif": "w", "bg": primaryColor, "cl": msMinimumLength, "sv": true });
            }

            if (numberOfCommandsPerLeg >= 7)
            {
              cmdList.push({ "pif": "w", "ct": "win", "bg": primaryColor, "cl": msMinimumLength });
            }

            if (numberOfCommandsPerLeg >= 8)
            {
              cmdList.push({ "pif": "w", "bg": firstColor, "cl": msMinimumLength, "sv": true });
            }

            // =============  Leg 3 =======================
            // Default set of commands for winner! Winner always gets these commands, so no need to check numberOfCommandsPerLeg.
            cmdList.push({ "pif": "w", "bg": secondColor, "cl": msMinimumLength });
            cmdList.push({ "pif": "w", "bg": primaryColor, "cl": msMinimumLength, "sv": true });
            cmdList.push({ "pif": "w", "bg": firstColor, "cl": msMinimumLength });
            cmdList.push({ "pif": "w", "bg": secondColor, "cl": msMinimumLength });
          }
        }

        // Add this set of commands to the overall list
        $scope.cmds.push({ "id": logicalCol - 1, "commandList": cmdList.slice(0) });

        // clear out commands.
        cmdList = [];

        logicalCol++;
      }

      var testCmds = $scope.cmds;
      var cmdsLength = testCmds.length;
      var cmdsIndex = 0;
      var col;
      while (cmdsIndex < cmdsLength)
      {
        $scope.executeCmdA(cmdsIndex, testCmds[cmdsIndex].commandList);
        
        cmdsIndex++;
      }
    };

    $scope.executeCmdA = function(logicalCol, cmd)
    {
      if (!cmd.length)
      {
        return;
      }

      var currentCmd = cmd[0];
      // if we are not waiting, highlight the section
      if (currentCmd.bg)
      {
        $scope.toggleSections("HighlightSection", $scope.myData[logicalCol].sectionList);
      }
      else
      {
        $scope.toggleSections("ResetSection", $scope.myData[logicalCol].sectionList);
      }

      console.log("A: logicalCol = " + logicalCol + ". $scope.myData[logicalCol].sectionList=" + $scope.myData[logicalCol].sectionList + ". currentCmd.cl=" + currentCmd.cl);

      $timeout(function () { $scope.executeCmdB(logicalCol, cmd.slice(1)) }, currentCmd.cl);
    }

    $scope.executeCmdB = function(logicalCol, cmd)
    {
      if (!cmd.length)
      {
        return;
      }

      var currentCmd = cmd[0];
      // if we are not waiting, highlight the section
      if (currentCmd.bg)
      {
        $scope.toggleSections("HighlightSection", $scope.myData[logicalCol].sectionList);
      }
      else
      {
        $scope.toggleSections("ResetSection", $scope.myData[logicalCol].sectionList);
      }

      console.log("B: logicalCol = " + logicalCol + ". $scope.myData[logicalCol].sectionList=" + $scope.myData[logicalCol].sectionList + ". currentCmd.cl=" + currentCmd.cl);

      $timeout(function () { $scope.executeCmdB(logicalCol, cmd.slice(1)) }, currentCmd.cl);
    }

    $scope.toggleSections = function (command, sectionList)
    {
      var sections = sectionList.split(",");
      var length = sections.length;
      var section;
      for (var i = 0; i < length; i++)
      {
        section = document.getElementById(sections[i].trim());
        if (section)
        {
          if (command === "HighlightSection")
          {
            section.style = $scope.showStyle;
          }
          else
          {
            section.style = $scope.defaultStyle;
          }
        }
      }
    }

    $scope.updateSectionList = function (event)
    {
      if (!$scope.currentSections)
      {
        $scope.currentSections = event.currentTarget.id;
      }
      else
      {
        // If the current target is already in the list, remove it.
        if ($scope.currentSections.indexOf(event.currentTarget.id) > -1)
        {
          event.currentTarget.style = $scope.defaultStyle;
          return;
        }

        $scope.currentSections += ", " + event.currentTarget.id;
      }

      event.currentTarget.style = $scope.selectedStyle;

      //$scope.myData[$scope.currentGroupNumber] = { "id": $scope.currentGroupNumber, "sectionList" : $scope.currentSections };
      //$scope.currentGroupNumber++;

      // Unset the current sections
    };

    $scope.createGroup = function (event)
    {
      //alert("pl");
      // Need another function that keeps track of the selected sections.  Would be nice to update mydata as you click.

      $scope.myData.push({ "id": $scope.currentGroupNumber, "sectionList" : $scope.currentSections, "bg" : "162,157,176" });
      $scope.currentGroupNumber++;
      $scope.currentSections = null;

      // Unset the current sections
    };

    $scope.changeLayout = function (stadiumLayout)
    {
      $rootScope.currentStadiumLayout = stadiumLayout;
      $scope.myData = stadiumLayout.columns;
      $scope.layoutname = stadiumLayout.name;      
      $scope.currentGroupNumber = stadiumLayout.columns.length;
      $scope.existingLayout = true;
    };

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

    if ($rootScope.currentClient && $rootScope.currentClient.externalStadiumId)
    {
    }

    $scope.saveLayout = function ()
    {
      if (!$scope.existingLayout)
      {
        var layout = new LogicalLayout2({
          _stadiumId: $rootScope.currentStadium._id,
          name: $scope.layoutname,
          columns: $scope.myData
        });

        // Save the layout.
        layout.$save(function (response)
        {
          if (response._id)
          {
            alert("Layout successfully created.");
          }
        });
      }
      else
      {
        $rootScope.currentStadiumLayout.columns = $scope.myData;

        // Update the layout.
        $rootScope.currentStadiumLayout.$update(function (response)
        {
          if (response._id)
          {
            alert("Layout successfully updated.");
          }
        });
      }
    };

    $scope.deleteLayout = function ()
    {
      if ($rootScope.currentStadiumLayout)
      {
        $rootScope.currentStadiumLayout.$delete();
        $location.path('/shows/');
      }
    };

    $scope.setShowType = function (type)
    {
      $scope.currentShowType = type;
    };

  }]);