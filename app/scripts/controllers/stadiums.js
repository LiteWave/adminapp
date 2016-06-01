'use strict';

var app = angular.module('liteWaveApp');
app.controller('StadiumsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Stadiums', 'Levels',
  function ($rootScope, $scope, $routeParams, $location, Clients, Stadiums, Levels)
  {
    $rootScope.currentArea = "stadiums";
    $scope.stadiumInfo;
    $scope.sectionFloor = [];
    $scope.sectionOne = [];
    $scope.sectionTwo = [];
    $scope.sectionThree = [];

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);
    });

    $scope.processStadiumContents = function (contents)
    {
      if (contents)
      {
        $scope.stadiumInfo = JSON.parse(contents);
        $scope.buildSections();
      }
    }

    $scope.readStadiumInfo = function (filePath)
    {
      if (window.File && window.FileReader && window.FileList && window.Blob)
      {
        var reader = new window.FileReader();

        $scope.fileInput = ""; //placeholder for text output
        if (filePath.files && filePath.files[0])
        {
          reader.onload = function (e)
          {
            $scope.processStadiumContents(e.target.result);
          };
          reader.readAsText(filePath.files[0]);
        }
      }
    }

    $scope.getSeats = function (section)
    {
      var startLength = section.START;
      var endLength = section.END;
      var seatArray = [];
      for (var index = startLength; index <= endLength; index++)
      {
        seatArray.push(index.toString());
      }
      
      return seatArray;
    }

    $scope.getRows = function (section)
    {
      var rowArray = [];
      rowArray.push({ "name": section.ROW, "seats": $scope.getSeats(section) });
      return rowArray;
    }

    $scope.getDummySeats = function ()
    {
      var seatArray = [];
      seatArray.push("A");
      seatArray.push("B");
      seatArray.push("C");
      seatArray.push("D");
      seatArray.push("E");

      return seatArray;
    }

    $scope.getDummyRows = function ()
    {
      var rowArray = [];

      for (var index = 1; index < 9; index++)
      {
        rowArray.push({ "name": index.toString(), "seats": $scope.getDummySeats() });
      }

      return rowArray;
    }

    $scope.buildSections = function ()
    {
      $scope.sectionFloor = [];
      $scope.sectionOne = [];
      $scope.sectionTwo = [];
      $scope.sectionThree = [];

      var objectLength = $scope.stadiumInfo.length;
      var currentSection;
      var previousSectionName;
      var currentSectionName;
      var level;
      var rowArray = [];
      for (var index = 0; index < objectLength; index++)
      {
        currentSection = $scope.stadiumInfo[index];
        currentSectionName = currentSection.SECTION;

        if (index === 0)
        {
          previousSectionName = currentSectionName;
        }

        if (currentSectionName !== previousSectionName)
        {
          // find out what section array we need to work with.
          level = previousSectionName.charAt(0);

          // We have a new section name, that means we need to save the current rows their correct section array.
          switch (level)
          {
            case "1":
              $scope.sectionOne.push({ "name": previousSectionName, "rows": rowArray });
              break;
            case "2":
              $scope.sectionTwo.push({ "name": previousSectionName, "rows": rowArray });
              break;
            case "3":
              $scope.sectionThree.push({ "name": previousSectionName, "rows": rowArray });
              break;
          }

          // clear out current rows as we just added them to the correct section array.
          rowArray = [];

          // Add this new row to the new array
          rowArray.push({ "name": currentSection.ROW, "seats": $scope.getSeats(currentSection) });

          // Set the previous section name as the new section name.
          previousSectionName = currentSectionName;
        }
        else
        {
          rowArray.push({ "name": currentSection.ROW, "seats": $scope.getSeats(currentSection) });
        }

      }

      /*for (var index = 0; index < 8; index++)
      {
        $scope.sectionFloor.push({ "name": index.toString(), "rows": $scope.getDummyRows() });
      }*/
    }

    $scope.saveStadium = function ()
    {
      // Create Section for each floor, save them, get id, then save 
      var levelInfo = [];

      var stadium = new Stadiums({
        name: $scope.name,
        _clientId: $rootScope.currentClient._id
      });

      stadium.$save(function (response0)
      {
        console.log(response0);

        if (response0._id)
        {
          /*var level1 = new Levels({
            _stadiumId: response0._id,
            name: "floor",
            sections: $scope.sectionFloor
          });*/

          /*level1.$save(function (response1)
          {
            console.log(response1);

            if (response1._id)
            {
              levelInfo.push({ "name": "floor", "_levelId": response1._id });*/

              var level2 = new Levels({
                _stadiumId: response0._id,
                name: "one",
                sections: $scope.sectionOne
              });

              level2.$save(function (response2)
              {
                console.log(response2);

                if (response2._id)
                {
                  levelInfo.push({ "name": "one", "_levelId": response2._id });

                  var level3 = new Levels({
                    _stadiumId: response0._id,
                    name: "two",
                    sections: $scope.sectionTwo
                  });

                  level3.$save(function (response3)
                  {
                    console.log(response3);

                    if (response3._id)
                    {
                      levelInfo.push({ "name": "two", "_levelId": response3._id });

                      var level4 = new Levels({
                        _stadiumId: response0._id,
                        name: "three",
                        sections: $scope.sectionThree
                      });

                      level4.$save(function (response4)
                      {
                        console.log(response4);

                        if (response4._id)
                        {
                          levelInfo.push({ "name": "three", "_levelId": response4._id });

                          stadium.levels = levelInfo;
                          stadium.$update();
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      //});
    //};

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